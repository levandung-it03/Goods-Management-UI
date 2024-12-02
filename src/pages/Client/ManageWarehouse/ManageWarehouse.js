import { useMemo, useState } from "react";
import "./ManageWarehouse.scss";
import { FormatterDict, Table } from "@reusable/TableHMCompos/TableHMCompos";
import { InputBuilder } from "@reusable/FormHMCompos/FormHMCompos";
import Dialog from "@reusable/Dialog/Dialog";
import { UserWarehouseService } from "@services/WarehouseService";
import { UtilMethods } from "@reusable/Utils";
import { Trash } from "lucide-react";

export default function ManageWarehouse() {
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });
    const primaryKeyName = useMemo(() => "warehouseId");
    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        tableInfo: {
            title: "Manage Warehouse Table",
            primaryKeyName: primaryKeyName,
            columnsInfo: [
                FormatterDict.ColumnInfo('warehouseId', 'Warehouse Id', { name: "warehouseId", builder: InputBuilder({ type: "text", readOnly: true }) }),
                FormatterDict.ColumnInfo('warehouseName', 'Warehouse Name', { name: "warehouseName", builder: InputBuilder({ type: "text", validators: [
                    v => !UtilMethods.checkIsBlank(v) || "Value is required",
                ] }) }),
                FormatterDict.ColumnInfo('address', 'Warehouse Address', { name: "address", builder: InputBuilder({ type: "text", validators: [
                    v => !UtilMethods.checkIsBlank(v) || "Value is required",
                ] }) }),
            ],
            filterFields: [
                FormatterDict.FilterField('warehouseId', 'Warehouse Id', InputBuilder({ type: "number" })),
                FormatterDict.FilterField('warehouseName', 'Warehouse Name', InputBuilder({ type: "text" })),
                FormatterDict.FilterField('address', 'Warehouse Adress', InputBuilder({ type: "text" })),
            ],
            sortingFields: [
                FormatterDict.SortingField('warehouseId', 'Warehouse Id'),
                FormatterDict.SortingField('warehouseName', 'Warehouse Name'),
                FormatterDict.SortingField('address', 'Warehouse Address'),
            ]
        },
        apiServices: {
            GET_service: { action: UserWarehouseService.getWarehousePages },
            UPDATE_service: { action: UserWarehouseService.updateWarehouse },
        },
    }), []);

    const addingFormComponents = useMemo(() => FormatterDict.AddingFormComponents({
        apiServices: {
            POST_service: { action: UserWarehouseService.addWarehouse },
        },
        childrenBuildersInfo: [
            { name: "warehouseName", builder: InputBuilder({ type: "text", validators: [
                v => !UtilMethods.checkIsBlank(v) || "Value is required",
            ] }) },
            { name: "address", builder: InputBuilder({ type: "text", validators: [
                v => !UtilMethods.checkIsBlank(v) || "Value is required",
            ] }) },
        ],
    }), []);

    const contextMenuComponents = useMemo(() => FormatterDict.ContextMenuComponents([
        (rowData, fetchTableData) => (
            { text: 'Delete Warehouse', icon: <Trash />, action: async () => {
                await UserWarehouseService.deleteWarehouse(rowData[primaryKeyName]);
                fetchTableData();
            } }
        ),
    ]), []);

    return (
        <div className="manage-warehouse">
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