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
import { formSuccess } from "../../../utils/toast";
import EntityForm from "../../layouts/page/entity-form";
import BaseSelect from "../base-select";
import { BaseFormProps } from "./base-form-props";

export interface CompanyPreferencesOnboardingChecklistFormProps
	extends BaseFormProps<CompanyPreferenceEntity> {
	companyOnboardingChecklist: CompanyPreferenceEntity;
}

export function CompanyPreferencesOnboardingChecklistForm(
	props: CompanyPreferencesOnboardingChecklistFormProps
) {
	const [item, setItem] = useState<ApplicantOnBoardingChecklist>();

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
				formSuccess(t, !!entity?.id ? "update" : "create", "COMPANY");
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

	const handleAddItem = useCallback(() => {
		form.setFieldValue("onboardingChecklist.value", [
			...(form.values?.onboardingChecklist?.value || []),
			item,
		]);
		setItem(null);
	}, [form.values?.onboardingChecklist?.value, item]);

	const handleRemoveItem = useCallback(
		(listItem: ApplicantOnBoardingChecklist) => {
			form.setFieldValue(
				"onboardingChecklist.value",
				form.values.onboardingChecklist?.value?.filter((v) => v !== listItem)
			);
		},
		[form.values.onboardingChecklist.value]
	);

	const checklistItems = useMemo(
		() =>
			form.values.onboardingChecklist?.value?.map(
				(listItem: ApplicantOnBoardingChecklist, key: Key) => (
					<Row key={key} className="mt-2">
						<div className="col-6 offset-2 border-bottom">
							{t(`ApplicantOnBoardingChecklist.${listItem}`)}
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
				)
			),
		[form.values.onboardingChecklist?.value, handleRemoveItem]
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
				<BaseSelect
					label="ONBOARDING_CHECKLIST"
					value={item}
					hideOptions={form.values.onboardingChecklist?.value}
					placeholder="ONBOARDING_CHECKLIST"
					className="col-8 offset-1"
					name="onboardingChecklist"
					enumType={ApplicantOnBoardingChecklist}
					labelPrefix="ApplicantOnBoardingChecklist"
					onChange={({ target: { value } }) =>
						setItem(value as ApplicantOnBoardingChecklist)
					}
				/>
				<div className="col-1 mt-4 pt-2">
					<Button
						className=""
						disabled={!item}
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
