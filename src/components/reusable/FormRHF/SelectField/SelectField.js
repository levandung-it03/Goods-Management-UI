import { memo, useCallback, useMemo } from 'react';
import './SelectField.scss';
import { useController, useFormContext } from 'react-hook-form';

function SelectField({ name, className = '', validators, formatters = {}, options, defaultValue, ...rest }) {
    const { control } = useFormContext();
    const {
        field,
        fieldState: { error = {} },
    } = useController({ name, control, rules: { validate: validators }, defaultValue: defaultValue || options[0].value });

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

    const handleEvent = useCallback(
        (eventName, e) => {
            if (formatters[eventName]) {
                const currentValue = Array.isArray(formatters[eventName])
                    ? formatters[eventName].reduce((acc, formatter) => formatter(acc), e.target.value)
                    : formatters[eventName](e.target.value);
                field.onChange(currentValue);
            }
            if (events[eventName]) events[eventName](e);
        },
        [events, field, formatters],
    );

    const eventHandlers = useMemo(
        () =>
            Object.fromEntries(
                [...new Set([...Object.keys(formatters), ...Object.keys(events)])].map((eventName) => [eventName, (e) => handleEvent(eventName, e)]),
            ),
        [events, formatters, handleEvent],
    );

    return (
        <div className={`select-field ${error.message ? 'error' : ''}`} data-active={!!field.value}>
            <div className="field-wrapper">
                <select {...field} {...eventHandlers} {...props}>
                    <option value="" hidden disabled>
                        {props.placeholder}
                    </option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.text}
                        </option>
                    ))}
                </select>
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
            </div>
            {error.message && <div className="error-msg">{error.message}</div>}
        </div>
    );
}

export default memo(SelectField);
