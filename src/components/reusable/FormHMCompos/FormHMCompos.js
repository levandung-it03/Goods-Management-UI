import { useCallback, useEffect, useMemo, useState } from "react";
import { UtilMethods } from "../Utils";
import "./FormHMCompos.scss";

function validate(val, funcs) {
    for (var func of funcs) {
        const msg = func(val);
        if (msg !== true)  return msg;
    }
    return true;
}

export function InputBuilder({validators=[], defaultValue="", ...props }) {
    function Input(name="", updateFormData, defaultValuesFromForm, setValidations) {
        const [data, setData] = useState(defaultValue);
        
        const handleChangeValue = useCallback(e => {
            setData(e.target.value);
            updateFormData && updateFormData(e.target);
            setValidations(prev => ({ ...prev,
                [name]: validators.length === 0 || validate(e.target.value, validators)
            }));
        }, [updateFormData, setValidations, name]);

        useEffect(() => {  // Only set data once
            if (!UtilMethods.checkIsBlank(updateFormData)
            && !UtilMethods.checkIsBlank(defaultValuesFromForm[name])) {
                setData(defaultValuesFromForm[name]);
                updateFormData({ name: name, value: defaultValuesFromForm[name] });
                setValidations(prev => ({  ...prev,
                    [name]: validators.length === 0 || validate(defaultValuesFromForm[name], validators)
                }));
            };
        }, [updateFormData, defaultValuesFromForm, name, setValidations]);

        return <input
            {...props}
            name={name}
            value={data}
            onChange={handleChangeValue}
        />
    };
    return Input;
}

export function TextareaBuilder({ validators=[], defaultValue="", ...props}) {
    function TextArea(name="", updateFormData, defaultValuesFromForm, setValidations) {
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
            if (!UtilMethods.checkIsBlank(updateFormData)
            && !UtilMethods.checkIsBlank(defaultValuesFromForm[name])) {
                setData(defaultValuesFromForm[name]);
                updateFormData({ name: name, value: defaultValuesFromForm[name] });
                setValidations(prev => ({  ...prev,
                    [name]: validators.length === 0 || validate(defaultValuesFromForm[name], validators)
                }));
            };
        }, [updateFormData, defaultValuesFromForm, name, setValidations]);

        return <textarea
            {...props}
            name={name}
            value={data}
            onChange={handleChangeValue}
        ></textarea>
    };
    return TextArea;
}

export function SelectBuilder({ options=[], validators=[], defaultValue="", ...props}) {
    function Select(name="", updateFormData, defaultValuesFromForm, setValidations) {
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
            if (!UtilMethods.checkIsBlank(updateFormData)
            && !UtilMethods.checkIsBlank(defaultValuesFromForm[name])) {
                setData(defaultValuesFromForm[name]);
                updateFormData({ name: name, value: defaultValuesFromForm[name] });
                setValidations(prev => ({  ...prev,
                    [name]: validators.length === 0 || validate(defaultValuesFromForm[name], validators)
                }));
            };
        }, [updateFormData, defaultValuesFromForm, name, setValidations]);

        return <select
            {...props}
            name={name}
            value={data}
            onChange={handleChangeValue}
        >
            {options.map((option, index) => <option key={keyPref + index} value={option.value}>{option.text}</option>)}
        </select>;
    };
    return Select;
}

export function Form({ POST_service, defaultValues, childrenBuildersInfo, offFieldsets, isPreventDefaultMannually,
    replacedSubmitBtnBuilder, ...props }) {
    const keyPref = useMemo(() => "form-compo-" + UtilMethods.timeAsKey(), []);
    const [formData, setFormData] = useState({});
    const [validations, setValidations] = useState({});
    console.log('form');
    

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
    },[childrenBuildersInfo]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const validationsResult = Object.values(validations);
        if (!isPreventDefaultMannually && validationsResult.every(v => v === true))
            {console.log(POST_service);
            
            POST_service.action({
                ...formData,
                ...POST_service.moreParams
            }).then(response => {
                UtilMethods.showToast(response.message, "success");
            }).catch(error => {
                UtilMethods.showToast(error.message, "error");
            });}
        else
        UtilMethods.showToast("Information still wrong", "error");
    }, [validations, POST_service, formData, isPreventDefaultMannually]);

    console.log(formData, validations)
    return <form {...props} onSubmit={handleSubmit}>
        {childrenBuildersInfo.map((infoObj, index) =>
            <div className="form-children-container" key={keyPref + index}>
                {offFieldsets
                    ? <div className="form-child">
                        {infoObj.builder(infoObj.name, updateFormData, defaultValues, setValidations)}
                    </div>
                    : <fieldset className={validations[infoObj.name] === true ? "" : "error-fieldset"}>
                        <legend>{infoObj.legend}</legend>
                        {infoObj.builder(infoObj.name, updateFormData, defaultValues, setValidations)}
                    </fieldset>
                }
                <div className={infoObj.name + "-err-msg"}>
                    <span>{validations[infoObj.name]}</span>
                </div>
            </div>
        )}
        {replacedSubmitBtnBuilder ? replacedSubmitBtnBuilder(formData)
            : <div className="submit-btn">
                <button type="submit">Submit</button>
            </div>}
    </form>;
}

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