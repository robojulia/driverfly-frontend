import { useContext, useEffect } from "react";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseCheck from "../../base-check";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import StateSelect from "../../state-select";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { PastEmploymentPageDto } from "../../../../models/jot-form/long-form/past-employment-page.dto";
import { PastEmploymentHistoryDto } from "../../../../models/jot-form/long-form/past-employment-history/index.dto";
import { ApplicantEmployerEntity } from "../../../../models/applicant";

export function PastEmploymentHistory() {

	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new PastEmploymentPageDto(),
		validationSchema: PastEmploymentPageDto.yupSchema(),
		onSubmit: (values) => {
			const { employers } = values;

			const employer: ApplicantEmployerEntity = applicant.employers?.find(v => !!v.is_current)

			if (employer) employers.push(employer)

			setApplicant({
				...applicant,
				employers
			});

			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const employers: PastEmploymentHistoryDto[] = applicant.employers?.filter(v => !!!v.is_current) as PastEmploymentHistoryDto[]

		form.setValues({
			...form.values,
			employers: employers.length > 0 ? employers : [{
				...(new PastEmploymentHistoryDto()),
				is_subject_to_fmcsrs: true,
				is_subject_to_drug_tests: true,
				is_current: false
			}],
			is_previous_employed: !!employers?.length,
		});
	}, [applicant]);

	return (
		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>

			<h4
				className={`${styles.heading__sty} mt-0 mb-0 pb-0 fs-5 text-start`}
				style={{ color: 'gray' }}
			>
				{t("ADD_EMPLOYMENT_HISTORY_NUMBER_{number}", { number: applicant?.years_cdl_experience > 3 ? 10 : 3 }, { translateProps: true })}
			</h4>
			<h5
				className={`${styles.heading__sty} pt-0 mt-2 fs-6 text-start`}
				style={{ color: 'gray' }}
			>
				{t("ADD_EMPLOYMENT_HISTORY_SUB_HEADING")}
			</h5>

			<h4
				className={`${styles.heading__sty} ${styles.striped__border}`}
			>
				{t("PAST_EMPLOYMENT_HISTORY")}
			</h4>
			<p className={`${styles.paragraph} ${styles.align__text_left}`}>
				{t("HONEST_ABOUT_PAST_EMPLOYMENT")}
			</p>
			<Row className={styles.align__text_left}>
				<BaseCheck
					className="mt-2 col-md-8 float-left"
					name="is_previous_employed"
					label="PREVIOUSLY_EMPLOYED"
					formik={form}
				/>
			</Row>

			{(!!form?.values?.is_previous_employed && form?.values?.employers?.length > 0) &&
				<>
					{
						Boolean((form?.values?.employers)?.length !== 12) && (
							<Row>
								{!!form?.values?.is_previous_employed && (
									<>
										<Col className="mt-2">
											<Button
												className="w-100 py-2"
												size="sm"
												onClick={() =>
													form.setFieldValue("employers", [
														...(form.values?.employers || []),
														{
															...(new PastEmploymentHistoryDto()),
															is_subject_to_fmcsrs: true,
															is_subject_to_drug_tests: true,
															is_current: false
														},
													])
												}
											>
												<PlusCircle /> {t("ADD_PAST_EMPLOYMENT_HISTORY")}
											</Button>
										</Col>
									</>
								)}
							</Row>
						)
					}
				</>
			}
			<>
				{
					Boolean((form?.values?.employers)?.length !== 12) && (
						<Row>
							{!!form?.values?.is_previous_employed && (
								<>
									<Col className="mt-2">
										<Button
											className="w-100 py-2"
											size="sm"
											onClick={() =>
												form.setFieldValue("employers", [
													...(form.values?.employers || []),
													{
														...(new PastEmploymentHistoryDto()),
														is_current: false
													},
												])
											}
										>
											<PlusCircle /> {t("ADD_PAST_EMPLOYMENT_HISTORY")}
										</Button>
									</Col>
								</>
							)}
						</Row>
					)
				}
			</>



			<Row className="mt-5">
				<Col>
					<Button className="float-right" type="reset">
						{t("BACK")}
					</Button>
				</Col>
				<Col>
					<Button className="float-left" type="submit">
						{t("NEXT")}
					</Button>
				</Col>
			</Row>
		</Form>
	);
}