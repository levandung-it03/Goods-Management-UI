import { UtilMethods } from "@reusable/Utils";
import { memo } from "react";

function Span({ name, defaultValuesFromForm, defaultValue, ...takenProps }) {
    const { updateFormData, setValidations, validate, validators, ...props} = takenProps;

    return <span {...props}>
        {UtilMethods.checkIsBlank(defaultValue)
            ? (!UtilMethods.checkIsBlank(defaultValuesFromForm[name])
                ? defaultValuesFromForm[name]
                : "")
            : defaultValue}
    </span>;
}

export default memo(Span);