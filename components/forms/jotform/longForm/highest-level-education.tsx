import { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { EducationLevel } from "../../../../enums/users/education-level.enum";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { HighestLevelEducationDto } from "../../../../models/jot-form/long-form/highest-level-education.dto";

export function HighestLevelEducation() {

	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new HighestLevelEducationDto(),
		validationSchema: HighestLevelEducationDto.yupSchema(),
		onSubmit: (values) => {
			const { highest_degree } = values;
			try {
				setApplicant({
					...applicant,
					highest_degree,
				});
				stepNext();
			} catch (error) {
				console.log(error);
			}
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const { highest_degree } = applicant;
		form.setValues({
			...form.values,
			highest_degree: highest_degree || null,
		});
	}, [applicant]);

	return (
		<>
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row>
					<h6 className={styles.heading__sty}>
						{t("TELL_ABOUT_YOUR_EDUCATION")}
					</h6>
				</Row>
				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseSelect
						className="col my-3"
						required
						enumType={EducationLevel}
						name="highest_degree"
						placeholder="CHOOSE"
						label="EDUCATION_HIGHEST_LEVEL"
						labelPrefix="EducationLevel"
						formik={form}
					/>
				</Row>

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
