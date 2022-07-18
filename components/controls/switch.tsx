import React from "react";
import { useTranslation } from "../../hooks/useTranslation";

export interface SwitchProps {
    className?: string;
    label?: string;
    name?: string;
    value?: boolean;
    required?: boolean;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Switch(props: SwitchProps) {
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
            {label && <label htmlFor={name} className="form-check-label" style={{ marginLeft: "4px" }}>{t(label)}{required ? "*" : ""}</label>}
        </div>
    );
}