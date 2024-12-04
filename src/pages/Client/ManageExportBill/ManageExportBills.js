import { useMemo, useState } from 'react';
import './ManageExportBill.scss';
import { FormatterDict, Table } from '@reusable/TableHMCompos/TableHMCompos';
import { InputBuilder } from '@reusable/FormHMCompos/FormHMCompos';
import Dialog from '@reusable/Dialog/Dialog';
import { Book } from 'lucide-react';
import { UserExportService } from '@services/ExportService';
import ExportBillWarehouseGoodsDialog from './ExportBillWarehouseGoodsDialog';

export default function ManageExportBill() {
    const [dialogContent, setDialogContent] = useState(null);
    const primaryKeyName = "exportBillId";

    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        tableInfo: {
            title: 'Manage Export Bill',
            primaryKeyName: primaryKeyName,
            columnsInfo: [
                FormatterDict.ColumnInfo('exportBillId', 'Export Bill Id'),
                FormatterDict.ColumnInfo('receiverName', 'Receiver Name'),
                FormatterDict.ColumnInfo('createdTime', 'Created Time'),
            ],
            filterFields: [
                FormatterDict.FilterField('exportBillId', 'Export Bill Id', InputBuilder({ type: 'number' })),
                FormatterDict.FilterField('receiverName', 'Receiver Name', InputBuilder({ type: 'text' })),
                FormatterDict.FilterField('fromCreatedTime', 'From Created Time', InputBuilder({ type: 'datetime-local' })),
                FormatterDict.FilterField('toCreatedTime', 'To Created Time', InputBuilder({ type: 'datetime-local' })),
            ],
            sortingFields: [
                FormatterDict.SortingField('exportBillId', 'Goods Id'),
                FormatterDict.SortingField('receiverName', 'Receiver Name'),
                FormatterDict.SortingField('createdTime', 'Goods Name'),
            ],
        },
        apiServices: {
            GET_service: { action: UserExportService.getExportBillPages },
        },
    }), [primaryKeyName]);
    
    const contextMenuComponents = useMemo(() => FormatterDict.ContextMenuComponents([
        (rowData, fetchTableData) => (
            { text: 'See Goods From Warehouse', icon: <Book />, action: async () =>
                setDialogContent(<ExportBillWarehouseGoodsDialog exportBillId={rowData[primaryKeyName]} />) }
        )
    ]), [primaryKeyName]);

    return (
        <div className="manage-export-bill">
            <Table
                tableComponents={tableComponents}
                contextMenuComponents={contextMenuComponents}
                tableModes={FormatterDict.TableModes(false, false, false, false, true)}
            />
            <Dialog dialogContent={dialogContent} setDialogContent={setDialogContent} />
        </div>
    );
}
