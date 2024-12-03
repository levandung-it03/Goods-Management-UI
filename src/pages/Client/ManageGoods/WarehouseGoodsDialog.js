import { useMemo } from 'react';
import './WarehouseGoodsDialog.scss';
import { FormatterDict, Table } from '@reusable/TableHMCompos/TableHMCompos';
import { InputBuilder } from '@reusable/FormHMCompos/FormHMCompos';
import { UserGoodsService } from '@services/GoodsService';

export default function WarehouseGoodsDialog({ goodsId }) {
    const primaryKeyName = "warehouseGoodsId";
    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        tableInfo: {
            title: 'Manage Goods Table',
            primaryKeyName: primaryKeyName,
            columnsInfo: [
                FormatterDict.ColumnInfo('warehouseGoodsId', 'Warehouse Goods Id'),
                FormatterDict.ColumnInfo('warehouseId', 'Warehouse Id'),
                FormatterDict.ColumnInfo('warehouseName', 'Warehouse Name'),
                FormatterDict.ColumnInfo('address', 'Warehouse Address'),
                FormatterDict.ColumnInfo('currentQuantity', 'Goods Quantity'),
            ],
            filterFields: [
                FormatterDict.FilterField('warehouseGoodsId', 'Warehouse Goods Id', InputBuilder({ type: 'number' })),
                FormatterDict.FilterField('warehouseId', 'Warehouse Id', InputBuilder({ type: 'number' })),
                FormatterDict.FilterField('warehouseName', 'Warehouse Name', InputBuilder({ type: 'text' })),
                FormatterDict.FilterField('address', 'Warehouse Address', InputBuilder({ type: 'text' })),
                FormatterDict.FilterField('currentQuantity', 'Goods Quantity', InputBuilder({ type: 'number' })),
            ],
            sortingFields: [
                FormatterDict.SortingField('warehouseGoodsId', 'Warehouse Goods Id'),
                FormatterDict.SortingField('warehouseId', 'Warehouse Id'),
                FormatterDict.SortingField('warehouseName', 'Warehouse Name'),
                FormatterDict.SortingField('address', 'Warehouse Address'),
                FormatterDict.SortingField('currentQuantity', 'Goods Quantity'),
            ],
        },
        apiServices: {
            GET_service: {
                moreParams: { goodsId },
                action: UserGoodsService.getGoodsFromWarehousePages
            },
        },
    }), [primaryKeyName, goodsId]);

    return (
        <div className="warehouse-goods-dialog">
            <Table
                tableComponents={tableComponents}
                tableModes={FormatterDict.TableModes(false, false, false, false, false)}
            />
        </div>
    );
}
