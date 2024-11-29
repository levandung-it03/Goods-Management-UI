import { cloneElement, memo, useEffect, useMemo } from 'react';

function TableRow({ columns, row, createRowProps, setRowState, tableMode }) {
    const props = useMemo(() => {
        if (createRowProps && setRowState) return createRowProps(row, setRowState(row.id));
    }, [createRowProps, setRowState, row]);
    const { isInserting, isEditing, isAdding } = row.rowState || {};

    useEffect(() => {
        // Thoát chế độ (isEditing,...)
        if (isEditing) {
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    setRowState(row.id)({ isEditing: false });
                }
            };
            window.addEventListener('keydown', handleKeyDown);

            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isEditing, setRowState, row.id]);

    return (
        <div
            className={`table-row ${isInserting || isEditing || isAdding ? 'active' : ''}`}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            {...props}
        >
            {columns.map((col, index) => {
                return (
                    <div key={index} className={`table-cell ${col.disabled ? 'disabled' : ''}`}>
                        {cloneElement(col.cell(row.rowData), {
                            ...(isAdding
                                ? {
                                      name: col.accessorKey,
                                      id: col.accessorKey,
                                  }
                                : {
                                      name: isAdding ? col.accessorKey : `rows[${row.rowIndex}].${col.accessorKey}`,
                                      id: isAdding ? col.accessorKey : `rows[${row.rowIndex}].${col.accessorKey}`,
                                      disabled: !(tableMode.enableEdit || isEditing),
                                  }),
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default memo(TableRow);
