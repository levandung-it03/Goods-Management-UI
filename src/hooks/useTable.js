import { useCallback, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

const initialTableMode = {
    enableFilter: false,
    enableSort: false,
    enableSelect: false,
    enableEdit: false,
    enableDnd: false,
    enableAdd: false,
    enableInsert: false,
};

const initialData = [];

/*  fetchData: 
        - Truyền data của 1 trang thông qua setTableData (data lấy từ API response = { data: [...], totalPages : int }) 
        - Tự setTotalPages (totalPages lấy từ API response = { data: [...], totalPages : int }) 
    customData: 
        - Truyền tất cả data thông qua tableConfig
        - Tùy chỉnh customData thông qua setTableCustomData
        - Đã tự động phân trang
*/

export function useTable(tableConfig) {
    const configRef = useRef(tableConfig);
    const { data = initialData, pageSize = 10, tableMode = initialTableMode } = configRef.current;
    const [customData, setCustomData] = useState(data);

    const [selectedRows, setSelectedRows] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(Math.ceil(data.length / pageSize) || 1);
    const [filterData, setFilterData] = useState({});
    const [sortData, setSortData] = useState({});
    const [contextMenu, setContextMenu] = useState({});

    const tableFormMethods = useForm({
        defaultValues: {
            // phân trang cho customData (fetchData ko dùng)
            rows: customData.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize),
        },
    });
    const { control, reset, getValues } = tableFormMethods;
    const fieldArrayMethods = useFieldArray({ control: control, name: 'rows' });

    const customSetCurrentPage = useCallback(
        (currentPage) => {
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            setCurrentPage(currentPage);
            reset({ rows: customData.slice(start, end) });
        },
        [customData, pageSize, reset],
    );

    // Phương thức
    const setTableData = useCallback((data) => reset({ rows: data }), [reset]);

    const customDataRef = useRef(customData); // Lưu giá trị mới nhất của customData
    const setTableCustomData = useCallback(
        (arg) => {
            const newCustomData = typeof arg === 'function' ? arg(customDataRef.current) : arg;
            customDataRef.current = newCustomData;
            setCustomData(newCustomData);

            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            reset({ rows: newCustomData.slice(start, end) });
            setTotalPages(Math.ceil(newCustomData.length / pageSize));
        },
        [pageSize, currentPage, reset],
    );

    const toggleSelectRow = useCallback(
        (row, checked) => {
            setSelectedRows((prev) => {
                if (checked ?? !(prev[currentPage] || {}).hasOwnProperty(row.rowIndex)) {
                    prev[currentPage] = { ...(prev[currentPage] || {}), [row.rowIndex]: row.rowData };
                } else {
                    delete prev[currentPage][row.rowIndex];
                }
                return { ...prev };
            });
        },
        [currentPage],
    );

    // useEffect(() => {
    //     console.log('changed');
    // }, [control]);

    return {
        selectedData: Object.values(selectedRows).flatMap((row) => Object.values(row)),
        tableData: getValues('rows'),
        selectedRows,
        currentPage,
        totalPages,
        pageSize,
        filterData,
        sortData,
        contextMenu,
        tableFormMethods,
        fieldArrayMethods,
        tableMode,
        setSelectedRows,
        setCurrentPage: customSetCurrentPage,
        setTotalPages,
        setFilterData,
        setSortData,
        setContextMenu,
        setTableData,
        setTableCustomData,
        toggleSelectRow,
    };
}
