import Form from '@reusable/Form/Form';
import SelectField from '@reusable/Form/SelectField/SelectField';
import { ArrowDownUp, X } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

function SortForm({ columns, handleSort }) {
    const [isOpen, setIsOpen] = useState(false);
    const sortOtions = columns.filter((col) => col.sortable !== false).map((col) => ({ value: col.accessorKey, text: col.header }));

    const sortFormRef = useRef();

    useEffect(() => {
        if (isOpen) {
            const handleClickOutside = (e) => {
                if (sortFormRef.current && !sortFormRef.current.contains(e.target)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);

            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div className="tool-button" ref={sortFormRef}>
            <ArrowDownUp className="tool-icon" onClick={() => setIsOpen(!isOpen)} />
            <Form className={`sort-box${isOpen ? ' open' : ''}`} onSubmit={handleSort}>
                <div className="sort-header">
                    <span>Sort</span>
                    <X onClick={() => setIsOpen(!isOpen)} />
                </div>
                <div className="sort-body">
                    <div className="sort-criteria">
                        <SelectField name="sortedField" placeholder="Field" options={sortOtions} />
                        <SelectField
                            name="sortedMode"
                            placeholder="Mode"
                            options={[
                                { value: 1, text: 'Ascending' },
                                { value: -1, text: 'Descending' },
                            ]}
                        />
                    </div>
                </div>
                <button className="sort-footer">
                    <ArrowDownUp />
                    <span>Confirm</span>
                </button>
            </Form>
        </div>
    );
}

export default memo(SortForm);
