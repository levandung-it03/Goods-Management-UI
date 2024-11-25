import { memo, useCallback, useMemo } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import CheckBoxInput from './CheckBoxInput/CheckBoxInput';
import DefaultInput from './DefaultInput/DefaultInput';

const defaultFormatters = {};

function InputField({ name, validators, formatters = defaultFormatters, icon, defaultValue = '', ...rest }) {
    const { control } = useFormContext();
    const {
        field,
        fieldState: { error = {} },
    } = useController({ name, control, rules: { validate: validators }, defaultValue });

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
                [...new Set([...Object.keys(formatters), ...Object.keys(events)])].map((eventName) => [
                    eventName,
                    (e) => handleEvent(eventName, e),
                ]),
            ),
        [events, formatters, handleEvent],
    );

    switch (props.type) {
        case 'file':
            return <></>;
        case 'radio':
            return <></>;
        case 'checkbox':
            return <CheckBoxInput field={field} props={props} eventHandlers={eventHandlers} error={error} />;
        default:
            return <DefaultInput field={field} props={props} eventHandlers={eventHandlers} error={error} icon={icon} />;
    }
}

export default memo(InputField);
