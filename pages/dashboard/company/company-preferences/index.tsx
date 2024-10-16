import { useFormik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { Button, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import * as yup from "yup";

import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import BaseClickToCopyInput from "../../../../components/forms/base-click-to-copy-input";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { DriverLicenseType } from "../../../../enums/users/driver-license-type.enum";
import { useAuth } from "../../../../hooks/use-auth";
import { useTranslation } from "../../../../hooks/use-translation";
import { CompanyPreferenceEntity } from "../../../../models/company/company-preferences.entity";
import CompanyApi from "../../../api/company";

import BaseCheck from "../../../../components/forms/base-check";
import BaseCheckList from "../../../../components/forms/base-check-list";
import BaseInput from "../../../../components/forms/base-input";
import ViewModal from "../../../../components/view-details/view-modal";
import { CompanyPreferenceCategory } from "../../../../enums/company/company-preference-category.enum";
import { CompanyPreferenceEnhancementLabel } from "../../../../enums/company/company-preference-enhancement-label.enum";
import { CompanyPreferenceAutoRecrutingLabel } from "../../../../enums/company/company-preferences-auto-recruiting-label.enum";
import { CompanyPreferenceJotformLabel } from "../../../../enums/company/company-preferences-jotform-label.enum";
import { JobEmploymentType } from "../../../../enums/jobs/job-employment-type.enum";
import { JobGeography } from "../../../../enums/jobs/job-geography.enum";
import { useEffectAsync } from "../../../../utils/react";
import { CompanyPreferenceVoeLabel } from "../../../../enums/company/company-preferences-voe-label.enum";

export default function CompanyPreference() {
	enum WhatsThisOptionsEnum {
		SHOW_AUTO_RECRUITING_MODAL = "SHOW_AUTO_RECRUITING_MODAL",
		SHOW_REFER_BACK_MODAL = "SHOW_REFER_BACK_MODAL",
	}

	const [preferences, setPreferences] = useState<CompanyPreferenceEntity[]>([]);

	const [showModal, setShowModal] = useState<boolean>(false);
	const [showReferModal, setShowReferModal] = useState<boolean>(false);
	const [showAutoRecruitingModal, setShowAutoRecruitingModal] =
		useState<boolean>(false);
	const [showAutoVoeModal, setShowAutoVoeModal] = useState<boolean>(false);

	const [modalAction, setModalAction] = useState<{
		label:
		| CompanyPreferenceAutoRecrutingLabel.ENROLL_IN_AUTO_RECRUITING
		| CompanyPreferenceAutoRecrutingLabel.PARTICIPATE_IN_REFER_BACK_PROGRAM;
	}>(null);

	const { user, isSuperAdmin, isCompanyAdmin } = useAuth();

	const { t } = useTranslation();
	const removeEmploymentTypes = [
		JobEmploymentType.SEASONAL,
		JobEmploymentType.PART_TIME,
		JobEmploymentType.ONE_TIME_GIG,
	];
	const FilteredEmploymentTypes = Object.values(JobEmploymentType).filter(
		(v) => !removeEmploymentTypes.includes(v)
	);

	const api = new CompanyApi();

	const form = useFormik({
		initialValues: {
			cdl_class: {
				...new CompanyPreferenceEntity(),
				category: CompanyPreferenceCategory.JOTFORM,
				label: CompanyPreferenceJotformLabel.CDL_CLASS,
				value: [],
			} as CompanyPreferenceEntity,
			employment_type: {
				...new CompanyPreferenceEntity(),
				category: CompanyPreferenceCategory.JOTFORM,
				label: CompanyPreferenceJotformLabel.EMPLOYMENT_TYPE,
				value: [],
			} as CompanyPreferenceEntity,
			job_geography: {
				...new CompanyPreferenceEntity(),
				category: CompanyPreferenceCategory.JOTFORM,
				label: CompanyPreferenceJotformLabel.JOB_GEOGRAPHY,
				value: [],
			} as CompanyPreferenceEntity,
			maximum_accidents: {
				...new CompanyPreferenceEntity(),
				category: CompanyPreferenceCategory.JOTFORM,
				label: CompanyPreferenceJotformLabel.MAXIMUM_ACCIDENTS,
				value: 0,
			} as CompanyPreferenceEntity,
			maximum_moving_violations: {
				...new CompanyPreferenceEntity(),
				category: CompanyPreferenceCategory.JOTFORM,
				label: CompanyPreferenceJotformLabel.MAXIMUM_MOVING_VIOLATIONS,
				value: 0,
			} as CompanyPreferenceEntity,
			years_cdl_experience: {
				...new CompanyPreferenceEntity(),
				category: CompanyPreferenceCategory.JOTFORM,
				label: CompanyPreferenceJotformLabel.YEARS_CDL_EXPERIENCE,
				value: 0,
			},
			add_ssn_on_dha: {
				...new CompanyPreferenceEntity(),
				category: CompanyPreferenceCategory.ENHANCEMENT,
				label: CompanyPreferenceEnhancementLabel.ADD_SSN_ON_DHA,
				value: false,
			},
		} as CompanyPreferenceEntity,

		validationSchema: yup.object({
			cdl_clas: CompanyPreferenceEntity.yupSchema(),
			maximum_moving_violations: CompanyPreferenceEntity.yupSchema(),
			maximum_accidents: CompanyPreferenceEntity.yupSchema(),
			years_cdl_experience: CompanyPreferenceEntity.yupSchema(),
			employment_type: CompanyPreferenceEntity.yupSchema(),
			job_geography: CompanyPreferenceEntity.yupSchema(),
			add_ssn_on_dha: CompanyPreferenceEntity.yupSchema(),
		}),
		onSubmit: async (values) => {
			try {
				const data = await Promise.all(
					Object.values(values).map(async (preference) => {
						if (preference.value) {
							if (preference.id)
								preference = await api.preferences.update(
									user?.company.id,
									preference.id,
									preference
								);
							else {
								preference = await api.preferences.create(
									user?.company.id,
									preference
								);
							}
						} else if (preference.id) {
							await api.preferences.remove(user.id, preference.id);
							delete preference.id;
						}

						return preference;
					})
				);
				setPreferences([...preferences, ...data]);
				populateForm(data);
				toast.success(t("SUCCESSFULLY_UPDATED_COMPANY_PREFERENCES"));
			} catch (e) {
				console.error("Unable to save preferences", e);
				toast.error(t("unable_to_save_information"));
			}
		},
	});

	useEffectAsync(async () => {
		setShowModal(true)
		if (user.company) {
			const api = new CompanyApi();
			let data = await api.preferences.list(user.company.id);
			if (
				!data?.find(
					(d) =>
						d?.label ==
						CompanyPreferenceAutoRecrutingLabel.PARTICIPATE_IN_REFER_BACK_PROGRAM
				)
			) {
				const referProgram: CompanyPreferenceEntity =
					await api.preferences.create(user?.company?.id, {
						category: CompanyPreferenceCategory.AUTO_RECRUITING,
						label:
							CompanyPreferenceAutoRecrutingLabel.PARTICIPATE_IN_REFER_BACK_PROGRAM,
						value: true,
					});
				data = [...data, { ...referProgram }];
			}
			setPreferences(data);
			populateForm(
				data?.filter(
					(pref) => [CompanyPreferenceCategory.JOTFORM, CompanyPreferenceCategory.ENHANCEMENT].includes(pref?.category)
				)
			);
		}
	}, []);

	/**
	 *
	 * @param {CompanyPreferenceEntity[]} preferences
	 */
	const populateForm = function (preferences) {
		preferences.forEach((v) => {
			const label = v.label?.toLowerCase();
			if (label in form.values) {
				form.initialValues[label] = v;
				form.setFieldValue(label, v);
			}
		});
	};

	const handleAdditinonalPreferenceChange = async ({ label }) => {
		let pref = await preferences?.find((p) => p?.label == label);
		if (pref?.id) {
			pref = await api.preferences.update(user?.company?.id, pref?.id, {
				...pref,
				value: !pref.value,
			});
		} else {
			pref = await api.preferences.create(user?.company?.id, {
				category: CompanyPreferenceCategory.AUTO_RECRUITING,
				label,
				value: true,
			});
		}
		if (!!pref) setModalAction(null);
		setPreferences([
			...(preferences?.filter((p) => p?.id != pref?.id) ?? []),
			{ ...pref },
		]);
	};

	const handleAutoVoeChange = async () => {
		let pref = await preferences?.find((p) => p.category == CompanyPreferenceCategory.VOE && p?.label == CompanyPreferenceVoeLabel.AUTOMATE_VOE_REQUEST_TO_PAST_EMPLOYEES);
		if (pref?.id) {
			pref = await api.preferences.update(user?.company?.id, pref?.id, {
				...pref,
				value: !pref.value,
			});
		} else {
			pref = await api.preferences.create(user?.company?.id, {
				category: CompanyPreferenceCategory.VOE,
				label: CompanyPreferenceVoeLabel.AUTOMATE_VOE_REQUEST_TO_PAST_EMPLOYEES,
				value: true,
			});
		}
		if (!!pref) setModalAction(null);
		setPreferences([
			...(preferences?.filter((p) => p?.id != pref?.id) ?? []),
			{ ...pref },
		]);
	};

	const tooltip = <Tooltip id="my-tooltip">{t("REFER_BACK_DETAILS")}</Tooltip>;
	const tooltipReferBack = (
		<></>
	);

	return (
		<>
			<PageLayout title="DIGITAL_HIRING_APPLICATION_AUTO_RECRUITING">
				{showModal && (
					<ViewModal
						show={showModal}
						onCloseClick={() => setShowModal(false)}
						closeText="CANCEL"
					>
						<div className="text-center">
							<h2>{t("DHA_welcome_note")}</h2>
							<p
								dangerouslySetInnerHTML={{
									__html: t("COMPANY_PREFERENCE_DHA_NOTE"),
								}}
							/>
							<p>
								{t("LEARN_MORE_ABOUT_BENEFITS")}
								<span className="text-blue">
									<span> </span>
									<Link href="https://digitalhiringapp.com/">
										<a target="_blank">{t("DHA_LINK")}</a>
									</Link>
								</span>
							</p>
						</div>
					</ViewModal>
				)}
				{/* refer back program modal */}

				{showReferModal && (
					<ViewModal
						show={showReferModal}
						onCloseClick={() => setShowReferModal(false)}
						closeText="CANCEL"
					>
						<div className="text-center">
							<h2>{t("REFER_BACK_PROGRAM")}</h2>
							<p>{t("REFER_BACK_PROGRAM_TEXT_1")}</p>

							<p>{t("REFER_BACK_PROGRAM_TEXT_2")}</p>
							<p>
								<span> {t("REFER_BACK_PROGRAM_TEXT_3_PART_1")}</span>
								<span> </span>
								<span className="text-primary">
									{t("REFER_BACK_PROGRAM_TEXT_3_PART_2")}
								</span>
								<span>{t("REFER_BACK_PROGRAM_TEXT_3_PART_3")}</span>
							</p>
						</div>
					</ViewModal>
				)}
				{/* auto recruiting */}
				{showAutoRecruitingModal && (
					<ViewModal
						show={showAutoRecruitingModal}
						onCloseClick={() => setShowAutoRecruitingModal(false)}
						closeText="CANCEL"
						headerClass="border-0 pt-2 pb-0 px-4"
						noCloseBtn
						centered
						bodyClass="pt-0"
					>
						<div>
							<h3 className="text-center" style={{ color: "#335665", fontWeight: "bolder" }}>{t("AUTO_RECRUITING")}</h3>
							<p className="text-center" style={{ fontSize: 'larger', fontStyle: "italic" }}>{t("LOOKING_TO_SCALE_UP")}</p>
							<p>{t("AUTO_RECRUITING_TEXT_1")}</p>
							<ul >
								<li style={{ listStyleType: "circle" }}>
									<p><b>{t("AUTO_RECRUITING_TEXT_2_TITLE")}</b>{t("AUTO_RECRUITING_TEXT_2")}</p>
								</li>
								<li style={{ listStyleType: "circle" }}>
									<p><b>{t("AUTO_RECRUITING_TEXT_3_TITLE")}</b>{t("AUTO_RECRUITING_TEXT_3")}</p>
								</li>
							</ul>
							<p>{t("AUTO_RECRUITING_TEXT_4")}</p>
							<p className="text-left mt-5">
								<span> {t("REFER_BACK_PROGRAM_TEXT_3_PART_1")}</span>
								<span> </span>
								<Link href={""}>
									<a style={{ color: '#33acb9', textDecoration: "underline" }}>
										{t("REFER_BACK_PROGRAM_TEXT_3_PART_2")}
									</a>
								</Link>
								<span>{t("REFER_BACK_PROGRAM_TEXT_3_PART_3")}</span>
							</p>
						</div>
					</ViewModal>
				)}
				{/* confirm auto recruiting */}
				{Boolean(modalAction) && (
					<ViewModal
						size="sm"
						show={Boolean(modalAction)}
						onCloseClick={() => setModalAction(null)}
						closeText="CANCEL"
					>
						<>
							<h2 className="text-center">
								{t("AUTO_RECURUITING_REGISTRATION")}
							</h2>
							<p>
								{Boolean(preferences?.find((v) => v?.label == CompanyPreferenceAutoRecrutingLabel.ENROLL_IN_AUTO_RECRUITING)?.value)
									? t("AUTO_RECURUITING_REGISTRATION_TEXT_2")
									: t("AUTO_RECURUITING_REGISTRATION_TEXT_1")
								}
							</p>
							<div className="d-flex justify-content-center">
								<Button
									onClick={() => handleAdditinonalPreferenceChange(modalAction)}
								>
									{t("CONFIRM")}
								</Button>
							</div>
						</>
					</ViewModal>
				)}
				{/* auto voe */}
				{showAutoVoeModal && (
					<ViewModal
						show={showAutoVoeModal}
						onCloseClick={() => setShowAutoVoeModal(false)}
						closeText="CANCEL"
						headerClass="border-0 pt-2 pb-0 px-4"
						noCloseBtn
						centered
						bodyClass="pt-0"
					>
						<div>
							<h3 className="text-center" style={{ color: "#335665", fontWeight: "bolder" }}>{t("AUTOMATE_VOE_REQUEST_TO_PAST_EMPLOYEES")}</h3>
							<p>{t("AUTOMATE_VOE_REQUEST_TO_PAST_EMPLOYEES_TEXT_1")}</p>
						</div>
					</ViewModal>
				)}

				<p className="pt-2 pb-2">{t("DHA_PREFERENCE_POINT_1")}</p>
				<BaseClickToCopyInput
					label="DIGITAL_HIRING_APP_URL"
					className="my-2 border p-3 rounded  link-background"
					value={`${process.env.FRONTEND_BASE_URL ?? ""}apply/${user?.company?.slug
						}`}
					tooltipText={t("CLICK_TO_COPY")}
				/>
				<p className="pt-2 pb-2">{t("DHA_URL_TIP_TEXT")}</p>
				<div className="d-flex align-item-start my-4">
					<p>{t("PARTICIPE_IN_REFER_BACK_PROGRAM")}</p>
					<p
						className="ml-1 text-blue cursor-pointer hover:underline"
						onClick={() => setShowReferModal(true)}
						style={{ fontSize: "12px" }}
					>
						{!Boolean(isCompanyAdmin) ? (
							<OverlayTrigger
								trigger={["hover"]}
								delay={{ show: 0, hide: 0 }}
								overlay={tooltipReferBack}
							>
								<em>{t("WHATS_THIS")}</em>
							</OverlayTrigger>
						) : (
							<em>{t("WHATS_THIS")}</em>
						)}
					</p>
					<BaseCheck
						className="mt-2 col float-left"
						name="is_current_employed"
						// disabled={!Boolean(isCompanyAdmin)}
						checked={Boolean(
							preferences?.find(
								(pref) =>
									pref?.label ==
									CompanyPreferenceAutoRecrutingLabel.PARTICIPATE_IN_REFER_BACK_PROGRAM
							)?.value
						)}
						onChange={() =>
							handleAdditinonalPreferenceChange({
								label:
									CompanyPreferenceAutoRecrutingLabel.PARTICIPATE_IN_REFER_BACK_PROGRAM,
							})
						}
					/>
				</div>

				<div className="d-flex align-item-start my-4">
					<p>{t("ENROLL_IN_AUTO_RECURUITING")}</p>
					<p
						className="ml-1 text-blue cursor-pointer hover:underline"
						onClick={() => setShowAutoRecruitingModal(true)}
						style={{ fontSize: "12px" }}
					>
						<em>{t("WHATS_THIS")}</em>
					</p>

					<BaseCheck
						className="mt-2 col float-left"
						checked={Boolean(
							preferences?.find(
								(pref) =>
									pref?.label ==
									CompanyPreferenceAutoRecrutingLabel.ENROLL_IN_AUTO_RECRUITING
							)?.value
						)}
						onChange={() =>
							setModalAction({
								label:
									CompanyPreferenceAutoRecrutingLabel.ENROLL_IN_AUTO_RECRUITING,
							})
						}
					/>
				</div>

				<div className="d-flex align-item-start my-4">
					<p>{t("AUTOMATE_VOE_REQUEST_TO_PAST_EMPLOYEES")}</p>
					<p
						className="ml-1 text-blue cursor-pointer hover:underline"
						onClick={() => setShowAutoVoeModal(true)}
						style={{ fontSize: "12px" }}
					>
						<em>{t("WHATS_THIS")}</em>
					</p>
					<BaseCheck
						className="mt-2 col float-left"
						checked={Boolean(
							preferences?.find(
								(p) =>
									p.category == CompanyPreferenceCategory.VOE && p?.label == CompanyPreferenceVoeLabel.AUTOMATE_VOE_REQUEST_TO_PAST_EMPLOYEES
							)?.value
						)}
						onChange={() =>
							handleAutoVoeChange()
						}
					/>
				</div>

				<h3 className="pt-2 pb-2">{t("MATCH_CRITERIA")}</h3>
				<p className="pt-2 pb-2">{t("MATCH_CRITERIA_MESSAGE")}</p>

				<h3 className="pt-2 pb-2">{t("COMPANY_PREFERENCE")}</h3>
				<p className="pt-2 pb-2">{t("DHA_PREFERENCE_POINT_2")}</p>

				<form
					onSubmit={form.handleSubmit}
					className="py-4 px-3 border rounded mt-4"
					style={{ background: "#e9ecef" }}
				>
					<Row>
						<div className="d-flex align-item-start col-md-12">
							<p>{t("ADD_SSN_ON_DHA")}</p>
							<BaseCheck
								className="col float-left"
								name="add_ssn_on_dha.value"
								formik={form}
							/>
						</div>

						<BaseCheckList
							className="col-12 mt-2"
							label="CDL_CLASS"
							name="cdl_class.value"
							labelPrefix="DriverLicenseType"
							required
							enumType={DriverLicenseType}
							formik={form}
						/>
						<BaseCheckList
							className="col-12 mt-2"
							label="EMPLOYMENT_TYPE"
							name="employment_type.value"
							labelPrefix="JobEmploymentType"
							required
							enumType={FilteredEmploymentTypes}
							formik={form}
						/>
						<BaseCheckList
							className="col-12 mt-2"
							label="DRIVER_DISTANCE"
							name="job_geography.value"
							labelPrefix="JobGeography"
							required
							enumType={JobGeography}
							formik={form}
						/>
						<BaseInput
							className="col-md-4 mt-4"
							label="years_cdl_experience"
							name="years_cdl_experience.value"
							type="number"
							displayPlaceholder
							formik={form}
						/>

						<BaseInput
							className="col-md-4 mt-4"
							label="MAX_ACCIDENTS"
							name="maximum_accidents.value"
							type="number"
							displayPlaceholder
							formik={form}
						/>

						<BaseInput
							className="col-md-3 mt-4"
							label="MAX_MOVING_VIOLATIONS"
							name="maximum_moving_violations.value"
							type="number"
							displayPlaceholder
							formik={form}
						/>

					</Row>
					<Row className="mt-3">
						{/* <Col className="">
							<OverlayTrigger
								trigger={["hover", "focus"]}
								delay={{ show: 0, hide: 0 }}
								overlay={tooltip}
							>
								<Button>{t("REFER_BACK_QUESTION")}</Button>
							</OverlayTrigger>
						</Col> */}
						<Col className="col-md-11 mt-3 text-start" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }} md={3}>
							<Button
								type="submit"
								variant="primary"
								disabled={form.isSubmitting || !form.isValid || !form.dirty}
							>
								{t("UPDATE")}
							</Button>
						</Col>
					</Row>
				</form>
			</PageLayout>
		</>
	);
}

CompanyPreference.getLayout = function getLayout(page) {
	return <FullLayout>{page}</FullLayout>;
};
