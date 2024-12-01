import { useMemo, useState } from "react";
import "./ManageSupplier.scss";
import { FormatterDict, Table } from "@reusable/TableHMCompos/TableHMCompos";
import { InputBuilder, SelectBuilder } from "@reusable/FormHMCompos/FormHMCompos";
import Dialog from "@reusable/Dialog/Dialog";
import { UserSupplierService } from "@services/SupplierService";
import { UtilMethods } from "@reusable/Utils";

export default function ManageSupplier() {
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        tableInfo: {
            title: "Manage Supplier Table",
            primaryKeyName: "supplierId",
            columnsInfo: [
                FormatterDict.ColumnInfo('supplierId', 'Supplier Id', { name: "supplierId", builder: InputBuilder({ type: "text", readOnly: true }) }),
                FormatterDict.ColumnInfo('supplierName', 'Supplier Name', { name: "supplierName", builder: InputBuilder({ type: "text", validators: [
                    v => !UtilMethods.checkIsBlank(v) || "Value is required",
                ] }) }),
                FormatterDict.ColumnInfo('supplierName', 'Supplier Name', { name: "supplierName",
                    builder: InputBuilder({ type: "text", readOnly: true }) }),
            ],
            filterFields: [
                FormatterDict.FilterField('supplierId', 'Supplier Id', InputBuilder({ type: "number" })),
                FormatterDict.FilterField('supplierName', 'Supplier Name', InputBuilder({ type: "text" })),
            ],
            sortingFields: [
                FormatterDict.SortingField('supplierId', 'Supplier Id'),
                FormatterDict.SortingField('supplierName', 'Supplier Name'),
            ]
        },
        apiServices: {
            GET_service: { action: UserSupplierService.getSupplierPages },
            UPDATE_service: { action: UserSupplierService.updateSupplier },
        },
    }), []);

    const addingFormComponents = useMemo(() => FormatterDict.AddingFormComponents({
        apiServices: {
            POST_service: { action: UserSupplierService.addSupplier },
        },
        childrenBuildersInfo: [
            { name: "supplierName", builder: InputBuilder({ type: "text", validators: [
                v => !UtilMethods.checkIsBlank(v) || "Value is required",
            ] }) },
        ],
    }), []);

    const contextMenuComponents = useMemo(() => FormatterDict.ContextMenuComponents([
    ]), []);

    return (
        <div className="manage-supplier">
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