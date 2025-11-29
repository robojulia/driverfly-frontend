import { useFormik } from "formik";
import { Key, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Row, ButtonGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAuth } from "../../../hooks/use-auth";
import { useTranslation } from "../../../hooks/use-translation";
import CompanyApi from "../../../pages/api/company";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";

import { Trash } from "react-bootstrap-icons";
import { EmployeeHRFiles } from "../../../enums/employee/employee-hr-files.enum";
import { CompanyPreferenceCategory } from "../../../enums/company/company-preference-category.enum";
import { CompanyPreferenceOnboardingChecklistLabel } from "../../../enums/company/company-preferences-onboarding-checklist-label.enum";
import { CompanyPreferenceEntity } from "../../../models/company/company-preferences.entity";
import { formSuccess } from "../../../utils/toast";
import EntityForm from "../../layouts/page/entity-form";
import BaseSelect from "../base-select";
import BaseInput from "../base-input";
import { BaseFormProps } from "./base-form-props";

/**
 * Formats a string by removing underscores and converting to sentence case
 * Example: "EMERGENCY_CONTACT_LIST" -> "Emergency contact list"
 */
const formatLabel = (label: string): string => {
	return label
		.replace(/_/g, ' ')
		.toLowerCase()
		.replace(/^\w/, (c) => c.toUpperCase());
};

export interface CompanyPreferencesHRFilesFormProps
	extends BaseFormProps<CompanyPreferenceEntity> {
	companyHRFilesList: CompanyPreferenceEntity;
}

export function CompanyPreferencesHRFilesForm(
	props: CompanyPreferencesHRFilesFormProps
) {
	const [item, setItem] = useState<string>("");
	const [inputMode, setInputMode] = useState<"select" | "custom">("select");

	const { user } = useAuth();

	const { t } = useTranslation();
	const companyApi = new CompanyApi();
	let {
		className,
		entity,
		companyHRFilesList,
		onSaveComplete,
		onSaveError,
	} = props;

	const form = useFormik({
		initialValues: {
			hrFilesList: {
				...new CompanyPreferenceEntity(),
				category: CompanyPreferenceCategory.ONBOARDING_CHECKLIST,
				label: CompanyPreferenceOnboardingChecklistLabel.EMPLOYEE_HR_FILES,
				value: [],
			} as CompanyPreferenceEntity,
		},
		validationSchema: yup.object({
			hrFilesList: CompanyPreferenceEntity.yupSchema(),
		}),
		onSubmit: async ({ hrFilesList }, { setValues }) => {
			try {
				if (hrFilesList?.value) {
					if (hrFilesList?.id)
						hrFilesList = await companyApi.preferences.update(
							user?.company.id,
							hrFilesList.id,
							hrFilesList
						);
					else {
						hrFilesList = await companyApi.preferences.create(
							user?.company.id,
							hrFilesList
						);
					}
				} else if (hrFilesList?.id) {
					await companyApi.preferences.remove(user.id, hrFilesList.id);
					delete hrFilesList.id;
				}

				setValues({ hrFilesList });
				formSuccess(t, !!entity?.id ? "update" : "create", "COMPANY");
				if (onSaveComplete) onSaveComplete(hrFilesList);
			} catch (e) {
				console.error("Unable to save entity", e.response, e);
				globalAjaxExceptionHandler(e, { formik: form, toast, t });
				if (onSaveError) onSaveError(e);
			}
		},
	});

	useEffect(() => {
		form.setValues({
			hrFilesList: {
				...form.values.hrFilesList,
				...companyHRFilesList,
			},
		});
	}, [companyHRFilesList]);

	const handleAddItem = useCallback(() => {
		if (!item || !item.trim()) return;

		if (form.values?.hrFilesList?.value?.includes(item)) {
			form.setFieldError("hrFilesList.value", "ITEM_ALREADY_EXISTS");
			return;
		}

		form.setFieldValue("hrFilesList.value", [
			...(form.values?.hrFilesList?.value || []),
			item.trim(),
		]);
		setItem("");
	}, [form.values?.hrFilesList?.value, item]);

	const handleRemoveItem = useCallback(
		(listItem: string) => {
			form.setFieldValue(
				"hrFilesList.value",
				form.values.hrFilesList?.value?.filter((v) => v !== listItem)
			);
		},
		[form.values.hrFilesList.value]
	);

	const hrFileItems = useMemo(
		() =>
			form.values.hrFilesList?.value?.map(
				(listItem: string, key: Key) => {
					// Check if it's a known enum value or custom string
					const isEnumValue = Object.values(EmployeeHRFiles).includes(listItem as EmployeeHRFiles);
					const displayText = formatLabel(listItem);

					return (
						<Row key={key} className="mt-2">
							<div className="col-6 offset-2 border-bottom">
								{displayText}
								{!isEnumValue && <span className="text-muted ms-2">(Custom)</span>}
							</div>
							<div className="col-1 border-bottom">
								<Button
									variant="danger"
									type="button"
									onClick={() => handleRemoveItem(listItem)}
								>
									<Trash />
								</Button>
							</div>
						</Row>
					);
				}
			),
		[form.values.hrFilesList?.value, handleRemoveItem]
	);

	return (
		<EntityForm
			actionButtonDown
			submitLabel="SAVE"
			className={className}
			onSubmit={form.handleSubmit}
			formik={form}
			id={entity?.id}
		>
			<Row className="my-3 mb-4">
				<div className="col-10 offset-1">
					<ButtonGroup className="mb-3 w-100">
						<Button
							variant={inputMode === "select" ? "primary" : "outline-primary"}
							onClick={() => {
								setInputMode("select");
								setItem("");
							}}
						>
							{t("SELECT_FROM_LIST")}
						</Button>
						<Button
							variant={inputMode === "custom" ? "primary" : "outline-primary"}
							onClick={() => {
								setInputMode("custom");
								setItem("");
							}}
						>
							{t("ADD_CUSTOM_TYPE")}
						</Button>
					</ButtonGroup>
				</div>
			</Row>

			<Row className="my-3">
				{inputMode === "select" ? (
					<BaseSelect
						label="HR_FILES"
						value={item}
						hideOptions={form.values.hrFilesList?.value}
						placeholder="SELECT_DOCUMENT_TYPE"
						className="col-8 offset-1"
						name="hrFilesList"
						enumType={EmployeeHRFiles}
						createLabel={(option) => formatLabel(option.value)}
						onChange={({ target: { value } }) =>
							setItem(value as string)
						}
					/>
				) : (
					<BaseInput
						label="CUSTOM_FILE_TYPE"
						value={item}
						placeholder="ENTER_CUSTOM_FILE_TYPE_NAME"
						className="col-8 offset-1"
						name="customHRFileItem"
						error={form?.errors?.hrFilesList?.value as string}
						onChange={({ target: { value } }) => setItem(value)}
					/>
				)}
				<div className="col-1 mt-4 pt-2">
					<Button
						className=""
						disabled={!item || !item.trim()}
						type="button"
						onClick={handleAddItem}
					>
						{t("ADD")}
					</Button>
				</div>
			</Row>
			<div className="mt-5">{hrFileItems}</div>
		</EntityForm>
	);
}
