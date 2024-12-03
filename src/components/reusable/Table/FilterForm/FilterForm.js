import { cloneElement, memo, useEffect, useRef, useState } from 'react';
import { ListFilter, X } from 'lucide-react';
import InputField from '@reusable/FormRHF/InputField/InputField';
import SelectField from '@reusable/FormRHF/SelectField/SelectField';
import MultiSelectField from '@reusable/FormRHF/MultiSelectField/MultiSelectField';
import FormRHF from '@reusable/FormRHF/FormRHF';

function FilterForm({ columns, handleFilter }) {
    const [isOpen, setIsOpen] = useState(false);
    const filterFormRef = useRef();

    useEffect(() => {
        if (isOpen) {
            const handleClickOutside = (e) => {
                if (filterFormRef.current && !filterFormRef.current.contains(e.target)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);

            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);
    return (
        <div className="tool-button" ref={filterFormRef}>
            <ListFilter className="tool-icon" onClick={() => setIsOpen(!isOpen)} />
            <FormRHF className={`filter-box${isOpen ? ' open' : ''}`} onSubmit={handleFilter}>
                <div className="filter-header">
                    <span>Filter</span>
                    <X onClick={() => setIsOpen(!isOpen)} />
                </div>
                <div className="filter-body">
                    {columns.map((col, index) => {
                        const cellComponent = col.cell ? cloneElement(col.cell(), { name: col.accessorKey }) : <span></span>;
                        const validComponents = [InputField, SelectField, MultiSelectField];

                        return (
                            col.filterable !== false && (
                                <div key={index} className="filter-criteria">
                                    <span>{col.header}</span>
                                    {validComponents.includes(cellComponent.type) ? cellComponent : <InputField name={col.accessorKey} />}
                                </div>
                            )
                        );
                    })}
                </div>
                <button className="filter-footer">
                    <ListFilter />
                    <span>Confirm</span>
                </button>
            </FormRHF>
        </div>
    );
}
export default memo(FilterForm);
