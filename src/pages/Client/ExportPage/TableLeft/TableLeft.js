import Table from '@reusable/Table/Table';
import { useTable } from '@src/hooks/useTable';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './TableLeft.scss';
import { capitalizeWords } from '@src/utils/formatters';
import { ChevronDown } from 'lucide-react';
import Button from '@ui/Button/Button';

function TableLeft({ setGoodsIds, setData }) {
    const [isLock, setIsLock] = useState(false);
    const tableDetail = useTable({
        data: [],
        pageSize: 11,
        tableMode: {
            enableSelect: true,
            enableAdd: true,
        },
    });
    const { toggleSelectRow, setTableCustomData } = tableDetail;

    const columns = useMemo(
        () => [
            {
                header: 'Goods Name',
                accessorKey: 'goodsName',
                cell: (rowData) => <span>{rowData.goodsName}</span>,
            },
            {
                header: 'Warehouse Name',
                accessorKey: 'warehouseName',
                cell: (rowData) => <span>{rowData.warehouseName}</span>,
            },
            {
                header: 'Supplier Name',
                accessorKey: 'supplierName',
                cell: (rowData) => <span>{rowData.supplierName}</span>,
            },
        ],
        [],
    );

    const createRowProps = useCallback(
        (row) => {
            const handleClick = () => toggleSelectRow(row);

            return {
                onClick: handleClick,
            };
        },
        [toggleSelectRow],
    );

    const addRowProps = useCallback(
        (setIsAdding) => {
            return {
                isAdding: true,
                customForm: <TableAdd setTableCustomData={setTableCustomData} setIsAdding={setIsAdding} />,
                text: 'Add employee',
            };
        },
        [setTableCustomData],
    );

    const handleLockTable = useCallback(() => {
        setGoodsIds(tableDetail.selectedData.map((row) => row.goodsId));
        setIsLock(true);
    }, [tableDetail.selectedData, setGoodsIds]);

    const handleUpdateGoods = useCallback(() => {
        console.log(tableDetail.selectedData);
        setIsLock(false);
        setData([]);
    }, [tableDetail.selectedData, setData]);

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

function TableAdd({ setTableCustomData, setIsAdding }) {
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
            {
                header: 'Goods Name',
                accessorKey: 'goodsName',
                cell: (rowData) => <span>{rowData.goodsName}</span>,
            },
            {
                header: 'Warehouse Name',
                accessorKey: 'warehouseName',
                cell: (rowData) => <span>{rowData.warehouseName}</span>,
            },
            {
                header: 'Supplier Name',
                accessorKey: 'supplierName',
                cell: (rowData) => <span>{rowData.supplierName}</span>,
            },
        ],
        [],
    );

    const createRowProps = useCallback(
        (row) => {
            const handleClick = () => {
                setTableCustomData((prev) => {
                    if (prev.every((r) => r.goodsId !== row.rowData.goodsId)) {
                        // setIsAdding(false);
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
            // api cần goodsName và page (get-simple-goods-pages)
            console.log(inputValue, currentPage);

            const response = {
                data: currentPage === 1 ? data1 : data2,
                totalPages: 2,
            };
            setTableData(response.data);
            setTotalPages(response.totalPages);
        };
        fetchData();
    }, [inputValue, currentPage, setTotalPages, setTableData]);

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

const data1 = [
    {
        goodsName: 'Electric Kettle',
        warehouseName: 'Main Storage',
        supplierName: 'Home Appliances Co.',
        goodsId: 1,
        price: 35.5,
    },
    {
        goodsName: 'Gaming Keyboard RGB',
        warehouseName: 'Tech Warehouse',
        supplierName: 'Gadget Supplies Ltd.',
        goodsId: 2,
        price: 80.0,
    },
    {
        goodsName: 'Air Conditioner 1.5HP',
        warehouseName: 'Cooling Depot',
        supplierName: 'Climate Systems',
        goodsId: 3,
        price: 450.0,
    },
    {
        goodsName: 'Rice Cooker 2L',
        warehouseName: 'Kitchen Storage',
        supplierName: 'Cookware Distributors',
        goodsId: 4,
        price: 60.0,
    },
    {
        goodsName: 'Bluetooth Speaker',
        warehouseName: 'Audio Hub',
        supplierName: 'SoundTech Inc.',
        goodsId: 5,
        price: 120.0,
    },
];

const data2 = [
    {
        goodsName: 'LED Monitor 24inch',
        warehouseName: 'Display Warehouse',
        supplierName: 'Vision Electronics',
        goodsId: 6,
        price: 150.0,
    },
    {
        goodsName: 'Wireless Mouse',
        warehouseName: 'Accessories Depot',
        supplierName: 'TechGear Supplies',
        goodsId: 7,
        price: 25.0,
    },
    {
        goodsName: 'Office Chair',
        warehouseName: 'Furniture Hub',
        supplierName: 'Comfort Seating Ltd.',
        goodsId: 8,
        price: 120.0,
    },
    {
        goodsName: 'Power Bank 10000mAh',
        warehouseName: 'Energy Storage',
        supplierName: 'Portable Energy Inc.',
        goodsId: 9,
        price: 40.0,
    },
    {
        goodsName: 'Smartphone Stand',
        warehouseName: 'Gadget Zone',
        supplierName: 'Phone Accessories Co.',
        goodsId: 10,
        price: 15.0,
    },
];

export default TableLeft;
