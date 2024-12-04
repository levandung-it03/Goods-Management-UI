import { useEffect, useMemo, useState } from 'react';
import './ExportBillWarehouseGoodsDialog.scss';
import { FormatterDict, Table } from '@reusable/TableHMCompos/TableHMCompos';
import { InputBuilder } from '@reusable/FormHMCompos/FormHMCompos';
import { UserExportService } from '@services/ExportService';
import { formatCurrency } from '@src/utils/formatters';

export default function ExportBillWarehouseGoodsDialog({ exportBillId }) {
    const primaryKeyName = "warehouseGoodsId";
    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        tableInfo: {
            title: 'Manage Export Bill',
            primaryKeyName: primaryKeyName,
            columnsInfo: [
                FormatterDict.ColumnInfo('exportBillWarehouseGoodsId', 'Bill Warehouse Goods Id'),
                FormatterDict.ColumnInfo('goodsId', 'Goods Id'),
                FormatterDict.ColumnInfo('goodsName', 'Goods Name'),
                FormatterDict.ColumnInfo('unitPrice', 'Unit Price'),
                FormatterDict.ColumnInfo('supplierName', 'Supplier Name'),
                FormatterDict.ColumnInfo('warehouseName', 'Warehouse Name'),
                FormatterDict.ColumnInfo('goodsQuantity', 'Goods Quantity'),
            ],
            filterFields: [
                FormatterDict.FilterField('exportBillWarehouseGoodsId', 'Bill Warehouse Goods Id', InputBuilder({ type: 'number' })),
                FormatterDict.FilterField('goodsId', 'Goods Id', InputBuilder({ type: 'number' })),
                FormatterDict.FilterField('goodsName', 'Goods Name', InputBuilder({ type: 'text' })),
                FormatterDict.FilterField('unitPrice', 'Unit Price', InputBuilder({ type: 'number' })),
                FormatterDict.FilterField('supplierName', 'Supplier Name', InputBuilder({ type: 'text' })),
                FormatterDict.FilterField('warehouseName', 'Warehouse Name', InputBuilder({ type: 'text' })),
                FormatterDict.FilterField('goodsQuantity', 'Goods Quantity', InputBuilder({ type: 'number' })),
            ],
            sortingFields: [
                FormatterDict.SortingField('exportBillWarehouseGoodsId', 'Bill Warehouse Goods Id'),
                FormatterDict.SortingField('goodsId', 'Goods Id'),
                FormatterDict.SortingField('goodsName', 'Goods Name'),
                FormatterDict.SortingField('unitPrice', 'Unit Price'),
                FormatterDict.SortingField('supplierName', 'Supplier Name'),
                FormatterDict.SortingField('warehouseName', 'Warehouse Name'),
                FormatterDict.SortingField('goodsQuantity', 'Goods Quantity'),
            ],
        },
        apiServices: {
            GET_service: {
                moreParams: { exportBillId },
                action: UserExportService.getExportBillWarehouseGoods
            },
        },
    }), [primaryKeyName, exportBillId]);

    const [totalPrice, setTotalPrice] = useState(0)
    useEffect(()=>{
        const fetchTotalrice = async()=>{
            try {
                // call api
                const response = await UserExportService.getTotalExportPrice(exportBillId)
                setTotalPrice(response.data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchTotalrice()
    },[exportBillId])

    return (
        <div className="export-bill-warehouse-goods-dialog">
            <Table
                tableComponents={tableComponents}
                tableModes={FormatterDict.TableModes(false, false, false, false, false)}
            />
            <div className="total-price">Total Export Price: {totalPrice}đ</div>
        </div>
    );
}
