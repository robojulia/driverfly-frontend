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
import { EmployeeDqf } from "../../../enums/employee/employee-dqf.enum";
import { CompanyPreferenceCategory } from "../../../enums/company/company-preference-category.enum";
import { CompanyPreferenceOnboardingChecklistLabel } from "../../../enums/company/company-preferences-onboarding-checklist-label.enum";
import { CompanyPreferenceEntity } from "../../../models/company/company-preferences.entity";
import EntityForm from "../../layouts/page/entity-form";
import BaseSelect from "../base-select";
import BaseInput from "../base-input";
import { BaseFormProps } from "./base-form-props";

/**
 * Formats a string by removing underscores and converting to proper title case
 * Example: "MOTOR_VEHICLE_RECORD_MVR" -> "Motor Vehicle Record (MVR)"
 */
const formatLabel = (label: string): string => {
	return label
		.replace(/_/g, ' ')
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
		.replace(/\bMvr\b/g, '(MVR)')
		.replace(/\bDot\b/g, 'DOT')
		.replace(/\bPsp\b/g, 'PSP')
		.replace(/\bTwic\b/g, 'TWIC')
		.replace(/\bHos\b/g, 'HOS')
		.replace(/\bCdl\b/g, 'CDL')
		.replace(/\bId\b/g, 'ID')
		.replace(/\bW 9\b/g, 'W-9')
		.replace(/\bW 4\b/g, 'W-4')
		.replace(/\bI 9\b/g, 'I-9');
};

export interface CompanyPreferencesDqfFormProps
	extends BaseFormProps<CompanyPreferenceEntity> {
	companyDqfList: CompanyPreferenceEntity;
}

export function CompanyPreferencesDqfForm(
	props: CompanyPreferencesDqfFormProps
) {
	const [item, setItem] = useState<string>("");
	const [inputMode, setInputMode] = useState<"select" | "custom">("select");

	const { user } = useAuth();

	const { t } = useTranslation();
	const companyApi = new CompanyApi();
	let {
		className,
		entity,
		companyDqfList,
		onSaveComplete,
		onSaveError,
	} = props;

	const form = useFormik({
		initialValues: {
			dqfList: {
				...new CompanyPreferenceEntity(),
				category: CompanyPreferenceCategory.DQF,
				label: CompanyPreferenceOnboardingChecklistLabel.EMPLOYEE_DQF_DOCUMENTS,
				value: [],
			} as CompanyPreferenceEntity,
		},
		validationSchema: yup.object({
			dqfList: CompanyPreferenceEntity.yupSchema(),
		}),
		onSubmit: async ({ dqfList }, { setValues }) => {
			try {
				if (dqfList?.value) {
					if (dqfList?.id)
						dqfList = await companyApi.preferences.update(
							user?.company.id,
							dqfList.id,
							dqfList
						);
					else {
						dqfList = await companyApi.preferences.create(
							user?.company.id,
							dqfList
						);
					}
				} else if (dqfList?.id) {
					await companyApi.preferences.remove(user.id, dqfList.id);
					delete dqfList.id;
				}

				setValues({ dqfList });
				toast.success(t("SUCCESSFULLY_SAVED"));
				if (onSaveComplete) onSaveComplete(dqfList);
			} catch (e) {
				console.error("Unable to save entity", e.response, e);
				globalAjaxExceptionHandler(e, { formik: form, toast, t });
				if (onSaveError) onSaveError(e);
			}
		},
	});

	useEffect(() => {
		form.setValues({
			dqfList: {
				...form.values.dqfList,
				...companyDqfList,
			},
		});
	}, [companyDqfList]);

	const handleAddItem = useCallback(() => {
		if (!item || !item.trim()) return;

		if (form.values?.dqfList?.value?.includes(item)) {
			form.setFieldError("dqfList.value", "DOCUMENT_ALREADY_LISTED");
			return;
		}

		form.setFieldValue("dqfList.value", [
			...(form.values?.dqfList?.value || []),
			item.trim(),
		]);
		form.setFieldError("dqfList.value", undefined);
		setItem("");
	}, [form.values?.dqfList?.value, item]);

	const handleRemoveItem = useCallback(
		(listItem: string) => {
			form.setFieldValue(
				"dqfList.value",
				form.values.dqfList?.value?.filter((v) => v !== listItem)
			);
		},
		[form.values.dqfList.value]
	);

	const dqfItems = useMemo(
		() =>
			form.values.dqfList?.value?.map(
				(listItem: string, key: Key) => {
					// Check if it's a known enum value or custom string
					const isEnumValue = Object.values(EmployeeDqf).includes(listItem as EmployeeDqf);
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
		[form.values.dqfList?.value, handleRemoveItem]
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
								form.setFieldError("dqfList.value", undefined);
							}}
						>
							{t("SELECT_FROM_LIST")}
						</Button>
						<Button
							variant={inputMode === "custom" ? "primary" : "outline-primary"}
							onClick={() => {
								setInputMode("custom");
								setItem("");
								form.setFieldError("dqfList.value", undefined);
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
						label="DQF_DOCUMENTS"
						value={item}
						placeholder="SELECT_DOCUMENT_TYPE"
						className="col-8 offset-1"
						name="dqfList"
						enumType={EmployeeDqf}
						createLabel={(option) => formatLabel(option.value)}
						onChange={({ target: { value } }) => {
							setItem(value as string);
							form.setFieldError("dqfList.value", undefined);
						}}
					/>
				) : (
					<BaseInput
						label="CUSTOM_FILE_TYPE"
						value={item}
						placeholder="ENTER_CUSTOM_FILE_TYPE_NAME"
						className="col-8 offset-1"
						name="customDqfItem"
						onChange={({ target: { value } }) => {
							setItem(value);
							form.setFieldError("dqfList.value", undefined);
						}}
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
			{form?.errors?.dqfList?.value && (
				<Row className="my-2">
					<div className="col-10 offset-1">
						<div className="text-danger" style={{ fontSize: '0.875rem' }}>
							{t(form.errors.dqfList.value as string)}
						</div>
					</div>
				</Row>
			)}
			<div className="mt-5">{dqfItems}</div>
		</EntityForm>
	);
}
