import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { Form, Button, Col, Row, Table } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import BaseCheck from "../../base-check";
import { DriverLicenseType } from "../../../../enums/users/driver-license-type.enum";
import { CdlDto } from "../../../../models/jot-form/short-form/cdl-experience.dto";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { useContext, useEffect } from "react";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant";


export function CdlExperience() {
	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, stepNext, stepBack, setApplicantExtras, updateApplicantExtras },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new CdlDto(),
		validationSchema: CdlDto.yupSchema(),
		onSubmit: (values) => {
			const { license_type, years_cdl_experience, is_owner_operator, BUSINESS_NAME, DOT_NUMBER } = values;

			setApplicant({
				...applicant,
				license_type,
				years_cdl_experience,
				is_owner_operator,
			});
			updateApplicantExtras(BUSINESS_NAME)
			updateApplicantExtras(DOT_NUMBER)
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});
	useEffect(() => {
		// setApplicantExtras([...applicant?.extras])
		const { license_type, years_cdl_experience, is_owner_operator } = applicant;

		const apx_business_name = applicantExtras?.find(
			(v) => v.type == ApplicantExtras.BUSINESS_NAME
		);
		const apx_dot_number = applicantExtras?.find(
			(v) => v.type == ApplicantExtras.DOT_NUMBER
		);
		form.setValues({
			license_type: license_type || null,
			years_cdl_experience: years_cdl_experience || 0,
			is_owner_operator: is_owner_operator || null,
			BUSINESS_NAME: !!apx_business_name?.type
				? apx_business_name
				: new ApplicantExtrasEntity(ApplicantExtras.BUSINESS_NAME),
			DOT_NUMBER: !!apx_business_name?.type
				? apx_dot_number
				: new ApplicantExtrasEntity(ApplicantExtras.DOT_NUMBER),
		});
	}, []);

	function onLicenseTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const licenseType = e.target.value;
		switch (licenseType) {
			case DriverLicenseType.CDL_CLASS_C:
				form.setValues({
					...form.values,
					license_type: licenseType,
					is_owner_operator: false,
				});
				break;
			case null:
				form.setValues({
					...form.values,
					license_type: licenseType,
					is_owner_operator: false,
					years_cdl_experience: null,
				});
				break;
			default:
				form.setValues({
					...form.values,
					license_type: licenseType,
				});
				break;
		}
	}
	useEffect(() => {
		console.log("form.values", form.values)
		console.log("form.errors", form.errors)
	}, [form.values, form.errors])

	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("cdl_experince")}</h1>

			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row className={`${styles.bold} my-3`}>
					<BaseSelect
						className="col-12"
						label="TYPE_CDL_CLASS"
						placeholder="SELECT_ONE_PLACEHOLDER"
						name="license_type"
						required
						labelPrefix="DriverLicenseType"
						enumType={DriverLicenseType}
						formik={form}
						onChange={onLicenseTypeChange}
					/>
				</Row>



				{!!form.values.license_type && (
					<>
						<Row className={styles.bold}>
							<BaseInput
								className="col-12"
								type="number"
								step={0.1}
								min={0}
								name="years_cdl_experience"
								label={form.values.license_type !== DriverLicenseType.NO_CDL ? "years_cdl_experience" : "years__driving_experience"}
								placeholder="PLACEHOLDER_FOR_DIGITS"
								required
								formik={form}
							/>
						</Row>
						{form.values.license_type !== DriverLicenseType.NO_CDL && (
							<Row>
								<BaseCheck
									className="my-3"
									required
									name="is_owner_operator"
									label="is_owner_operator_question"
									formik={form}
								/>
							</Row>
						)}
					</>
				)}
				{Boolean(form.values.is_owner_operator) && (
					<>
						<Row className={styles.bold}>
							<BaseInput
								className="col-12"
								name="BUSINESS_NAME.value"
								label="BUSINESS_NAME"
								formik={form}
							/>
						</Row>
						<Row className={styles.bold}>
							<BaseInput
								className="col-12"
								name="DOT_NUMBER.value"
								label="DOT_NUMBER"
								formik={form}
							/>
						</Row>
					</>
				)}


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
		</>
	);
}
