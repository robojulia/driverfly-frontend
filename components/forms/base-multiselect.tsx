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
			: "#4ca7a8",
	}),
	option: (styles: any, { data, isDisabled, isFocused, isSelected }) => {
		return {
			...styles,
			zIndex: 9999,
			color: isFocused || isSelected
				? "white"
				// : data?.value?.chattable_type == ChattableType.EMPLOYEE
				//     ? '#2ec8c4'
				: "black",
			backgroundColor: isFocused
				? "#2ec8c4"
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
	placeholder,
	displayPlaceholder,
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

	if (options && options?.length > 0) {
		options = options?.map((item) => {
			return {
				label: t(item?.label),
				value: item?.value
			}
		})
	}

	function onChangeProxy(e) {
		if (onChange) return onChange(e);
		if (name && e !== null && e?.length > 0) {
			formik?.setFieldValue(name, e?.flatMap((item: { value: string, label: string }) => item?.value));
		}
	}

	return (
		<div className={className} >
			<BaseControl
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
					unstyled
					// className="Filter_Select"
					onChange={onChangeProxy}
					ref={selectInputRef}
					isClearable={true}
					isSearchable={true}
					className="basic-single,Filter_Select"
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
				>
				</Select>
			</BaseControl>

		</div>

	);
}

export default BaseMultiSelect;
