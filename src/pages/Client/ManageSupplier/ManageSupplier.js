import { useMemo } from "react";
import "./ManageSupplier.scss";
import { FormatterDict, Table } from "@reusable/TableHMCompos/TableHMCompos";
import { InputBuilder } from "@reusable/FormHMCompos/FormHMCompos";
import { UserSupplierService } from "@services/SupplierService";
import { UtilMethods } from "@reusable/Utils";
import { Trash } from "lucide-react";

export default function ManageSupplier() {
    const primaryKeyName = useMemo(() => "supplierId", []);
    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        tableInfo: {
            title: "Manage Supplier Table",
            primaryKeyName: primaryKeyName,
            columnsInfo: [
                FormatterDict.ColumnInfo('supplierId', 'Supplier Id', { name: "supplierId", builder: InputBuilder({ type: "text", readOnly: true }) }),
                FormatterDict.ColumnInfo('supplierName', 'Supplier Name', { name: "supplierName", builder: InputBuilder({ type: "text", validators: [
                    v => !UtilMethods.checkIsBlank(v) || "Value is required",
                ] }) }),
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
    }), [primaryKeyName]);

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
        (rowData, fetchTableData) => (
            { text: 'Delete Supplier', icon: <Trash />, action: async () => {
                await UserSupplierService.deleteSupplier(rowData[primaryKeyName]);
                fetchTableData();
            } }
        )
    ]), [primaryKeyName]);

    return (
        <div className="manage-supplier">
            <Table
                tableComponents={tableComponents}
                addingFormComponents={addingFormComponents}
                contextMenuComponents={contextMenuComponents}
                tableModes={FormatterDict.TableModes(true, true, true, true, true)}
            />
        </div>
    );
}