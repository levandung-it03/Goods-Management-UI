import { useMemo, useState } from 'react';
import './ManageGoods.scss';
import { FormatterDict, Table } from '@reusable/TableHMCompos/TableHMCompos';
import { InputBuilder, SpanMockInputBuilder } from '@reusable/FormHMCompos/FormHMCompos';
import Dialog from '@reusable/Dialog/Dialog';
import { UserGoodsService } from '@services/GoodsService';
import { UtilMethods } from '@reusable/Utils';
import SupplierDialog from './SupplierDialog';
import WarehouseGoodsDialog from './WarehouseGoodsDialog';
import { Book, Trash } from 'lucide-react';

export default function ManageGoods() {
    const [dialogContent, setDialogContent] = useState(null);
    const [addingSupplierId, setAddingSupplierId] = useState(null);
    const [updatingSupplierId, setUpdatingSupplierId] = useState(null);
    const primaryKeyName = "goodsId";
    console.log(updatingSupplierId);

    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        tableInfo: {
            title: 'Manage Goods Table',
            primaryKeyName: primaryKeyName,
            columnsInfo: [
                FormatterDict.ColumnInfo('goodsId', 'Goods Id', {
                    name: 'goodsId',
                    builder: InputBuilder({ type: 'text', readOnly: true }),
                }),
                FormatterDict.ColumnInfo('goodsName', 'Goods Name', {
                    name: 'goodsName',
                    builder: InputBuilder({
                        type: 'text',
                        validators: [(v) => !UtilMethods.checkIsBlank(v) || 'Value is required'],
                    }),
                }),
                FormatterDict.ColumnInfo('unitPrice', 'Unit Price', {
                    name: 'unitPrice',
                    builder: InputBuilder({
                        type: 'number',
                        validators: [
                            (v) => !UtilMethods.checkIsBlank(v) || 'Value is required',
                            (v) => v - Number.parseInt(v) === 0 || 'Must be integer',
                            (v) => v > 0 || 'Must be positive',
                        ],
                    }),
                }),
                FormatterDict.ColumnInfo('supplierName', 'Supplier Name', {
                    name: 'supplierName',
                    builder: SpanMockInputBuilder({
                        onClick: e => {
                            setDialogContent(<SupplierDialog setSupplierInputState={rowData => {
                                setUpdatingSupplierId(rowData.supplierId);
                                e.target.innerText = rowData.supplierName;
                            }} />);
                        }
                    }),
                }),
            ],
            filterFields: [
                FormatterDict.FilterField('goodsId', 'Goods Id', InputBuilder({ type: 'number' })),
                FormatterDict.FilterField('goodsName', 'Goods Name', InputBuilder({ type: 'text' })),
                FormatterDict.FilterField('unitPrice', 'Unit Price', InputBuilder({ type: 'number' })),
                FormatterDict.FilterField('supplierName', 'Supplier Name', InputBuilder({ type: 'text' })),
            ],
            sortingFields: [
                FormatterDict.SortingField('goodsId', 'Goods Id'),
                FormatterDict.SortingField('goodsName', 'Goods Name'),
                FormatterDict.SortingField('unitPrice', 'Unit Price'),
                FormatterDict.SortingField('supplierName', 'Supplier Name'),
            ],
        },
        apiServices: {
            GET_service: { action: UserGoodsService.getGoodsPages },
            UPDATE_service: { action: async formData => {
                console.log(updatingSupplierId);
                formData = { ...formData, supplierId: updatingSupplierId };
                await UserGoodsService.updateGoods(formData);
            }},
        },
    }), [updatingSupplierId]);

    const addingFormComponents = useMemo(() => FormatterDict.AddingFormComponents({
        apiServices: {
            POST_service: { action: async formData => {
                console.log(addingSupplierId);
                formData = { ...formData, supplierId: addingSupplierId };
                await UserGoodsService.addGoods(formData);
            } },
        },
        childrenBuildersInfo: [
            { name: 'goodsName', builder: InputBuilder({ type: 'text' }) },
            {
                name: 'unitPrice',
                builder: InputBuilder({
                    type: 'number',
                    validators: [(v) => v - Number.parseInt(v) === 0 || 'Must be integer', (v) => v > 0 || 'Must be positive'],
                }),
            },
            {
                name: "supplierName", builder: InputBuilder({
                    required: true, readOnly: true, 
                    onClick: e => {
                        setDialogContent(<SupplierDialog setSupplierInputState={rowData => {
                            setAddingSupplierId(rowData.supplierId);
                            e.target.innerText = rowData.supplierName;
                        }} />);
                    }
                })
            }
        ],
    }), [addingSupplierId]);
    
    const contextMenuComponents = useMemo(() => FormatterDict.ContextMenuComponents([
        (rowData, fetchTableData) => (
            { text: 'Delete Goods', icon: <Trash />, action: async () => {
                await UserGoodsService.deleteGoods(rowData[primaryKeyName]);
                fetchTableData();
            } }
        ),
        (rowData, fetchTableData) => (
            { text: 'See Goods From Warehouse', icon: <Book />, action: async () =>
                setDialogContent(<WarehouseGoodsDialog goodsId={rowData[primaryKeyName]} />) }
        )
    ]), [primaryKeyName]);

    return (
        <div className="manage-goods">
            <Table
                tableComponents={tableComponents}
                addingFormComponents={addingFormComponents}
                contextMenuComponents={contextMenuComponents}
                tableModes={FormatterDict.TableModes(true, true, true, true, true)}
            />
            <Dialog dialogContent={dialogContent} setDialogContent={setDialogContent} />
        </div>
    );
}
