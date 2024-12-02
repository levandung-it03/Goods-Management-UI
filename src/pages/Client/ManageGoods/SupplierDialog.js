import { useMemo, memo } from "react";
import "./SupplierDialog.scss";
import { FormatterDict, Table } from "@reusable/TableHMCompos/TableHMCompos";
import { InputBuilder } from "@reusable/FormHMCompos/FormHMCompos";
import { UserSupplierService } from "@services/SupplierService";
import { UtilMethods } from "@reusable/Utils";

function SupplierDialog({ setSupplierInputState, onClose }) {
    const primaryKeyName = useMemo(() => "supplierId", []);
    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        tableInfo: {
            title: "Supplier Dialog To Select",
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
        },
        moreReducers: [
            FormatterDict.TableRowMoreReducer("onClick", (e, rowData) => {
                setSupplierInputState(rowData);
                onClose();
            })
        ]
    }), [primaryKeyName, setSupplierInputState]);

    return (
        <div className="supplier-dialog">
            <Table
                tableComponents={tableComponents}
                tableModes={FormatterDict.TableModes(false, false, false, false, false)}
            />
        </div>
    );
}
export default memo(SupplierDialog);