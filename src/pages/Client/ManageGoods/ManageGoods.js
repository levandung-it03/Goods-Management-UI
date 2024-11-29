import { useMemo, useState } from "react";
import "./ManageGoods.scss";
import { FormatterDict, Table } from "@reusable/TableHMCompos/TableHMCompos";
import { InputBuilder, SelectBuilder } from "@reusable/FormHMCompos/FormHMCompos";
import ContextMenu from "@reusable/ContextMenu/ContextMenu";
import Dialog from "@reusable/Dialog/Dialog";
import { UserGoodsService } from "@services/GoodsService";

export default function ManageGoods() {
    const [contextMenu, setContextMenu] = useState({});
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        tableInfo: {
            primaryKeyName: "goodsId",
            columnsInfo: [
                FormatterDict.ColumnInfo('goodsId', 'Goods Id', { name: "goodsId", builder: InputBuilder({ type: "text", readonly: true }) }),
                FormatterDict.ColumnInfo('goodsName', 'Goods Name', { name: "goodsName", builder: InputBuilder({ type: "text", readonly: true }) }),
                FormatterDict.ColumnInfo('unitPrice', 'Unit Price', { name: "unitPrice", builder: InputBuilder({ type: "number", validators: [
                    v => v - Number.parseInt(v) === 0 || "Must be integer",
                    v => v > 0 || "Must be positive",
                ] }) }),
                FormatterDict.ColumnInfo('supplierName', 'Supplier Name', { name: "supplierName",
                    builder: InputBuilder({ type: "text", readonly: true }) }),
            ],
        },
        apiServices: {
            GET_service: { action: UserGoodsService.getGoodsPages },
            UPDATE_service: { action: UserGoodsService.updateGoods },
        },
    }), []);

    const addingFormComponents = useMemo(() => FormatterDict.AddingFormComponents({
        apiServices: {
            POST_service: { action: UserGoodsService.addGoods },
        },
        childrenBuildersInfo: [
            { name: "goodsName", builder: InputBuilder({ type: "text", readonly: true }) },
            { name: "unitPrice", builder: InputBuilder({ type: "number", validators: [
                v => v - Number.parseInt(v) === 0 || "Must be integer",
                v => v > 0 || "Must be positive",
            ] }) },
            // { name: "supplierId", builder: SelectBuilder({ options:  }) }
        ],
    }), []);

    const contextMenuComponents = useMemo(() => FormatterDict.ContextMenuComponents([
    ]), []);

    return (
        <div className="slides-table">
            <Table
                tableComponents={tableComponents}
                addingFormComponents={addingFormComponents}
                contextMenuComponents={contextMenuComponents}
                tableModes={FormatterDict.TableModes(false, true, true, true, true)}
            />
            <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </div>
    );   
}