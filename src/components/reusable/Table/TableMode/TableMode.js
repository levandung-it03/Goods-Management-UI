import { GripVertical, Plus, Send } from 'lucide-react';
import { memo, useCallback } from 'react';

const initialTableDetail = {
    currentPage: 1,
    selectedRows: {},
    tableData: [],
};

function TableMode({
    tableMode,
    tableDetail = initialTableDetail,
    row,
    rowIndex,
    setRowState,
    handleSelect,
    handleSelectAll,
    handleAdd,
    handleRowSubmit,
}) {
    const { isEditing, isInserting, isAdding } = row?.rowState || {};
    const { enableSelect, enableDnd, enableInsert } = tableMode || {};
    const { currentPage, selectedRows, tableData } = tableDetail;
    const selectedRowsInCurrentPage = selectedRows[currentPage] || {};

    const handleSend = useCallback(() => {
        if (isAdding) {
            handleAdd();
        } else {
            handleRowSubmit(row);
            setRowState(row.id)({ isEditing: false });
        }
    }, [handleAdd, handleRowSubmit, isAdding, row, setRowState]);

    // rowIndex = -1 nghĩa là row cho header
    if (rowIndex === -1)
        return (
            enableSelect && (
                <div className="table-mode center">
                    <div className="mode-wrapper center">
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={Object.keys(selectedRowsInCurrentPage).length === tableData.length}
                        />
                    </div>
                </div>
            )
        );

    return (
        <div className="table-mode center">
            {isInserting || isEditing || isAdding ? (
                <Send className="send-icon" onClick={handleSend} />
            ) : (
                <>
                    {enableInsert && (
                        <div className="mode-wrapper center">
                            <Plus />
                        </div>
                    )}
                    {enableDnd && (
                        <div className="mode-wrapper center">
                            <GripVertical />
                        </div>
                    )}
                    {enableSelect && (
                        <div className="mode-wrapper center">
                            <input
                                type="checkbox"
                                onChange={() => handleSelect(row)}
                                checked={selectedRowsInCurrentPage.hasOwnProperty(row.rowIndex)}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default memo(TableMode);
