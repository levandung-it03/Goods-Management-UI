import Table from '@reusable/Table/Table';
import { useTable } from '@src/hooks/useTable';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './TableLeft.scss';
import { capitalizeWords } from '@src/utils/formatters';
import { ChevronDown, Trash2 } from 'lucide-react';
import Button from '@ui/Button/Button';
import { UserGoodsService } from '@services/GoodsService';

function TableLeft({ setData }) {
    const [isLock, setIsLock] = useState(false);
    const tableDetail = useTable({
        data: [],
        pageSize: 11,
        tableMode: {
            enableAdd: true,
        },
    });
    const { tableData } = tableDetail;
    const { setTableCustomData, setContextMenu } = tableDetail;

    const columns = useMemo(
        () => [
            { header: 'Goods Name', accessorKey: 'goodsName' },
            { header: 'Warehouse Name', accessorKey: 'warehouseName' },
            { header: 'Supplier Name', accessorKey: 'supplierName' },
        ],
        [],
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
                                    return prev.filter((r) => r.warehouseGoodsId !== row.rowData.warehouseGoodsId);
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
        return {
            defaultIsAdding: true,
            customForm: <TableAdd setTableCustomData={setTableCustomData} />,
        };
    }, [setTableCustomData]);

    const handleLockTable = useCallback(() => {
        setIsLock(true);
        setData(tableData);
    }, [tableData, setData]);

    const handleUpdateGoods = useCallback(() => {
        setIsLock(false);
        setData([]);
    }, [setData]);

    return (
        <>
            <Table
                className={isLock ? 'lock' : ''}
                columns={columns}
                createRowProps={createRowProps}
                addRowProps={addRowProps}
                tableDetail={tableDetail}
            />
            {isLock ? (
                <Button text="Update Goods" onClick={handleUpdateGoods} />
            ) : (
                <Button text="Lock Information" onClick={handleLockTable} />
            )}
        </>
    );
}

function TableAdd({ setTableCustomData }) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const tableRef = useRef();
    const tableDetail = useTable({
        tableMode: {
            enableSelect: true,
        },
    });
    const { currentPage } = tableDetail;
    const { setTotalPages, setTableData } = tableDetail;

    const columns = useMemo(
        () => [
            { header: 'Goods Name', accessorKey: 'goodsName' },
            { header: 'Warehouse Name', accessorKey: 'warehouseName' },
            { header: 'Supplier Name', accessorKey: 'supplierName' },
        ],
        [],
    );

    const createRowProps = useCallback(
        (row) => {
            const handleClick = () => {
                setTableCustomData((prev) => {
                    if (prev.every((r) => r.warehouseGoodsId !== row.rowData.warehouseGoodsId)) {
                        return [...prev, row.rowData];
                    }
                    return prev;
                });
            };

            return {
                onClick: handleClick,
            };
        },
        [setTableCustomData],
    );

    useEffect(() => {
        const fetchData = async () => {
            const response = await UserGoodsService.getSimpleWarehouseGoodsPages({ name: inputValue, page: currentPage });
            setTotalPages(response.data.totalPages);
            setTableData(response.data.data);
        };
        isOpen && fetchData();
    }, [isOpen, inputValue, currentPage, setTotalPages, setTableData]);

    useEffect(() => {
        if (isOpen) {
            const handleClickOutside = (e) => {
                if (tableRef.current && !tableRef.current.contains(e.target)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('click', handleClickOutside);

            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div ref={tableRef}>
            <div className="search-wrapper">
                <input
                    value={capitalizeWords(inputValue)}
                    onChange={(e) => {
                        setIsOpen(!!e.target.value);
                        setInputValue(e.target.value);
                    }}
                    placeholder="Type Goods Name"
                />
                <ChevronDown
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen((p) => !p);
                    }}
                />
            </div>
            {isOpen && (
                <div className="add-table-container">
                    <Table columns={columns} createRowProps={createRowProps} tableDetail={tableDetail} />
                </div>
            )}
        </div>
    );
}

export default TableLeft;
