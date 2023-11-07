import CreatableSelect from "react-select/creatable";
import animatedComponents from "react-select/animated";
import { StylesConfig } from "react-select";
import { useRef, useState } from "react";
import { ApplicantEmployerEntity } from "../../../../models/applicant";
import { useEffectAsync } from "../../../../utils/react";
import ApplicantApi from "../../../../pages/api/applicant";
import BaseControl, { BaseControlProps } from "../../base-control";

export interface PastEmployerNameInputProps extends BaseControlProps {
	accept?: string;
	handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	type?: string;
	min?: string | number;
	max?: string | number;
	step?: number;
	placeholder?: string | boolean;
	value?: any;
	onchangeHandler?: (v?: string | ApplicantEmployerEntity) => void;
	readOnly?: boolean;
}

export function PastEmployerNameInput({
	label,
	className,
	formik,
	value,
	touched,
	name,
	onchangeHandler,
	handleBlur,
	error,
	required,
	prepend,
	append,

}: PastEmployerNameInputProps) {
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
		handleBlur = handleBlur || formik.handleBlur;
	}

	const applicantApi = new ApplicantApi();

	const [query, setQuery] = useState<string>(null);
	const [employers, setEmployers] = useState<ApplicantEmployerEntity[]>([]);

	const csutomStyles: StylesConfig = {
		container: (styles) => ({ ...styles, width: "100%", }),
		control: (styles) => ({ ...styles, backgroundColor: "white", color: "black", }),
		option: (styles, { data, isDisabled, isFocused, isSelected }) => {
			return {
				...styles,
				zIndex: 9999,
				color: isFocused || isSelected ? "white" : "black",
				backgroundColor: isFocused ? "#2ec8c4" : isSelected ? "#4ca7a8" : "white",
			};
		},
	};

	useEffectAsync(
		async () => await applicantApi.employer
			.search({ name: query })
			.then((data: ApplicantEmployerEntity[]) => setEmployers(data?.filter((v) => Boolean(v?.name))))
			.catch((e) => console.error(e.message)),
		[query]
	);

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
			<CreatableSelect
				// placeholder={''}
				// ref={selectInputRef}
				// name="companyId"
				styles={csutomStyles}
				className={`${''} basic-single px-0 ${error ? "is-invalid" : ""}`}
				// classNamePrefix="select"
				isClearable={true}
				// isSearchable={true}
				options={employers?.map((v) => ({ value: v?.id, label: v?.name }))}
				onInputChange={(newValue) => setQuery(newValue)}
				// components={animatedComponents()}
				// value={options.find(v => v?.value == filters?.companyId)}
				// defaultValue={filters?.companyId}
				// defaultInputValue={value || ""}
				// onChange={(v: any) => setFiltersByKeyValue("companyId", v?.value)}
				ariaLiveMessages={{
					onChange: ({ value }: any) => {
						onchangeHandler && onchangeHandler(value?.__isNew__
							? value?.value
							: employers?.find((v) => v.id == value?.value)
						);
						return "";
					},
				}} />
		</BaseControl>
	);
}
