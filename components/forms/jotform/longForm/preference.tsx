import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import JotformContext, {
	JotFormContextType,
} from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { JobGeography } from "../../../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../../../enums/jobs/job-schedule.enum";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
import { OtherRequirementType } from "../../../../enums/users/other-requirements.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { PreferencesDto } from "../../../../models/jot-form/long-form/preferences.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseCheckList from "../../base-check-list";
import BaseSelect from "../../base-select";

export function Preferences() {
	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new PreferencesDto(),
		validationSchema: PreferencesDto.yupSchema(),
		onSubmit: (values) => {
			console.log("values", values);
			const {
				routes,
				REQUIRE_W2_EMPLOYMENT,
				OTHER_ABSOLUTELY_REQUIREMENTS,
				preferred_location,
			} = values;
			setApplicant({ ...applicant, preferred_location, routes })
			updateApplicantExtras(REQUIRE_W2_EMPLOYMENT);
			updateApplicantExtras(OTHER_ABSOLUTELY_REQUIREMENTS);
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	// useEffect(() => {
	// 	console.log("form values", form.values);
	// 	console.log("form error", form.errors);
	// }, [form.values, form.errors]);

	useEffect(() => {
		const apx_w2 = applicantExtras?.find(
			(v) => v.type == ApplicantExtras.REQUIRE_W2_EMPLOYMENT
		);
		const apx_other = applicantExtras?.find(
			(v) => v.type == ApplicantExtras.OTHER_ABSOLUTELY_REQUIREMENTS
		);
		form.setValues({
			...form.values,
			routes: applicant.routes,
			REQUIRE_W2_EMPLOYMENT: !!apx_w2?.type
				? apx_w2
				: new ApplicantExtrasEntity(ApplicantExtras.REQUIRE_W2_EMPLOYMENT),
			OTHER_ABSOLUTELY_REQUIREMENTS: !!apx_other?.type
				? apx_other
				: new ApplicantExtrasEntity(
					ApplicantExtras.OTHER_ABSOLUTELY_REQUIREMENTS
				),
			preferred_location: applicant.preferred_location
		});
	}, [applicant, applicantExtras]);

	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("PREFERENCES")}</h1>

			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row className={styles.align__text_left}>
					<p className={`${styles.paragraph} ${styles.bold} ${styles.align__text_left}`}>
						{t("PREFERRED_LOCATION")}
					</p>
				</Row>
				<Row className={`${styles.align__text_left}`}>
					<BaseCheckList
						cols={1}
						className="col-12 mb-2"
						name="preferred_location"
						formik={form}
						labelPrefix="JobGeography"
						enumType={JobGeography}
					/>
				</Row>
				<Row className={styles.align__text_left}>
					<p className={`${styles.paragraph} ${styles.bold} ${styles.align__text_left}`}>
						{t("ROUTES_YOU_OPEN_FOR")}
					</p>
				</Row>
				<Row className={`${styles.align__text_left}  other_req `}>
					<BaseCheckList
						className="mb-3"
						labelKey="ROUTES_OPEN_TO"
						name="routes"
						labelPrefix="JobSchedule"
						enumType={JobSchedule}
						formik={form}
					/>
				</Row>
				{
					!applicant.is_owner_operator &&
					<Row className={styles.align__text_left}>
						<BaseSelect
							className="col mb-3 font-weight-bold"
							label="DO_YOU_REQUIRE_W2_EMPLOYMET"
							name="REQUIRE_W2_EMPLOYMENT.value"
							placeholder="CHOOSE"
							labelPrefix="BooleanPreferenceType"
							enumType={BooleanPreferenceType}
							formik={form}
						/>
					</Row>
				}
				<Row className={styles.align__text_left}>
					<p className={`${styles.paragraph} ${styles.bold} ${styles.align__text_left}`}>
						{t("NECESSARY_REQUIREMENTS")}
					</p>
				</Row>
				<BaseCheckList
					className={`${styles.paragraph}  ${styles.align__text_left} other_req p-0`}
					labelPrefix="OtherRequirementType"
					name="OTHER_ABSOLUTELY_REQUIREMENTS.value"
					enumType={OtherRequirementType}
					formik={form}
				/>
				<Row className="mt-3">
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
