import React from 'react'

import { useTranslation } from "../../hooks/use-translation"
import BaseControl, { BaseControlProps } from './base-control';

export interface BaseSelectProps extends BaseControlProps, React.InputHTMLAttributes<HTMLSelectElement> {
	enumType?: object;
	hideOptions?: string[];
	showOptions?: string[];
	options?: { value?: number | string | boolean, label?: string }[] | any[];
	valueKey?: string;
	labelKey?: string;
	labelPrefix?: string;
	createLabel?: (any) => string;
	placeholder?: string;
	displayPlaceholder?: string | boolean;
	value?: any;
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	handleBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
	readOnly?: boolean;
}

function BaseSelect({
	append,
	prepend,
	formik,
	required,
	className,
	enumType,
	options,
	valueKey = "value",
	labelKey = "label",
	labelPrefix,
	createLabel,
	label,
	placeholder,
	displayPlaceholder,
	value,
	onChange,
	handleBlur,
	readOnly,
	name,
	touched,
	error,
	hideOptions,
	showOptions,
	...rest
}: BaseSelectProps) {
	const { t } = useTranslation();

	if (formik) {
		/**
		 * @type {import('formik').FieldMetaProps}
		 */
		const meta = formik.getFieldMeta(name);

		if (meta) {
			value = meta.value;
			touched = meta.touched;
			error = meta.error;
		}
		onChange = onChange || formik.handleChange;
		handleBlur = handleBlur || formik.handleBlur;
	}

	if (typeof enumType == "object") {
		options = Object.entries(enumType)?.map(([key, value]) => ({
			[valueKey]: value,
			[labelKey]: value,
		}));

		if (hideOptions?.length)
			options = options?.filter((v) => !hideOptions.includes(v.value));
		if (showOptions?.length)
			options = options?.filter((v) => showOptions.includes(v.value));
	} else if (options && options.length > 0 && typeof options[0] != "object") {
		options = options?.map((v) => ({
			[valueKey]: v,
			[labelKey]: v,
		}));
	} else if (createLabel) {
		options = options?.map((v) => ({
			[valueKey]: v[valueKey],
			[labelKey]: createLabel(v),
		}));
	}

	/**
	 *
	 * @param {React.ChangeEvent<HTMLSelectElement>} e
	 */
	function onChangeProxy(e) {
		const { name, value } = e.target;

		if (!onChange) return;

		if (!value) {
			onChange({
				...e,
				target: {
					...e.target,
					name: name,
					value: null,
				},
			});
		} else onChange(e);
	}

    // When read Only, render plaintext instead of a disabled select to avoid showing a dropdown chevron
    if (readOnly) {
        const selected = (options || []).find((o: any) => o[valueKey] === value);
        const display = selected
            ? t(labelPrefix ? `${labelPrefix}.${selected[labelKey]}` : selected[labelKey])
            : '';
        return (
            <BaseControl
                className={className}
                name={name}
                label={label}
                required={required}
                formik={formik}
                touched={touched}
                error={error}
                prepend={prepend}
                append={append}
            >
                <div className="form-control" style={{ backgroundColor: '#f8f9fa', opacity: 1 }}>
                    {display}
                </div>
            </BaseControl>
        );
    }

    return (
        <BaseControl
			className={className}
			name={name}
			label={label}
			required={required}
			formik={formik}
			touched={touched}
			error={error}
			prepend={prepend}
			append={append}
		>
			<select
				value={value == null ? "" : value}
				onChange={onChangeProxy}
				onBlur={handleBlur}
				disabled={readOnly}
				name={name?.toString()}
				id={name?.toString()}
				className={`form-select ${error ? "is-invalid" : ""}`}
				{...rest}
			>
				{(displayPlaceholder || placeholder) && (
					<option value="">
						{t(
							(typeof displayPlaceholder == "string" && displayPlaceholder) ||
							placeholder ||
							label ||
							name
						)}{" "}
					</option>
				)}
				{options &&
					options?.map((v, i) => (
						<option key={i} value={v[valueKey]}>
							{t(labelPrefix ? `${labelPrefix}.${v[labelKey]}` : v[labelKey])}
						</option>
					))}
			</select>
		</BaseControl>
	);
}

export default BaseSelect

