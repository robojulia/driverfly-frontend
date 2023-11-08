import CreatableSelect from "react-select/creatable";
import { StylesConfig } from "react-select";
import { useState } from "react";
import { ApplicantEmployerEntity } from "../../../../models/applicant";
import { useEffectAsync } from "../../../../utils/react";
import ApplicantApi from "../../../../pages/api/applicant";
import BaseControl, { BaseControlProps } from "../../base-control";
import { useTranslation } from "../../../../hooks/use-translation";

export interface PastEmployerNameInputProps extends BaseControlProps {
	index?: number;
	annotation?: string;
	accept?: string;
	handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	type?: string;
	min?: string | number;
	max?: string | number;
	step?: number;
	placeholder?: string;
	value?: any;
	readOnly?: boolean;
}

export function PastEmployerNameInput({
	index,
	label,
	className,
	formik,
	value,
	touched,
	name,
	annotation,
	handleBlur,
	error,
	required,
	prepend,
	placeholder,
	append,
}: PastEmployerNameInputProps) {
	const applicantApi = new ApplicantApi();
	const { t } = useTranslation();

	const [query, setQuery] = useState<string>(null);
	const [employers, setEmployers] = useState<ApplicantEmployerEntity[]>([]);

	if (formik) {
		/**
		 * @type {import('formik').FieldMetaProps}
		 */
		const meta = formik.getFieldMeta(`${name}.${annotation}`);

		if (meta) {
			value = meta.value;
			touched = meta.touched;
			error = meta.error;
		}
		handleBlur = handleBlur || formik.handleBlur;
	}

	const csutomStyles: StylesConfig = {
		placeholder: (styles, { isFocused }) => ({
			...styles,
			color: "black",
			fontWeight: "lighter"
		}),
		clearIndicator: (styles, { isFocused }) => ({
			...styles,
			color: "black",
			borderColor: error ? "red" : isFocused ? "#2ec8c4" : "#4ca7a8",
		}),
		container: (styles, { isFocused }) => ({
			...styles,
			width: "100%",
			borderColor: error ? "red" : isFocused ? "#2ec8c4" : "#4ca7a8",
		}),
		control: (styles, { isFocused, menuIsOpen }) => ({
			...styles,
			backgroundColor: "white",
			color: "black",
			borderColor: error
				? "red"
				: isFocused || menuIsOpen
					? "#2ec8c4"
					: "#4ca7a8",
		}),
		option: (styles, { data, isDisabled, isFocused, isSelected }) => {
			return {
				...styles,
				zIndex: 9999,
				color: isFocused || isSelected ? "white" : "black",
				backgroundColor: isFocused
					? "#2ec8c4"
					: isSelected
						? "#4ca7a8"
						: "white",
			};
		},
	};

	useEffectAsync(
		async () =>
			await applicantApi.employer
				.search({ name: query })
				.then((data: ApplicantEmployerEntity[]) =>
					setEmployers(data?.filter((v) => Boolean(v?.name)))
				)
				.catch((e) => console.error(e.message)),
		[query]
	);

	const handleEmployerNameChange = (
		employer: string | ApplicantEmployerEntity
	): void => {
		console.log("employer", employer);
		typeof employer == "string" ||
			typeof employer == "undefined" ||
			employer == null
			? formik.setFieldValue(`${name}.${annotation}`, employer ?? null)
			: formik.setFieldValue(name, {
				...(employer ?? {}),
				id: null,
				applicant: null,
				created_at: null,
				last_updated_at: null,
				uuid_token: null,
				is_current: true,
				voe_submitted: null,
				voe_attempts: null,
				documents: null,
			});
	};

	return (
		<BaseControl
			className={className}
			name={`${name}.${annotation}`}
			label={label}
			required={required}
			formik={formik}
			touched={touched}
			error={error}
			prepend={prepend}
			append={append}
		>
			<CreatableSelect
				key={index}
				placeholder={t(placeholder)}
				styles={csutomStyles}
				className={`basic-single px-0 ${error ? "is-invalid" : ""}`}
				isClearable={true}
				isSearchable={true}
				options={employers?.map((v) => ({ value: v?.id, label: v?.name }))}
				onInputChange={(newValue) => setQuery(newValue)}
				defaultInputValue={value || ""}
				onChange={(value: any) =>
					handleEmployerNameChange(
						value?.__isNew__
							? value?.value
							: employers?.find((v) => v.id == value?.value)
					)
				}
			/>
		</BaseControl>
	);
}
