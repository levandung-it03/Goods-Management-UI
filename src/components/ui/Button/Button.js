import styles from './Button.module.scss';
function Button({ text, className = '', ...props }) {
    return (
        <button {...props} className={`${styles.btn} ui-btn ${className}`}>
            {text}
        </button>
    );
}

export default Button;
