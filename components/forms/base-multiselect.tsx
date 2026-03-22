import React, { useRef } from 'react';
import Select, { StylesConfig } from 'react-select';
import { useTranslation } from "../../hooks/use-translation";
import { ComboboxItem } from '../controls/combobox';
import BaseControl, { BaseControlProps } from './base-control';


const csutomStyles: StylesConfig<ComboboxItem & any> = {
	placeholder: (styles: any, { isFocused }) => ({
		...styles,
		color: "black",
		fontWeight: "lighter"
	}),
	clearIndicator: (styles: any, { isFocused }) => ({
		...styles,
		color: "black",
		borderColor: isFocused ? "#2ec8c4" : "#4ca7a8",
	}),
	container: (styles: any, { isFocused }) => ({
		...styles,
		width: "100%",
		borderColor: isFocused ? "#2ec8c4" : "#4ca7a8",
	}),
	control: (styles: any, { isFocused, menuIsOpen }) => ({
		...styles,
		backgroundColor: "white",
		color: "black",
		borderColor: isFocused || menuIsOpen
			? "#2ec8c4"
			: "#d3d3d3",
	}),
	valueContainer: (styles: any) => ({
		...styles,
		maxHeight: '80px',
		overflowY: 'auto',
	}),
	option: (styles: any, { data, isDisabled, isFocused, isSelected }) => {
		return {
			...styles,
			color: isFocused || isSelected
				? "white"
				//     ? '#2ec8c4'
				: "black",
			backgroundColor: isFocused
				? "#4169E1"
				: isSelected
					? "#4ca7a8"
					: "white",
		};
	},
};

export interface BaseMultiSelectProps extends BaseControlProps, React.InputHTMLAttributes<HTMLSelectElement> {
	enumType?: object;
	hideOptions?: string[];
	showOptions?: string[];
	options?: { value?: number | string | boolean, label?: string }[] | any[];
	valueKey?: string;
	labelKey?: string;
	multiple?: boolean;
	showNoneLabel?: string;
	showNone?: boolean;
	labelPrefix?: string;
	createLabel?: (any) => string;
	placeholder?: string;
	displayPlaceholder?: string | boolean;
	value?: any;
	onChange?: any;
	handleBlur?: any;
	readOnly?: boolean;
}

function BaseMultiSelect({
	append,
	prepend,
	formik,
	required,
	className,
	enumType,
	options,
	valueKey = "value",
	labelKey = "label",
	createLabel,
	label,
	labelPrefix,
	showNone,
	placeholder,
	displayPlaceholder,
	showNoneLabel,
	value,
	onChange,
	handleBlur,

	name,
	touched,
	error,
	hideOptions,
	showOptions,

}: BaseMultiSelectProps) {
	const { t } = useTranslation();

	if (formik) {
		const meta = formik.getFieldMeta(name);
		if (meta) {
			value = meta.value;
			touched = meta.touched;
			error = meta.error;
		}
		handleBlur = handleBlur || formik.handleBlur;

	}

	const selectInputRef = useRef(null);

	if (typeof enumType == "object") {
		options = Object.entries(enumType)?.map(([key, value]) => ({
			[valueKey]: value,
			[labelKey]: value,
		}));
		if (showNone) {
			options.push({
				"value": "",
				"label": showNoneLabel ? showNoneLabel : "NONE"
			})
		}

		if (hideOptions?.length)
			options = options?.filter((v) => !hideOptions.includes(v.value));
		if (showOptions?.length)
			options = options?.filter((v) => showOptions.includes(v.value));
		if (options && options?.length > 0) {
			options = options?.map((item) => {
				return {
					label: t(labelPrefix ? `${labelPrefix}.${item[labelKey]}` : item[labelKey]),
					value: item?.value
				}
			})
		}
	} else if (options && options.length > 0 && typeof options[0] != "object") {
		options = options?.map((v) => ({
			[valueKey]: v,
			[labelKey]: v,
		}));
		if (showNone) {
			options.push({
				"value": "",
				"label": showNoneLabel ? showNoneLabel : "NONE"
			})
		}

		if (options && options?.length > 0) {
			options = options?.map((item) => {
				return {
					label: t(item?.label),
					value: item?.value
				}
			})
		}

	} else if (createLabel) {

		options = options?.map((v) => ({
			[valueKey]: v[valueKey],
			value: v[valueKey],
			[labelKey]: createLabel(v),
		}));
		if (showNone) {
			options.push({
				"value": "",
				"label": showNoneLabel ? showNoneLabel : "NONE"
			})
		}

	}

	function onChangeProxy(selectedOptions) {
		const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
		if (onChange) return onChange(values);
		if (name) {
			formik?.setFieldValue(name, values);
		}
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
			<Select
				closeMenuOnSelect={false}
				isMulti
				onChange={onChangeProxy}
				ref={selectInputRef}
				value={options?.filter(option => value?.includes(option?.value)) || []}
				className="basic-single"
				isClearable={true}
				styles={csutomStyles}
				isSearchable={true}
				onBlur={handleBlur}
				placeholder={
					(displayPlaceholder || placeholder) &&
					t(
						(typeof displayPlaceholder == "string" && displayPlaceholder) ||
						placeholder ||
						label ||
						name
					)
				}
				options={options}
			/>
		</BaseControl>
	);
}

export default BaseMultiSelect;
