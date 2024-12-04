import { useEffect, useMemo, useState } from 'react';
import './ImportBillWarehouseGoodsDialog.scss';
import { FormatterDict, Table } from '@reusable/TableHMCompos/TableHMCompos';
import { InputBuilder } from '@reusable/FormHMCompos/FormHMCompos';
import { UserImportService } from '@services/ImportService';
import { formatCurrency } from '@src/utils/formatters';

export default function ImportBillWarehouseGoodsDialog({ importBillId }) {
    const primaryKeyName = "warehouseGoodsId";
    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        tableInfo: {
            title: 'Manage Import Bill',
            primaryKeyName: primaryKeyName,
            columnsInfo: [
                FormatterDict.ColumnInfo('importBillWarehouseGoodsId', 'Bill Warehouse Goods Id'),
                FormatterDict.ColumnInfo('goodsId', 'Goods Id'),
                FormatterDict.ColumnInfo('goodsName', 'Goods Name'),
                FormatterDict.ColumnInfo('unitPrice', 'Unit Price'),
                FormatterDict.ColumnInfo('supplierName', 'Supplier Name'),
                FormatterDict.ColumnInfo('warehouseName', 'Warehouse Name'),
                FormatterDict.ColumnInfo('goodsQuantity', 'Goods Quantity'),
            ],
            filterFields: [
                FormatterDict.FilterField('importBillWarehouseGoodsId', 'Bill Warehouse Goods Id', InputBuilder({ type: 'number' })),
                FormatterDict.FilterField('goodsId', 'Goods Id', InputBuilder({ type: 'number' })),
                FormatterDict.FilterField('goodsName', 'Goods Name', InputBuilder({ type: 'text' })),
                FormatterDict.FilterField('unitPrice', 'Unit Price', InputBuilder({ type: 'number' })),
                FormatterDict.FilterField('supplierName', 'Supplier Name', InputBuilder({ type: 'text' })),
                FormatterDict.FilterField('warehouseName', 'Warehouse Name', InputBuilder({ type: 'text' })),
                FormatterDict.FilterField('goodsQuantity', 'Goods Quantity', InputBuilder({ type: 'number' })),
            ],
            sortingFields: [
                FormatterDict.SortingField('importBillWarehouseGoodsId', 'Bill Warehouse Goods Id'),
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
                moreParams: { importBillId },
                action: UserImportService.getImportBillWarehouseGoods
            },
        },
    }), [primaryKeyName, importBillId]);

    const [totalPrice, setTotalPrice] = useState(0)
    useEffect(()=>{
        const fetchTotalrice = async()=>{
            try {
                // call api
                const response = await UserImportService.getTotalImportPrice(importBillId)
                setTotalPrice(response.data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchTotalrice()
    },[importBillId])

    return (
        <div className="import-bill-warehouse-goods-dialog">
            <Table
                tableComponents={tableComponents}
                tableModes={FormatterDict.TableModes(false, false, false, false, false)}
            />
            <div className="total-price">Total Import Price: {totalPrice}đ</div>
        </div>
    );
}
