import { UtilMethods } from "@reusable/Utils";
import { forwardRef, memo, useCallback, useEffect, useMemo, useState } from "react";

function Select({
    updateFormData, defaultValuesFromForm, setValidations, validate,
    name="", validators, defaultValue, options, ...props
}) {
    const keyPref = useMemo(() => "select-compo-" + UtilMethods.timeAsKey(), []);
    const [data, setData] = useState(defaultValue);

    const handleChangeValue = useCallback(e => {
        setData(e.target.value);
        updateFormData && updateFormData(e.target);
        setValidations(prev => ({
            ...prev,
            [name]: validators.length === 0 || validate(e.target.value, validators)
        }));
    }, [updateFormData, setValidations, name]);

    useEffect(() => {  // Only set data once
        if (updateFormData
            && !UtilMethods.checkIsBlank(defaultValuesFromForm)
            && !UtilMethods.checkIsBlank(defaultValuesFromForm[name])) {
            setData(defaultValuesFromForm[name]);
            updateFormData({ name: name, value: defaultValuesFromForm[name] });
            setValidations(prev => ({  ...prev,
                [name]: validators.length === 0 || validate(defaultValuesFromForm[name], validators)
            }));
        }
        else 
            updateFormData({ name: name, value: options[0].value });
    }, [updateFormData, defaultValuesFromForm, name, setValidations]);
    
    return <select
        name={name}
        value={data}
        onChange={handleChangeValue}
        {...props}
    >
        {options.map((option, index) => <option key={keyPref + index} value={option.value}>{option.text}</option>)}
    </select>;
};
export default memo(Select);