import Table from '@reusable/Table/Table';
import './ImportPage.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTable } from '@src/hooks/useTable';
import InputField from '@reusable/FormRHF/InputField/InputField';
import { ChevronDown, Trash2 } from 'lucide-react';
import { checkIsBlank, checkMinValue } from '@src/utils/validators';
import Button from '@ui/Button/Button';
import { UserGoodsService } from '@services/GoodsService';
import Pagination from '@reusable/Table/Pagination/Pagination';
import { useForm } from 'react-hook-form';
import { UserWarehouseService } from '@services/WarehouseService';
import { UserImportService } from '@services/ImportService';
import { useNavigate } from 'react-router-dom';

function ImportPage() {
    const navigate = useNavigate()
    const addMethods = useForm();
    const tableDetail = useTable({
        data: [],
        pageSize: 12,
        tableMode: {
            enableAdd: true,
        },
    });
    const { tableData } = tableDetail;
    const { setContextMenu, setTableCustomData } = tableDetail;

    const columns = useMemo(
        () => [
            {
                header: 'Goods Name - Supplier Name',
                accessorKey: 'goodsName',
                cell: (rowData) => <CustomGoodsSelect methods={addMethods} />,
            },
            {
                header: 'Warehouse Name',
                accessorKey: 'warehouseName',
                cell: (rowData) => <CustomWarehouseSelect methods={addMethods} />,
            },
            {
                header: 'Import Quantity',
                accessorKey: 'importedGoodsQuantity',
                cell: (rowData) => (
                    <InputField
                        type="number"
                        placeholder="Type Import Quantity"
                        defaultValue="1"
                        validators={{ minValue: (v) => (checkMinValue(v, 1) ? 'The value must be greater than 0' : null) }}
                        formatters={{
                            onChange: (v) => Number(v),
                        }}
                    />
                ),
            },
        ],
        [addMethods],
    );

    const createRowProps = useCallback(
        (row) => {
            const handleContextMenu = (e) => {
                e.preventDefault();
                setContextMenu({
                    isShown: true,
                    x: e.pageX,
                    y: e.pageY,
                    menuItems: [
                        {
                            text: 'Delete Row',
                            icon: <Trash2 />,
                            action: () => {
                                setTableCustomData((prev) => {
                                    return prev.filter(
                                        (r) => r.goodsId !== row.rowData.goodsId || r.warehouseId !== row.rowData.warehouseId,
                                    );
                                });
                            },
                        },
                    ],
                });
            };

            return {
                onContextMenu: handleContextMenu,
            };
        },
        [setContextMenu, setTableCustomData],
    );

    const addRowProps = useCallback(() => {
        const handleSubmit = (rowData) => {
            if (tableData.every((r) => r.goodsId !== rowData.goodsId || r.warehouseId !== rowData.warehouseId)) {
                setTableCustomData((p) => [...p, rowData]);
            } else alert('These goods have been imported into this warehouse');
        };
        return {
            methods: addMethods,
            onSubmit: handleSubmit,
            text: 'Click to add new Goods Name',
        };
    }, [setTableCustomData, addMethods, tableData]);

    const handleSubmit = useCallback(async () => {
        console.log(tableData);
        try {
            const formData = {
                importedWarehouseGoods: tableData.map((r) => ({
                    goodsId: r.goodsId,
                    warehouseId: r.warehouseId,
                    importedGoodsQuantity: r.importedGoodsQuantity,
                })),
            };
            const response = await UserImportService.createImportBill(formData);
            if (response.httpStatusCode === 200) {
                alert(response.message);
                navigate('/')
            }
        } catch (error) {
            console.log('Error create export bill');
        }
    }, [tableData]);

    return (
        <div className="import-page flex-col">
            <div className="title center">Create Bill Of Importing Goods</div>
            <div className="content flex-col">
                <Table columns={columns} createRowProps={createRowProps} addRowProps={addRowProps} tableDetail={tableDetail} />
                <Button text="Submit" onClick={handleSubmit} />
            </div>
        </div>
    );
}

function CustomGoodsSelect({ methods, name, id, disabled }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef();
    const inputValue = methods.watch(name, '');

    const handleClick = useCallback(
        (r) => {
            methods.setValue('goodsId', r.goodsId);
            methods.setValue('goodsName', `${r.goodsName} - ${r.supplierName}`);
            setIsOpen(false);
        },
        [methods],
    );

    useEffect(() => {
        const fetchData = async () => {
            const response = await UserGoodsService.getSimpleGoodsPages({ name: inputValue, page: currentPage });
            setData(response.data.data);
            setTotalPages(response.data.totalPages);
        };
        isOpen && fetchData();
    }, [isOpen, inputValue, currentPage]);

    useEffect(() => {
        if (isOpen) {
            const handleClickOutside = (e) => {
                if (selectRef.current && !selectRef.current.contains(e.target)) {
                    setIsOpen(false);
                    methods.setValue(name, '');
                }
            };
            document.addEventListener('click', handleClickOutside);

            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isOpen, methods, name]);

    return (
        <div className="custom-select" ref={selectRef}>
            <div className="search-wrapper" onChange={() => setIsOpen(true)}>
                <InputField
                    name="goodsId"
                    hidden={true}
                    validators={{ required: (v) => (checkIsBlank(v) ? alert('Please select option below') : null) }}
                />
                <InputField
                    id={id}
                    name={name}
                    disabled={disabled}
                    placeholder="Type Goods Name"
                    validators={{ required: (v) => (checkIsBlank(v) ? 'Field is requied' : null) }}
                />
                {!disabled && (
                    <ChevronDown
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen((p) => !p);
                            methods.setValue(name, '');
                        }}
                    />
                )}
            </div>
            {isOpen && (
                <div className="option-container">
                    {data.map((r, i) => (
                        <div key={i} className="option" onClick={() => handleClick(r)}>
                            {r.goodsName} - {r.supplierName}
                        </div>
                    ))}
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                </div>
            )}
        </div>
    );
}

function CustomWarehouseSelect({ methods, name, id, disabled }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef();
    const inputValue = methods.watch(name);

    const handleClick = useCallback(
        (r) => {
            methods.setValue('warehouseId', r.warehouseId);
            methods.setValue(name, r.warehouseName);
            setIsOpen(false);
        },
        [methods, name],
    );

    useEffect(() => {
        const fetchData = async () => {
            const response = await UserWarehouseService.getSimpleWarehousePages({ name: inputValue, page: currentPage });
            setData(response.data.data);
            setTotalPages(response.data.totalPages);
        };
        isOpen && fetchData();
    }, [isOpen, inputValue, currentPage]);

    useEffect(() => {
        if (isOpen) {
            const handleClickOutside = (e) => {
                if (selectRef.current && !selectRef.current.contains(e.target)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('click', handleClickOutside);

            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div className="custom-select" ref={selectRef}>
            <div className="search-wrapper" onChange={() => setIsOpen(true)}>
                <InputField
                    name="warehouseId"
                    hidden={true}
                    validators={{ required: (v) => (checkIsBlank(v) ? alert('Please select option below') : null) }}
                />
                <InputField
                    id={id}
                    name={name}
                    disabled={disabled}
                    placeholder="Type Warehouse Name"
                    validators={{ required: (v) => (checkIsBlank(v) ? 'Field is requied' : null) }}
                />
                {!disabled && (
                    <ChevronDown
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen((p) => !p);
                            methods.setValue(name, '');
                        }}
                    />
                )}
            </div>
            {isOpen && (
                <div className="option-container">
                    {data.map((r, i) => (
                        <div key={i} className="option" onClick={() => handleClick(r)}>
                            {r.warehouseName}
                        </div>
                    ))}
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                </div>
            )}
        </div>
    );
}

export default ImportPage;
