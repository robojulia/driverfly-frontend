import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { HearAboutUsType } from "../../../../enums/jotform/hear-about-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../models/applicant";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { HearAboutUsDto } from "../../../../models/jot-form/short-form/hear-about.dto";
import ApplicantApi from "../../../../pages/api/applicant";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { LoaderIcon } from "../../../loading/loader-icon";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";

export function HearAbout() {
	const {
		state: { applicantExtras, applicant, jobs, utm, company },
		method: { setApplicantExtras, stepNext, stepBack, setApplicant },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new HearAboutUsDto(),
		validationSchema: HearAboutUsDto.yupSchema(),
		onSubmit: async (values) => {
			const applicantApi = new ApplicantApi();
			const { HEAR_ABOUT_US, REFERAL_NAME } = values;
			if (applicant?.can_pass_drug_test) {
				try {
					const filteredExtras = ([
						...applicantExtras,
						{ ...HEAR_ABOUT_US },
						{ ...REFERAL_NAME },
					]).filter(v => !!v?.value)

					let response: ApplicantEntity;
					if (applicant?.id) {
						response = await applicantApi.jotform.update(applicant.id, {
							applicant,
							applicantExtras: filteredExtras,
							jobs,
							utm
						});
					} else {
						response = await applicantApi.jotform.create(company.id, {
							applicant,
							applicantExtras: filteredExtras,
							jobs,
							utm
						});
					}
					setApplicantExtras(response?.extras)
					setApplicant({
						...applicant,
						...response
					});

					stepNext();

				} catch (error) {
					console.log(error);
					globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
				}
			} else {
				stepNext();
			}
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const apx = applicantExtras?.find(
			(v) => v.type == ApplicantExtras.HEAR_ABOUT_US
		);
		const apx_referal_name = applicantExtras?.find(
			(v) => v.type == ApplicantExtras.REFERAL_NAME
		);
		form.setValues({
			...form.values,
			HEAR_ABOUT_US: !!apx?.type
				? apx
				: {
					...(new ApplicantExtrasEntity(ApplicantExtras.HEAR_ABOUT_US)),
					value: Boolean(utm?.referral_name) ? HearAboutUsType.REFERRAL : null
				},
			REFERAL_NAME: !!apx_referal_name?.type
				? apx_referal_name
				: {
					...(new ApplicantExtrasEntity(ApplicantExtras.REFERAL_NAME)),
					value: Boolean(utm?.referral_name) ? utm?.referral_name : null
				},
		});
	}, [applicantExtras]);

	useEffect(() => {
		console.log("form values", form.values);
		console.log("form error", form.errors);
	}, [form.values, form.errors]);

	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("HOW_DID_YOU_HEAR_ABOUT_US")}</h1>
			<form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row>
					<BaseSelect
						className="mt-3 mb-3"
						labelPrefix="HearAboutUsType"
						enumType={HearAboutUsType}
						name="HEAR_ABOUT_US.value"
						placeholder="CHOOSE"
						formik={form}
						readOnly={Boolean(utm?.referral_name)}
					/>
				</Row>

				{form.values?.HEAR_ABOUT_US?.value == HearAboutUsType.REFERRAL && (
					<Row className={styles.bold}>
						<BaseInput
							className="col mb-4"
							name="REFERAL_NAME.value"
							placeholder="REFERRAL_NAME"
							label="REFERRAL_NAME"
							formik={form}
							readOnly={Boolean(utm?.referral_name)}
						/>
					</Row>
				)}
				<Row className="mt-3">
					<Col>
						<Button className="float-md-right" type="reset">
							{t("BACK")}
						</Button>
					</Col>

					<Col>
						<Button
							disabled={form.isValidating || form.isSubmitting || !form.isValid}
							className="float-md-left float-right"
							type="submit"
						>
							{t("NEXT")} <LoaderIcon isLoading={!!form?.isSubmitting} />
						</Button>
					</Col>
				</Row>
			</form>
		</>
	);
}
