import './DefaultInput.scss';
function DefaultInput({ field, props, eventHandlers, error, icon }) {
    return (
        <div className={`input-field default-input ${error.message ? 'error' : ''}`} data-active={!!field.value}>
            <div className="field-wrapper v-center">
                <input {...field} {...props} {...eventHandlers} />
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
                {icon}
            </div>
            {error.message && <div className="error-msg">{error.message}</div>}
        </div>
    );
}

export default DefaultInput;
