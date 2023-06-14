import React, { useContext, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { HearAboutUsDto } from "../../../../models/jot-form/short-form/hear-about.dto";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { HearAboutUsType } from "../../../../enums/jotform/hear-about-type.enum";
import BaseInput from "../../base-input";
import ApplicantApi from "../../../../pages/api/applicant";
import { toast, ToastContainer } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { LoaderIcon } from "../../../loading/loader-icon";


export function HearAbout() {
	const {
		state: { applicantExtras, applicant },
		method: { updateApplicantExtras, stepNext, stepBack, setApplicant },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new HearAboutUsDto(),
		validationSchema: HearAboutUsDto.yupSchema(),
		onSubmit: async (values) => {
			const applicantApi = new ApplicantApi();
			const { HEAR_ABOUT_US } = values;
			updateApplicantExtras(HEAR_ABOUT_US);
			if (applicant?.can_pass_drug_test) {
				try {
					const filtered_extras = applicantExtras?.filter((v) => !!v.value);
					const { id } = await applicantApi.jotform.create({
						applicant,
						applicantExtras: filtered_extras,
					});
					setApplicant({
						...applicant,
						id,
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
			(v) => v.type === ApplicantExtras.HEAR_ABOUT_US
		);
		form.setValues({
			...form.values,
			HEAR_ABOUT_US: !!apx?.type
				? apx
				: new ApplicantExtrasEntity(ApplicantExtras.HEAR_ABOUT_US),
		});
	}, [applicantExtras]);

	return (
		<>

			<form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row>
					<h4 className={styles.heading__sty}>
						{t("HOW_DID_YOU_HEAR_ABOUT_US")}
					</h4>
				</Row>
				<Row>
					<BaseSelect
						className="mt-3 mb-3"
						labelPrefix="HearAboutUsType"
						enumType={HearAboutUsType}
						name="HEAR_ABOUT_US.value"
						placeholder="CHOOSE"
						formik={form}
					/>
				</Row>
				{form.values?.HEAR_ABOUT_US?.value === HearAboutUsType.REFERRAL && (
					<Row className={styles.bold}>
						<BaseInput
							className="col mb-4"
							name="REFERRAL_NUMBER"
							placeholder="REFERRAL_NUMBER"
							label="REFERRAL_NUMBER"
							formik={form}
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
