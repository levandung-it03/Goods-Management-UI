import { UtilMethods } from "@reusable/Utils";
import { memo, useCallback, useEffect, useState } from "react";

function Input({
    updateFormData, defaultValuesFromForm, setValidations, validate,
    name="", validators, defaultValue, ...props
}) {
    const [data, setData] = useState(defaultValue);

    const handleChangeValue = useCallback(e => {
        setData(e.target.value);
        updateFormData && updateFormData(e.target);
        setValidations(prev => ({ ...prev,
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
        };
    }, [updateFormData, defaultValuesFromForm, name, setValidations]);

    return <input
        name={name}
        value={data}
        onChange={handleChangeValue}
        {...props}
    />
};

export default memo(Input);