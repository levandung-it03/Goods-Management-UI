import styles from './Button.module.scss';
function Button({ text, ...props }) {
    return (
        <button {...props} className={`${styles.btn} ui-btn`}>
            {text}
        </button>
    );
}

export default Button;
