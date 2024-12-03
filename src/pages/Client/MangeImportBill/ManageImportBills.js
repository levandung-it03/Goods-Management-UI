import { useMemo, useState } from 'react';
import './ManageImportBill.scss';
import { FormatterDict, Table } from '@reusable/TableHMCompos/TableHMCompos';
import { InputBuilder } from '@reusable/FormHMCompos/FormHMCompos';
import Dialog from '@reusable/Dialog/Dialog';
import { Book } from 'lucide-react';
import { UserImportService } from '@services/ImportService';
import ImportBillWarehouseGoodsDialog from './ImportBillWarehouseGoodsDialog';

export default function ManageImportBill() {
    const [dialogContent, setDialogContent] = useState(null);
    const primaryKeyName = "importBillId";

    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        tableInfo: {
            title: 'Manage Goods Table',
            primaryKeyName: primaryKeyName,
            columnsInfo: [
                FormatterDict.ColumnInfo('importBillId', 'Import Bill Id'),
                FormatterDict.ColumnInfo('createdTime', 'Created Time'),
            ],
            filterFields: [
                FormatterDict.FilterField('importBillId', 'Import Bill Id', InputBuilder({ type: 'number' })),
                FormatterDict.FilterField('fromCreatedTime', 'From Created Time', InputBuilder({ type: 'datetime-local' })),
                FormatterDict.FilterField('toCreatedTime', 'To Created Time', InputBuilder({ type: 'datetime-local' })),
            ],
            sortingFields: [
                FormatterDict.SortingField('importBillId', 'Goods Id'),
                FormatterDict.SortingField('createdTime', 'Goods Name'),
            ],
        },
        apiServices: {
            GET_service: { action: UserImportService.getImportBillPages },
        },
    }), [primaryKeyName]);
    
    const contextMenuComponents = useMemo(() => FormatterDict.ContextMenuComponents([
        (rowData, fetchTableData) => (
            { text: 'See Goods From Warehouse', icon: <Book />, action: async () =>
                setDialogContent(<ImportBillWarehouseGoodsDialog importBillId={rowData[primaryKeyName]} />) }
        )
    ]), [primaryKeyName]);

    return (
        <div className="manage-import-bill">
            <Table
                tableComponents={tableComponents}
                contextMenuComponents={contextMenuComponents}
                tableModes={FormatterDict.TableModes(false, false, false, false, true)}
            />
            <Dialog dialogContent={dialogContent} setDialogContent={setDialogContent} />
        </div>
    );
}
