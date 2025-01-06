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
import { CompanyPreferenceCategory } from "../../../enums/company/company-preference-category.enum";
import { CompanyPreferenceOnboardingChecklistLabel } from "../../../enums/company/company-preferences-onboarding-checklist-label.enum";
import { CompanyPreferenceEntity } from "../../../models/company/company-preferences.entity";
import { formSuccess } from "../../../utils/toast";
import EntityForm from "../../layouts/page/entity-form";
import BaseInput from "../base-input";
import { BaseFormProps } from "./base-form-props";
import { useEffectAsync } from "../../../utils/react";

export interface CompanyPreferencesDacFormProps
	extends BaseFormProps<CompanyPreferenceEntity> {
	companyDaclist: CompanyPreferenceEntity;
}

export function CompanyPreferencesDacForm(
	props: CompanyPreferencesDacFormProps
) {
	const [item, setItem] = useState<string>();

	const { user } = useAuth();

	const { t } = useTranslation();
	const companyApi = new CompanyApi();
	let { className, entity, companyDaclist, onSaveComplete, onSaveError } =
		props;

	const form = useFormik({
		initialValues: {
			dac: {
				...new CompanyPreferenceEntity(),
				category: CompanyPreferenceCategory.ONBOARDING_CHECKLIST,
				label: CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DAC,
				value: [],
			} as CompanyPreferenceEntity,
		},
		validationSchema: yup.object({
			dac: CompanyPreferenceEntity.yupSchema(),
		}),
		validateOnChange: true,
		onSubmit: async ({ dac }, { setValues, validateForm }) => {
			try {
				if (dac?.value) {
					if (dac?.id)
						dac = await companyApi.preferences.update(
							user?.company.id,
							dac.id,
							dac
						);
					else {
						dac = await companyApi.preferences.create(user?.company.id, dac);
					}
				} else if (dac?.id) {
					await companyApi.preferences.remove(user.id, dac.id);
					delete dac.id;
				}

				setValues({ dac });
				formSuccess(t, !!entity?.id ? "update" : "create", "COMPANY");
				if (onSaveComplete) onSaveComplete(dac);
			} catch (e) {
				console.error("Unable to save entity", e.response, e);
				globalAjaxExceptionHandler(e, { formik: form, toast, t });
				if (onSaveError) onSaveError(e);
			}
		},
	});

	useEffect(() => {
		form.setValues({
			dac: {
				...form.values.dac,
				...companyDaclist,
			},
		});
	}, [companyDaclist]);

	const handleAddItem = useCallback(async () => {

		if (form.values?.dac?.value?.includes(item)) {
			form.setFieldError("dac.value", "DAC_UNIQUE")
		} else {
			form.setFieldValue("dac.value", [...(form.values?.dac?.value || []), item]);
			setItem(null);
		}
	}, [form.values?.dac?.value, item]);

	const handleRemoveItem = useCallback(
		(listItem: string) => {
			form.setFieldValue(
				"dac.value",
				form.values.dac?.value?.filter((v) => v !== listItem)
			);
		},
		[form.values.dac.value]
	);

	const checklistItems = useMemo(
		() =>
			form.values.dac?.value?.map((listItem: string, key: Key) => (
				<Row key={key} className="mt-2">
					<div className="col-6 offset-2 border-bottom">{t(`${listItem}`)}</div>
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
			)),
		[form.values.dac?.value, handleRemoveItem]
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
				<BaseInput
					label="CHECKLIST_ITEMS"
					value={item}
					placeholder="CHECKLIST_ITEMS"
					className="col-8 offset-1"
					name="dac"
					error={form?.errors?.dac?.value as string}
					onChange={({ target: { value } }) => setItem(value as string)}
				/>
				<div className="col-1 mt-4 pt-2">
					<Button
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