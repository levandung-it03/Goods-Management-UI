import './CheckBoxInput.scss';
function CheckBoxInput({ field, props, eventHandlers, error }) {
    return (
        <div className={`input-field checkbox-input ${error.message ? 'error' : ''}`}>
            <div className="field-wrapper v-center">
                <input {...field} {...props} {...eventHandlers} checked={field.value} />
                <label htmlFor={props.id}>{field.value ? props.label : props.uncheckedlabel ? props.uncheckedlabel : props.label}</label>
            </div>
            {error.message && <div className="error-msg">{error.message}</div>}
        </div>
    );
}

export default CheckBoxInput;
