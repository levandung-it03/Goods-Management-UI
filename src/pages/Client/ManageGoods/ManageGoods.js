import { useMemo, useState } from 'react';
import './ManageGoods.scss';
import { FormatterDict, Table } from '@reusable/TableHMCompos/TableHMCompos';
import { InputBuilder } from '@reusable/FormHMCompos/FormHMCompos';
import Dialog from '@reusable/Dialog/Dialog';
import { UserGoodsService } from '@services/GoodsService';
import { UtilMethods } from '@reusable/Utils';

export default function ManageGoods() {
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const tableComponents = useMemo(
        () =>
            FormatterDict.TableComponents({
                tableInfo: {
                    title: 'Manage Goods Table',
                    primaryKeyName: 'goodsId',
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
                            builder: InputBuilder({ type: 'text', readOnly: true }),
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
                    UPDATE_service: { action: UserGoodsService.updateGoods },
                },
            }),
        [],
    );

    const addingFormComponents = useMemo(
        () =>
            FormatterDict.AddingFormComponents({
                apiServices: {
                    POST_service: { action: UserGoodsService.addGoods },
                },
                childrenBuildersInfo: [
                    { name: 'goodsName', builder: InputBuilder({ type: 'text', readonly: true }) },
                    {
                        name: 'unitPrice',
                        builder: InputBuilder({
                            type: 'number',
                            validators: [(v) => v - Number.parseInt(v) === 0 || 'Must be integer', (v) => v > 0 || 'Must be positive'],
                        }),
                    },
                    // { name: "supplierId", builder: SelectBuilder({ options:  }) }
                ],
            }),
        [],
    );

    const contextMenuComponents = useMemo(() => FormatterDict.ContextMenuComponents([]), []);

    return (
        <div className="manage-goods">
            <Table
                tableComponents={tableComponents}
                addingFormComponents={addingFormComponents}
                contextMenuComponents={contextMenuComponents}
                tableModes={FormatterDict.TableModes(true, true, true, true, true)}
            />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </div>
    );
}
