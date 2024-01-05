import { useContext, useEffect } from "react";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import { BackgroundInfoDto } from "../../../../models/jot-form/long-form/background-info.dto";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import StateSelect from "../../state-select";

export function BackgroundInfo() {

	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new BackgroundInfoDto(),
		validationSchema: BackgroundInfoDto.yupSchema(),
		onSubmit: (values) => {
			try {
				const { birthdate, LINE_ADDRESS, city, state, zip_code } = values;

				setApplicant({ ...applicant, birthdate, city, state, zip_code });
				updateApplicantExtras(LINE_ADDRESS);
			} catch (error) {
				console.log(error);
			}
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const { birthdate, city, state, zip_code } = applicant;
		const apx = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.LINE_ADDRESS
		);
		form.setValues({
			...form.values,
			LINE_ADDRESS: !!apx?.type
				? apx
				: new ApplicantExtrasEntity(ApplicantExtras.LINE_ADDRESS),
			birthdate: birthdate || null,
			city: city || null,
			state: state || null,
			zip_code: zip_code || null,
		});
	}, [applicant]);

	const today = new Date()
	const OldThan18Year = new Date((today.getFullYear() - 18), today.getMonth(), today.getDate()).toISOString().split("T")[0]

	return (
		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("BACKGROUND_INFO")}</h1>
			<Row className={`${styles.align__text_left} ${styles.bold}`}>
				<BaseInput
					className="col mt-3 mb-3"
					required
					type="date"
					name="birthdate"
					placeholder="birthdate"
					label="birthdate"
					formik={form}
					max={OldThan18Year}
				/>
			</Row>
			<p
				className={`${styles.heading__sty}`}
			>
				{t("FULL_ADDRESS_QUES")}
			</p>

			<>
				<Row>
					<div className="col-md-12 ">
						<Row className={`${styles.align__text_left} ${styles.bold}`}>
							<BaseInput
								className="col-md-6 my-3"
								required
								name={`LINE_ADDRESS.value.address_1`}
								placeholder="ADDRESS_LINE_1"
								label="ADDRESS_LINE_1"
								formik={form}
							/>
							<BaseInput
								className="col-md-6 my-3"
								name={`LINE_ADDRESS.value.address_2`}
								placeholder="ADDRESS_LINE_2"
								label="ADDRESS_LINE_2"
								formik={form}
							/>
						</Row>
					</div>
				</Row>
			</>

			<Row className={`${styles.align__text_left} ${styles.bold}`}>
				<BaseInput
					className="col-md-6 my-3"
					required
					name="city"
					type="text"
					placeholder="city"
					label="city"
					formik={form}
				/>
				<StateSelect
					className="col-md-6 my-3"
					required
					name="state"
					label="state"
					placeholder="CHOOSE_STATE"
					formik={form}
				/>
			</Row>
			<Row className={`${styles.align__text_left} ${styles.bold}`}>
				<BaseInput
					className="col my-3"
					required
					name="zip_code"
					type="number"
					placeholder="zip_code"
					label="zip_code"
					formik={form}
				/>
			</Row>
			<Row className="my-3">
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
		</Form >
	);
}
