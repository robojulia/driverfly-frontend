import { useTranslation } from "../../hooks/useTranslation";

/**
 * @typedef SwitchProps
 * @property {string} className
 * @property {string} label
 * @property {string} name
 * @property {boolean} value
 * @property {boolean} required
 * @property {boolean} readOnly
 * @property {(React.ChangeEvent<HTMLInputElement>) => void} onChange
 */

/**
 * 
 * @param {SwitchProps} props 
 */
export default function Switch(props) {
    const { t } = useTranslation();

    let { readOnly, name, value, label, required, className, onChange } = props || {};

    return (
        <div className={`form-switch ${className}`}>
            <input
                id={name}
                type="checkbox"
                checked={!!value}
                onChange={onChange}
                readOnly={readOnly}
                name={name}
                role="switch"
                className={`form-check-input`} 
            />
            {label && <label htmlFor={name} className="form-check-label">{t(label)}{required ? "*" : ""}</label>}
        </div>
    );


}