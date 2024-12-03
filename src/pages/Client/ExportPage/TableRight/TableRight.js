import Table from '@reusable/Table/Table';
import { useTable } from '@src/hooks/useTable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InputField from '@reusable/FormRHF/InputField/InputField';
import Button from '@ui/Button/Button';
import { UserGoodsService } from '@services/GoodsService';
import { checkIsBlank, checkMaxValue, checkMinValue } from '@src/utils/validators';
import './TableRight.scss';
import { UserExportService } from '@services/ExportService';

function TableRight({ data }) {
    const [receiver, setReceiver] = useState('');
    const [error, setError] = useState({});
    const tableDetail = useTable({
        pageSize: 11,
        tableMode: {
            enableEdit: true,
            enableAdd: true,
        },
    });
    const { toggleSelectRow, setTableCustomData, tableFormMethods } = tableDetail;
    const [fluxData, setFluxData] = useState([]);
    const isStreaming = useMemo(() => data.length > 0, [data]);

    const columns = useMemo(
        () => [
            {
                header: 'Goods - Warehouse',
                accessorKey: 'warehouseGoodsId',
                cell: (rowData) => (
                    <span>
                        {rowData.goodsName} - {rowData.warehouseName}
                    </span>
                ),
            },
            {
                header: 'Max Quantity',
                accessorKey: 'maxQuantity',
            },
            {
                header: 'Export Quantity',
                accessorKey: 'exportedGoodsQuantity',
                cell: (rowData) => (
                    <InputField
                        type="number"
                        defaultValue="1"
                        validators={{ minValue: (v) => (checkMinValue(v, 1) ? 'The value must be greater than 0' : null) }}
                        formatters={{
                            onBlur: (v) => Number(v),
                        }}
                    />
                ),
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
                createCellProps: (col) => {
                    const value = fluxData[row.rowIndex]?.currentQuantity;

                    if (col.accessorKey === 'maxQuantity') return { defaultValue: value };
                    else if (col.accessorKey === 'exportedGoodsQuantity')
                        return { validators: { maxVal: (v) => (checkMaxValue(v, value) ? 'Invalid value' : null) } };
                },
                onClick: handleClick,
            };
        },
        [toggleSelectRow, fluxData],
    );

    const addRowProps = useCallback(() => {
        return {
            defaultIsAdding: true,
            customForm: (
                <>
                    <input
                        placeholder="Type Receiver Name"
                        value={receiver}
                        onChange={(e) => {
                            setReceiver(e.target.value);
                            setError((p) => ({ ...p, receiver: !e.target.value }));
                        }}
                        disabled={!isStreaming}
                    />
                    {error.receiver && <div className="error-msg">Field is required</div>}
                </>
            ),
        };
    }, [isStreaming, receiver, error]);

    const handleSubmit = useCallback(async () => {
        if (receiver === '') setError((p) => ({ ...p, receiver: true }));
        else if (Object.values(error).every((value) => !value)) {
            console.log(tableDetail.tableData, receiver);
            try {
                const formData = {
                    exportedWarehouseGoods: tableDetail.tableData.map((r) => ({
                        warehouseGoodsId: r.warehouseGoodsId,
                        exportedGoodsQuantity: r.exportedGoodsQuantity,
                    })),
                    receiverName: receiver,
                };
                const response = await UserExportService.createExportBill(formData);
                if (response.httpStatusCode === 200) {
                    alert(response.message);
                }
            } catch (error) {
                console.log('Error create export bill');
            }
        }
    }, [tableDetail.tableData, receiver, error]);

    useEffect(() => {
        let controller;
        if (isStreaming) {
            setTableCustomData(data);
            controller = new AbortController();
            const signal = controller.signal;

            const fetchData = async () => {
                try {
                    // Preparation
                    const response = await UserGoodsService.fluxGoodsQuantityPreparation({
                        goodsFromWarehouseIds: data.map((r) => r.warehouseGoodsId),
                    });
                    if (response && response.httpStatusCode === 200) {
                        // Get flux data
                        const streamResponse = await UserGoodsService.fluxGoodsQuantity(signal);
                        const reader = streamResponse.body.getReader();
                        const decoder = new TextDecoder('utf-8');

                        const read = async () => {
                            const { done, value } = await reader.read();
                            if (done) return;
                            const text = decoder.decode(value, { stream: true });
                            const formattedData = text.replace(/^data:/, '').trim();
                            if (!checkIsBlank(formattedData)) {
                                const responseData = JSON.parse(formattedData);
                                setFluxData(responseData);
                                const check = await tableFormMethods.trigger();
                                setError((p) => ({ ...p, check: !check }));
                            }
                            if (!signal.aborted) await read(); // Tiếp tục đọc nếu không bị hủy
                        };
                        if (!signal.aborted) await read();
                    }
                } catch (error) {
                    if (error.name === 'AbortError') {
                        console.log('Fetch aborted.');
                    }
                }
            };
            fetchData();
        }

        // Cleanup
        return () => {
            if (controller) {
                controller.abort();
            }
        };
    }, [data, isStreaming, setTableCustomData, tableFormMethods]);

    return (
        <>
            <Table
                columns={columns}
                createRowProps={createRowProps}
                addRowProps={addRowProps}
                tableDetail={tableDetail}
                noDataText="Add and Lock Goods List Information to see this table data"
            />
            <Button disabled={!isStreaming} text="Submit" onClick={handleSubmit} />
        </>
    );
}

export default TableRight;
