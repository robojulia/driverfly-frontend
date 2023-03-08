import { useContext, useEffect } from "react";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseCheck from "../../base-check";
import { CurrentEmploymentHistoryPageDto } from "../../../../models/jot-form/long-form/current-employment-history-page.dto";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import StateSelect from "../../state-select";
import { LoaderIcon } from "../../../loading/loader-icon";
import { CurrentEmploymentHistoryDto } from "../../../../models/jot-form/long-form/current-emplyment-history/index.dto";
import { ApplicantEmployerEntity } from "../../../../models/applicant";

export function EmploymentHistory() {
	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new CurrentEmploymentHistoryPageDto(),
		validationSchema: CurrentEmploymentHistoryPageDto.yupSchema(),
		onSubmit: (values) => {
			const { employer, is_current_employed } = values;

			const employers: ApplicantEmployerEntity[] = applicant?.employers?.filter(v => !!!v?.is_current)

			if (!!is_current_employed) employers.push(employer)

			setApplicant({
				...applicant,
				employers
			});
			stepNext();
			return
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const employer: CurrentEmploymentHistoryDto = applicant.employers?.find(v => !!v?.is_current) as CurrentEmploymentHistoryDto;

		form.setValues({
			...form.values,
			employer: {
				...employer,
				is_current: true
			},
			is_current_employed: !!employer,
		});
	}, [applicant]);

	useEffect(() => {

		console.log("values", form.values);
		console.log("error", form.errors);
	}, [form.values, form.errors]);

	return (
		<>
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<h4
					className={`${styles.heading__sty} ${styles.striped__border}`}
				>
					{t("EMPLOYMENT_HISTORY")}
				</h4>
				<p className={`${styles.paragraph} ${styles.align__text_left}`}>
					{t("HONEST_ABOUT_PAST_EMP")}
				</p>
				<Row className={styles.align__text_left}>
					<BaseCheck
						className="mt-2 col float-left"
						required
						label="CURRENTLY_EMPLYED_QUESTION"
						name="is_current_employed"
						formik={form}
					/>
				</Row>
				{!!form.values?.is_current_employed && (
					<div className="single-past-employer-items my-5 pb-5 px-2">
						<Row className={styles.bold}>
							<h6
								className={`${styles.heading__sty} ${styles.align__text_left}`}
							>
								{t("CURRENT_EMPLOYER")}
							</h6>
							<p className={`${styles.paragraph} ${styles.align__text_left}`}>
								{t("NA")}
							</p>
						</Row>

						<Row >
							<BaseCheck
								className="mt-lg-12 my-3 col-md-12 float-left"
								required
								name="employer.can_contact"
								label="CONATACT_AUTHORITY"
								formik={form}
							/>
						</Row>

						<Row className={`${styles.align__text_left} ${styles.bold}`}>
							<BaseInput
								className="col-md-6 my-3"
								name="employer.name"
								label="CURRENT_COMPANY_NAME"
								required
								formik={form}
							/>
							<BaseInput
								className="col-md-6 my-3"
								name="employer.title"
								label="CURRENT_COMPANY_POSITION"
								formik={form}
							/>
						</Row>

						<Row className={styles.bold}>
							<BaseInput
								className="col-md-6 my-3"
								required
								type="date"
								max={new Date().toISOString().split('T')[0]}
								name="employer.start_at"
								label="START_DATE"
								formik={form}
							/>
							<BaseInputPhone
								className="col-md-6 my-3"
								name="employer.phone"
								placeholder="phone"
								label="CURRENT_COMPANY_NUMBER"
								formik={form}
							/>
						</Row>

						<Row className={`${styles.align__text_left} ${styles.bold}`}>
							<BaseInput
								className="col-md-6 my-3"
								name="employer.manager_name"
								label="MANAGER_OR_REPRESENTATIVE"
								formik={form}
							/>
							<BaseInput
								className="col-md-6 my-3"
								required
								name="employer.email"
								label="CURRENT_COMPANY_EMAIL"
								placeholder="email"
								formik={form}
							/>
						</Row>

						<Row className={styles.bold}>
						</Row>
						<Row className={styles.bold}>
							<BaseInput
								className="col-md-6 my-3"
								required
								name="employer.address"
								placeholder="ADDRESS_LINE_1"
								label="ADDRESS_LINE_1"
								formik={form}
							/>
							<BaseInput
								className="col-md-6 my-3"
								name="employer.address_2"
								placeholder="ADDRESS_LINE_2"
								label="ADDRESS_LINE_2"
								formik={form}
							/>
						</Row>
						<Row className={styles.bold}>
							<BaseInput
								className="col-md-6 my-3"
								required
								name="employer.zip_code"
								type="number"
								placeholder="zip_code"
								label="zip_code"
								formik={form}
							/>
							<BaseInput
								className="col-md-6 my-3"
								required
								name="employer.city"
								label="City"
								formik={form}
							/>
							<StateSelect
								className="col my-3"
								required
								label="STATE"
								name="employer.state"
								placeholder="STATE"
								formik={form}
							/>
						</Row>

						<Row >
							<BaseCheck
								className="mt-2 col-md-6 float-left"
								name={`employer.is_subject_to_fmcsrs`}
								label="FMCR_QUESTION"
								formik={form}
							/>
							<BaseCheck
								className="mt-2 col-md-6 float-left"
								name={`employer.is_subject_to_drug_tests`}
								label="JOB_DESIGNATED_CURRENT_COMPANY"
								formik={form}
							/>
						</Row>
					</div>
				)}

				<Row className="mt-5">
					<Col>
						<Button className="float-right" type="reset">
							{t("BACK")}
						</Button>
					</Col>
					<Col>
						<Button
							className="float-left"
							type="submit"
						>
							{t("NEXT")} <LoaderIcon isLoading={!!form?.isSubmitting} />
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}
