import { useState, memo, useMemo, useEffect, useRef } from 'react';
import './MultiSelectField.scss';
import { useController, useFormContext } from 'react-hook-form';
import { X } from 'lucide-react';

function MultiSelect({ name, validators, options, placeholder, defaultValue = [], ...rest }) {
    const { trigger, control } = useFormContext();
    const {
        field,
        fieldState: { error = {} },
    } = useController({ name, control, rules: { validate: validators }, defaultValue });
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const multiSelectFieldRef = useRef();

    // Built Options: {value:text, ...} instead of [{value:text}, ...]
    const optionsObj = useMemo(() => options.reduce((acc, obj) => ({ ...acc, [obj.value]: obj.text }), {}), [options]);

    // Filter out props that are events with the prefix 'on'
    const { events, props } = useMemo(
        () =>
            Object.keys(rest).reduce(
                (acc, key) => {
                    if (typeof rest[key] === 'function' && key.startsWith('on')) acc.events[key] = rest[key];
                    else acc.props[key] = rest[key];
                    return acc;
                },
                { events: {}, props: {} },
            ),
        [rest],
    );

    const handleSelect = (newValue) => {
        if (!field.value.find((value) => value === newValue)) {
            setInputValue('');
            field.onChange([...field.value, newValue]);
            events.onChange && events.onChange(field.value);
        }
    };

    const handleRemove = (e, rmvValue) => {
        e.stopPropagation();
        const updatedValues = field.value.filter((value) => rmvValue !== value);
        field.onChange(updatedValues);
        setInputValue('');
        events.onChange && events.onChange(updatedValues);
    };

    const handlePopElementByBackspace = (e) => {
        if (e.key === 'Backspace' && !inputValue) {
            const updatedValues = field.value.slice(0, -1);
            field.onChange(updatedValues);
            events.onChange && events.onChange(updatedValues);
        }
    };

    useEffect(() => {
        if (isOpen) {
            const handleClickOutside = (e) => {
                if (multiSelectFieldRef.current && !multiSelectFieldRef.current.contains(e.target)) {
                    setIsOpen(false);
                    setInputValue('');
                    validators && trigger(name);
                    events.onBlur && events.onBlur(field.value);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);

            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, events, field.value, name, trigger, validators]);

    return (
        <>
            <div
                className={`multi-select-field ${error.message ? 'error' : ''}`}
                data-active={!!field.value.length || isOpen}
                ref={multiSelectFieldRef}
                {...events}
                {...props}
            >
                <div className="field-wrapper" onMouseDown={(e) => e.button === 0 && !props.disabled && setIsOpen(true)}>
                    <div className="selected-values">
                        {!field.value.length && placeholder && <span className="placeholder">{placeholder}</span>}
                        {field.value.map((selectedValue, index) => (
                            <div key={index} className="selected-value center">
                                <span>{optionsObj[selectedValue]}</span>
                                {isOpen && <X onClick={(e) => handleRemove(e, selectedValue)} />}
                            </div>
                        ))}
                        {!props.disabled && (
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handlePopElementByBackspace}
                                hidden={!isOpen}
                            />
                        )}
                    </div>
                    {props.label && (
                        <>
                            <label htmlFor={props.id}>{props.label}</label>
                            <fieldset>
                                <legend>
                                    <span>{props.label}</span>
                                </legend>
                            </fieldset>
                        </>
                    )}
                    {isOpen && (
                        <div className="options-container" onMouseDown={(e) => e.preventDefault()}>
                            {options.map(
                                (option, index) =>
                                    option.text.toLowerCase().includes(inputValue.toLowerCase()) && (
                                        <div key={index} className="option" onClick={(e) => handleSelect(option.value)}>
                                            <span>{option.text}</span>
                                        </div>
                                    ),
                            )}
                        </div>
                    )}
                </div>
                {error.message && <div className="error-msg">{error.message}</div>}
            </div>
        </>
    );
}

export default memo(MultiSelect);
