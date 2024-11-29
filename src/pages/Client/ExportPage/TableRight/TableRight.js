import Table from '@reusable/Table/Table';
import { useTable } from '@src/hooks/useTable';
import { useCallback, useMemo } from 'react';
import InputField from '@reusable/FormRHF/InputField/InputField';
import './TableRight.scss';
import Button from '@ui/Button/Button';

function TableRight({ data }) {
    const tableDetail = useTable({
        data: data,
        pageSize: 11,
        tableMode: {
            enableEdit: true,
        },
    });
    const { toggleSelectRow } = tableDetail;

    const columns = useMemo(
        () => [
            {
                header: 'Goods Name',
                accessorKey: 'goodsName',
                cell: (rowData) => <span>{rowData.goodsName}</span>,
            },
            {
                header: 'Max Quantity',
                accessorKey: 'currentQuantity',
                cell: (rowData) => <span>{rowData.currentQuantity}</span>,
            },
            {
                header: 'Supplier',
                accessorKey: 'supplierName',
                cell: (rowData) => <InputField />,
            },
        ],
        [],
    );

    const createRowProps = useCallback(
        (row) => {
            const handleClick = () => {
                toggleSelectRow(row);
            };

            return {
                onClick: handleClick,
            };
        },
        [toggleSelectRow],
    );

    const handleSubmit = useCallback(() => {
        console.log(tableDetail.tableData);
    }, [tableDetail.tableData]);

    return (
        <>
            <Table
                columns={columns}
                createRowProps={createRowProps}
                tableDetail={tableDetail}
                noDataText="Add and Lock Goods List Information to see this table data"
            />
            <Button text="Submit" onClick={handleSubmit} />
        </>
    );
}

export default TableRight;
