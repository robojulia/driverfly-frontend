import { useFormik } from "formik";
import { useContext, useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { DriverLicenseType } from "../../../../enums/users/driver-license-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { AccidentViolationDto } from "../../../../models/jot-form/short-form/accident-violation.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import ViewModal from "../../../view-details/view-modal";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import BaseRadio from "../../base-radio";
import { BooleanType } from "../../../../enums/jotform/boolean-type.enum";


export function AccidentViolation() {
	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

	const [showModal, setShowModal] = useState(false);

	const handleSubmit = (values: AccidentViolationDto) => {
		const { authorized_to_work_in_us } = values;

		if (authorized_to_work_in_us === false) {
			setShowModal(true);
		} else {
			submitForm(values);
		}
	};

	const submitForm = (values: AccidentViolationDto) => {
		setApplicant({
			...applicant,
			can_pass_drug_test: values.can_pass_drug_test,
			moving_violations_count: values.moving_violations_count,
			all_violations_count: values.all_violations_count,
			authorized_to_work_in_us: values.authorized_to_work_in_us,
			accident_count: values.accident_count
		});
		stepNext();
	};

	const form = useFormik({
		initialValues: new AccidentViolationDto(),
		validationSchema: AccidentViolationDto.yupSchema(),
		onSubmit: handleSubmit,
		onReset: (values) => {
			stepBack();
		},
	});

	const applicantValues = useMemo(() => {
		const {
			can_pass_drug_test,
			moving_violations_count,
			all_violations_count,
			authorized_to_work_in_us,
			accident_count,
		} = applicant;

		return {
			can_pass_drug_test: can_pass_drug_test || null,
			moving_violations_count: moving_violations_count || 0,
			all_violations_count: all_violations_count || 0,
			authorized_to_work_in_us: authorized_to_work_in_us || null,
			accident_count: accident_count || 0,
		};
	}, [applicant]);

	useEffect(() => {
		form.setValues(applicantValues);
	}, [applicantValues]);

	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("ACCIDENTS_AND_VIOLATIONS")}</h1>
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row >
					<BaseRadio
						name={`can_pass_drug_test`}
						className="float-left ml-2 my-2 w-40"
						label={`can_pass_drug_test`}
						labelPrefix="BooleanType"
						enumType={BooleanType}
						value={
							form.values.can_pass_drug_test === true
								? BooleanType.YES
								: (form.values.can_pass_drug_test === false && BooleanType.NO)
						}
						onChange={({ target: { value } }) => {
							form.setFieldValue(
								"can_pass_drug_test",
								value === BooleanType.YES ? true : (value === BooleanType.NO && false)
							);
						}}
					/>
				</Row>
				<Row >
					<p className={`${styles.paragraph} ${styles.align__text_left}`}>
						{t("{company_name}_DRUG_TEST_DOT", { company_name: applicant?.company?.name }, { translateProps: true })}
					</p>
				</Row>
				<Row className={styles.bold}>
					<BaseInput
						className="col my-3"
						required
						name="moving_violations_count"
						type="number"
						step={1}
						min={0}
						label="voilations_in_last_3_years"
						placeholder="PLACEHOLDER_FOR_DIGITS"
						formik={form}
					/>
				</Row>
				<Row className={styles.bold}>
					<BaseInput
						className="col my-3"
						required
						name="all_violations_count"
						type="number"
						step={1}
						min={0}
						label="ALL_VIOLATION_IN_LAST_3_YEARS"
						placeholder="PLACEHOLDER_FOR_DIGITS"
						formik={form}
					/>
				</Row>
				<Row className={styles.bold}>
					<BaseInput
						min={0}
						className="col my-3"
						type="number"
						name="accident_count"
						label="accidents_last_5_years"
						placeholder="PLACEHOLDER_FOR_DIGITS"
						formik={form}
					/>
				</Row>
				<Row >
					{
						Boolean(applicant.license_type == DriverLicenseType.NO_CDL) && (
							<BaseCheck
								className="col my-3"
								name="authorized_to_work_in_us"
								label="ELIGIBLE_TO_WORK_IN_US"
								formik={form}
							/>
						)
					}

				</Row>
				<Row className={"mt-3"}>
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

			<ViewModal
				show={showModal}
				title=""
				size="lg"
				onCloseClick={() => setShowModal(false)}
				footer={
					<Row className="mt-5 w-100">
						<Col>
							<Button
								className="float-right"
								onClick={() => setShowModal(false)}
							>
								{t("NO")}
							</Button>
						</Col>
						<Col>
							<Button
								onClick={() => {
									setShowModal(false);
									submitForm(form.values);
								}}
								className="float-left theme-secondary-btn"
							>
								{t("PROCEED")}
							</Button>
						</Col>
					</Row>
				}
			>
				<>
					<h3 className="text-center">
						<b>
							{t("DHA_WARNING_MESSAGE_NOT_ELIGIBLE_TO_WORK_IN_US")}
						</b>
					</h3>
					<h4 className="text-center text-warning">
						{t("NOT_ELIGIBLE_MESSAGE", { company: applicant?.company?.name })}
					</h4>
					<h5 className="text-center">
						{t("PROCEED_WITH_APPLICATION")}
					</h5>
				</>

			</ViewModal>
		</>
	);
}
