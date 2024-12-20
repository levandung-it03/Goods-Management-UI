import { useCallback, useEffect, useMemo, useState, createElement, memo } from "react";
import { UtilMethods } from "../Utils";
import "./FormHMCompos.scss";
import InputHMCompo from "./InputHMCompo";
import SelectHMCompo from "./SelectHMCompo";
import TextareaHMCompo from "./TextareaHMCompo";
import SpanMockInputCompo from "./SpanMockInputCompo";

function validate(val, funcs) {
    for (var func of funcs) {
        const msg = func(val);
        if (msg !== true)  return msg;
    }
    return true;
}

export function SpanMockInputBuilder({ defaultValue="", ...props }) {
    return { defaultValue, plainComponent: SpanMockInputCompo, childProps: props };
}

export function InputBuilder({validators=[], defaultValue="", ...props }) {
    return { validators, defaultValue, plainComponent: InputHMCompo, childProps: props };
}

export function TextareaBuilder({ validators=[], defaultValue="", ...props}) {
    return { validators, defaultValue, plainComponent: TextareaHMCompo, childProps: props };
}

export function SelectBuilder({ options=[], validators=[], defaultValue="", ...props}) {
    return { validators, defaultValue, plainComponent: SelectHMCompo, childProps: {...props, options } };
}

const Form = function Form({ POST_service, defaultValues, childrenBuildersInfo, offFieldsets, isPreventDefaultMannually,
    replacedSubmitBtnBuilder, className, ...props }) {
    const keyPref = useMemo(() => "form-compo-" + UtilMethods.timeAsKey(), []);
    const [formData, setFormData] = useState({});
    const [validations, setValidations] = useState({});
    
    const updateFormData = useCallback(({ name, value }) => {
        setFormData((prevData) => {
            const result = { ...prevData, [name]: value };
            !UtilMethods.checkIsBlank(prevData[name]) && UtilMethods.checkIsBlank(result[name]) && delete result[name];
            return result;
        });
    }, [setFormData]);

    useEffect(() => {
        setValidations(childrenBuildersInfo.reduce((acc, info) => ({
            ...acc,
            [info.name]: true
        }), {}));
    }, [childrenBuildersInfo]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const validationsResult = Object.values(validations);
        if (!isPreventDefaultMannually && validationsResult.every(v => v === true)) {console.log(POST_service);
            await POST_service.action({
                ...formData,
                ...POST_service.moreParams
            })
        }
    }, [validations, POST_service, formData, isPreventDefaultMannually]);

    console.log(defaultValues, formData, validations);
    return <form {...props} onSubmit={handleSubmit} className={"handmade-form " + className}>
        {childrenBuildersInfo.map((infoObj, index) => {
            const { validators, defaultValue, plainComponent, childProps } = infoObj.builder;
            const builderProps = {
                name: infoObj.name,
                defaultValuesFromForm: defaultValues,
                validators, defaultValue,
                updateFormData, setValidations, validate,
                ...childProps
            };
            return <div className="form-children-container" key={keyPref + index}>
                {offFieldsets
                    ? <div className="form-child"> {createElement(plainComponent, builderProps)} </div>
                    : <fieldset className={validations[infoObj.name] === true ? "" : "error-fieldset"}>
                        <legend>{infoObj.legend}</legend>
                        {createElement(plainComponent, builderProps)}
                    </fieldset>
                }
                <div className={infoObj.name + "-err-msg"}>
                    <span>{validations[infoObj.name]}</span>
                </div>
            </div>;
        })}
        {replacedSubmitBtnBuilder ? replacedSubmitBtnBuilder(formData)
            : <div className="submit-btn">
                <button type="submit">Send</button>
            </div>}
    </form>;
}
export default memo(Form);

/*
//--Example
function TestPage() {
    const defaultValues = { name1: 1, name2: 2, name3: 3 };
    const [preventDefaultState, setPreventDefaultState] = useState(true);
    
    const childrenBuildersInfo = [
        { name: "name1", legend: "Name 1", builder: InputBuilder({ type: "text", validators: [
            v => Number.parseInt(v) > 0 || "Must be negative",
            v => v % 2 === 0 || "Must be a multiple of 2"
        ], required: true, autoComplete: "off" })},
        { name: "name2", legend: "Name 2", builder: SelectBuilder({ options: [
            {value: 1, text: 1},
            {value: 2, text: 2},
        ] })},
        { name: "name3", legend: "Name 3", builder: TextareaBuilder({ defaultValue: "4" })},
        { name: "name4", legend: "Name 4", builder: () => <button className="delete-btn" onClick={e => {
            setPreventDefaultState(true);
            e.preventDefault();
            //...Axios.delete something
        }} >Delete</button>},
    ];

    return <>
        <Form className="test-form"
            POST_service={{
                action: () => {},
                moreParams: {}
            }}
            offFieldsets={true} //--Default undefined=false
            isPreventDefaultMannually={preventDefaultState} //--Custom children form actions (prevent submit when error occur)
            defaultValues={defaultValues}
            childrenBuildersInfo={childrenBuildersInfo}
        />
    </>;
}
*/