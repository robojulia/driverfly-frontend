import { useFormik } from "formik";
import { Key, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAuth } from "../../../hooks/use-auth";
import { useTranslation } from "../../../hooks/use-translation";
import CompanyApi from "../../../pages/api/company";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";

import { Trash } from "react-bootstrap-icons";
import { ApplicantOnBoardingChecklist } from "../../../enums/applicants/applicant-onboarding-checklist.enum";
import { CompanyPreferenceCategory } from "../../../enums/company/company-preference-category.enum";
import { CompanyPreferenceOnboardingChecklistLabel } from "../../../enums/company/company-preferences-onboarding-checklist-label.enum";
import { CompanyPreferenceEntity } from "../../../models/company/company-preferences.entity";
import EntityForm from "../../layouts/page/entity-form";
import BaseSelect from "../base-select";
import BaseInput from "../base-input";
import { BaseFormProps } from "./base-form-props";

export interface CompanyPreferencesOnboardingChecklistFormProps
	extends BaseFormProps<CompanyPreferenceEntity> {
	companyOnboardingChecklist: CompanyPreferenceEntity;
}

export function CompanyPreferencesOnboardingChecklistForm(
	props: CompanyPreferencesOnboardingChecklistFormProps
) {
	const [item, setItem] = useState<ApplicantOnBoardingChecklist>();
	const [customItem, setCustomItem] = useState<string>("");
	const [useCustom, setUseCustom] = useState<boolean>(false);

	const { user } = useAuth();

	const { t } = useTranslation();
	const companyApi = new CompanyApi();
	let {
		className,
		entity,
		companyOnboardingChecklist,
		onSaveComplete,
		onSaveError,
	} = props;

	const form = useFormik({
		initialValues: {
			onboardingChecklist: {
				...new CompanyPreferenceEntity(),
				category: CompanyPreferenceCategory.ONBOARDING_CHECKLIST,
				label: CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DOCUMETS,
				value: [],
			} as CompanyPreferenceEntity,
		},
		validationSchema: yup.object({
			onboardingChecklist: CompanyPreferenceEntity.yupSchema(),
		}),
		onSubmit: async ({ onboardingChecklist }, { setValues }) => {
			try {
				if (onboardingChecklist?.value) {
					if (onboardingChecklist?.id)
						onboardingChecklist = await companyApi.preferences.update(
							user?.company.id,
							onboardingChecklist.id,
							onboardingChecklist
						);
					else {
						onboardingChecklist = await companyApi.preferences.create(
							user?.company.id,
							onboardingChecklist
						);
					}
				} else if (onboardingChecklist?.id) {
					await companyApi.preferences.remove(user.id, onboardingChecklist.id);
					delete onboardingChecklist.id;
				}

				setValues({ onboardingChecklist });
				toast.success(t("Successfully updated"));
				if (onSaveComplete) onSaveComplete(onboardingChecklist);
			} catch (e) {
				console.error("Unable to save entity", e.response, e);
				globalAjaxExceptionHandler(e, { formik: form, toast, t });
				if (onSaveError) onSaveError(e);
			}
		},
	});

	useEffect(() => {
		form.setValues({
			onboardingChecklist: {
				...form.values.onboardingChecklist,
				...companyOnboardingChecklist,
			},
		});
	}, [companyOnboardingChecklist]);

	const handleAddItem = useCallback(async () => {
		const itemToAdd = useCustom ? customItem : item;
		if (itemToAdd) {
			await form.setFieldValue("onboardingChecklist.value", [
				...(form.values?.onboardingChecklist?.value || []),
				itemToAdd,
			]);
			setItem(null);
			setCustomItem("");
			setUseCustom(false);
		}
	}, [form, form.values?.onboardingChecklist?.value, item, customItem, useCustom]);

	const handleRemoveItem = useCallback(
		(listItem: ApplicantOnBoardingChecklist) => {
			form.setFieldValue(
				"onboardingChecklist.value",
				form.values.onboardingChecklist?.value?.filter((v) => v !== listItem)
			);
		},
		[form.values.onboardingChecklist.value]
	);

	const handleDragStart = (e: React.DragEvent, index: number) => {
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", index.toString());
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};

	const handleDrop = (e: React.DragEvent, dropIndex: number) => {
		e.preventDefault();
		const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));

		if (dragIndex === dropIndex) return;

		const items = [...(form.values.onboardingChecklist?.value || [])];
		const [draggedItem] = items.splice(dragIndex, 1);
		items.splice(dropIndex, 0, draggedItem);

		form.setFieldValue("onboardingChecklist.value", items);
	};

	const checklistItems = useMemo(
		() =>
			form.values.onboardingChecklist?.value?.map(
				(listItem: string, index: number) => {
					// Check if the item is from the enum or a custom item
					const isEnumValue = Object.values(ApplicantOnBoardingChecklist).includes(listItem as ApplicantOnBoardingChecklist);
					const displayText = isEnumValue ? t(`ApplicantOnBoardingChecklist.${listItem}`) : listItem;

					return (
						<Row
							key={index}
							className="mt-2"
							draggable
							onDragStart={(e) => handleDragStart(e, index)}
							onDragOver={handleDragOver}
							onDrop={(e) => handleDrop(e, index)}
							style={{ cursor: 'move' }}
						>
							<div className="col-1 offset-1 border-bottom d-flex align-items-center">
								<span style={{ fontSize: '1.2em', color: '#999' }}>⋮⋮</span>
							</div>
							<div className="col-5 border-bottom">
								{displayText}
							</div>
							<div className="col-1 border-bottom">
								<Button
									variant="danger"
									type="button"
									onClick={() => handleRemoveItem(listItem as ApplicantOnBoardingChecklist)}
								>
									<Trash />
								</Button>
							</div>
						</Row>
					);
				}
			),
		[form.values.onboardingChecklist?.value, handleRemoveItem, t]
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
			<Row className="my-3">
				<div className="col-10 offset-1">
					<div className="d-flex align-items-center mb-2">
						<Button
							variant={!useCustom ? "primary" : "outline-secondary"}
							size="sm"
							type="button"
							onClick={() => setUseCustom(false)}
							className="me-2"
						>
							{t("Select from List")}
						</Button>
						<Button
							variant={useCustom ? "primary" : "outline-secondary"}
							size="sm"
							type="button"
							onClick={() => setUseCustom(true)}
						>
							{t("Custom Document Type")}
						</Button>
					</div>
				</div>
			</Row>
			<Row className="my-3">
				{!useCustom ? (
					<BaseSelect
						label="ONBOARDING_DOCUMENTS"
						value={item}
						hideOptions={form.values.onboardingChecklist?.value}
						placeholder="ONBOARDING_DOCUMENTS"
						className="col-8 offset-1"
						name="onboardingChecklist"
						enumType={ApplicantOnBoardingChecklist}
						labelPrefix="ApplicantOnBoardingChecklist"
						onChange={({ target: { value } }) => {
							setItem(value as ApplicantOnBoardingChecklist);
							setCustomItem("");
						}}
					/>
				) : (
					<BaseInput
						label="Custom Document Name"
						value={customItem}
						placeholder="Enter custom document name"
						className="col-8 offset-1"
						name="customOnboardingDocument"
						onChange={({ target: { value } }) => {
							setCustomItem(value);
							setItem(null);
						}}
					/>
				)}
				<div className="col-1 mt-4 pt-2">
					<Button
						className=""
						disabled={useCustom ? !customItem : !item}
						type="button"
						onClick={handleAddItem}
					>
						{t("ADD")}
					</Button>
				</div>
			</Row>
			<div className="mt-5">{checklistItems}</div>
		</EntityForm>
	);
}
