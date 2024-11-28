import './Table.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import FilterForm from './FilterForm/FilterForm';
import SortForm from './SortForm/SortForm';
import Form from '@reusable/Form/Form';
import TableMode from './TableMode/TableMode';
import TableRow from './TableRow/TableRow';
import ContextMenu from './ContextMenu/ContextMenu';
import Pagination from './Pagination/Pagination';

function Table({
    className = '',
    title,
    columns,
    createRowProps = () => {},
    addRowProps, // Cung cấp addRowProps nếu enableAdd = true
    tableDetail,
    noDataText = 'No data available',
}) {
    console.log('table');

    const { setFilterData, setSortData, setSelectedRows, setCurrentPage, setContextMenu } = tableDetail;
    const { contextMenu, currentPage, totalPages, tableData, tableMode } = tableDetail;
    const [isAdding, setIsAdding] = useState(false); // Chứa các trường trạng thái như isEditing, isAdding, isInserting,...
    const { enableFilter, enableSort, enableAdd } = tableMode;
    const { customForm: customAddRowForm, text: addRowText, ...addRowEvent } = addRowProps || {};

    // Chứa thông tin trạng thái của các row (iSelected, isEditing, isAdding, isInserting,...)
    const [allRowState, setAllRowState] = useState({});

    /* 
        Vì allRowProps chứa thông tin của CÁC row nên 1 row đổi sẽ làm allRowProps đổi => các row có tham chiếu mới
        nên allRowPropsRef sẽ chứa giá trị allRowProps cũ ở lần render trước để giữ lại tham chiếu của các row ko đổi
    */
    const allRowPropsRef = useRef({});
    const allRowProps = useMemo(() => {
        const result = tableDetail.fieldArrayMethods.fields.reduce((acc, { id, ...rowData }, rowIndex) => {
            // Nếu chưa tồn tại id HOẶC rowState có tham chiếu mới thì tạo mới
            if (!allRowPropsRef.current[id] || allRowPropsRef.current[id].rowState !== allRowState[id]) {
                acc[id] = { id, rowIndex, rowData, rowState: allRowState[id] };
            }
            // Giữ lại các row với tham chiếu cũ được lưu trong allRowPropsRef
            else {
                acc[id] = allRowPropsRef.current[id];
            }
            return acc;
        }, {});

        allRowPropsRef.current = result;
        return result;
    }, [tableDetail.fieldArrayMethods.fields, allRowState]);
    const setRowState = useCallback((id) => (data) => setAllRowState((prev) => ({ ...prev, [id]: { ...prev[id], ...data } })), []);

    // Các hàm xử lý thao tác
    const handleFilter = useCallback(
        (data) => {
            setFilterData(data);
            setCurrentPage(1);
        },
        [setFilterData, setCurrentPage],
    );

    const handleSort = useCallback(
        (data) => {
            setSortData(data);
            setCurrentPage(1);
        },
        [setSortData, setCurrentPage],
    );

    const handleSelect = useCallback((row) => tableDetail.toggleSelectRow(row), [tableDetail]);

    const handleSelectAll = useCallback(
        (e) => {
            setSelectedRows((prev) => {
                if (e.target.checked) {
                    prev[currentPage] = Object.fromEntries(tableData.map((row, index) => [index, row]));
                } else {
                    delete prev[currentPage];
                }
                return { ...prev };
            });
        },
        [currentPage, setSelectedRows, tableData],
    );

    const addFormRef = useRef();
    const handleAdd = useCallback(() => {
        addFormRef.current.requestSubmit();
    }, [addFormRef]);

    const handleRowSubmit = useCallback(
        async (row) => {
            const isValid = await tableDetail.tableFormMethods.trigger();
            if (isValid) {
                createRowProps(row, setRowState(row.id)).onSubmit(tableDetail.tableData[row.rowIndex]);
            }
        },
        [tableDetail, createRowProps, setRowState],
    );

    // Xử lý đăng kí sự kiện
    useEffect(() => {
        // Thoát chế độ (isAdding, isEditing,...)
        if (isAdding) {
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    setIsAdding();
                }
            };
            window.addEventListener('keydown', handleKeyDown);

            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isAdding]);

    return (
        <div className={`table-wrapper ${className}`}>
            <div className="table-title">{title}</div>
            <div className="table-tools">
                {enableFilter && <FilterForm columns={columns} handleFilter={handleFilter} />}
                {enableSort && <SortForm columns={columns} handleSort={handleSort} />}
            </div>
            <div className="table">
                <div className="table-header">
                    <TableMode rowIndex={-1} tableMode={tableMode} tableDetail={tableDetail} handleSelectAll={handleSelectAll} />
                    <div className="table-row">
                        {columns.map(
                            (col, index) =>
                                !col.hidden && (
                                    <div key={index} className="table-cell">
                                        {col.header}
                                    </div>
                                ),
                        )}
                    </div>
                </div>
                <div className="table-body">
                    <Form className="table-content" onSubmit={(data) => console.log(data)} methods={tableDetail.tableFormMethods}>
                        {tableDetail.fieldArrayMethods.fields.length === 0 && (
                            <div className="table-row no-data v-center">{noDataText}</div>
                        )}
                        {tableDetail.fieldArrayMethods.fields.map((row) => {
                            return (
                                <div key={row.id} className="row-wrapper" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
                                    <TableMode
                                        tableMode={tableMode}
                                        tableDetail={tableDetail}
                                        row={allRowProps[row.id]}
                                        setRowState={setRowState}
                                        handleSelect={handleSelect}
                                        handleRowSubmit={handleRowSubmit}
                                    />
                                    <TableRow
                                        columns={columns}
                                        row={allRowProps[row.id]}
                                        createRowProps={createRowProps}
                                        setRowState={setRowState}
                                        tableMode={tableMode}
                                    />
                                </div>
                            );
                        })}
                    </Form>
                    {enableAdd && addRowProps && (
                        <div className="add-row-wrapper">
                            {isAdding ? (
                                // Nếu tự custom form add thì dùng
                                customAddRowForm ? (
                                    customAddRowForm
                                ) : (
                                    <Form
                                        className="form-add-row"
                                        ref={addFormRef}
                                        onSubmit={(data) => {
                                            addRowProps.onSubmit(data);
                                            setIsAdding(false);
                                        }}
                                    >
                                        <TableMode row={{ rowState: { isAdding: true } }} handleAdd={handleAdd} />
                                        <TableRow columns={columns} row={{ rowState: { isAdding: true } }} setRowState={setRowState} />
                                    </Form>
                                )
                            ) : (
                                <div className="table-row add-row" onClick={() => setIsAdding(true)} {...addRowEvent}>
                                    <div className="table-cell">
                                        <Plus />
                                        <span>{addRowText}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
            <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}

export default Table;
