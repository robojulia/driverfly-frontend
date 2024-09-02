import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import VoeFormContext, {
	VoeFormContextType,
} from "../../../../context/voeform-context";
import { BooleanType } from "../../../../enums/jotform/boolean-type.enum";
import { ReasonsForLeavingEmployment } from "../../../../enums/users/reasons-for-leaving-employment";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantVoeEntity } from "../../../../models/applicant/applicant-voe.entity";
import BaseInput from "../../base-input";
import BaseRadio from "../../base-radio";
import BaseSelect from "../../base-select";
import BaseTextArea from "../../base-text-area";
import styles from "../../../../styles/voe.module.css";

export function AccidentHistory() {
	const {
		state: { voe, applicant, employer },
		method: { stepNext, stepBack, updateVoe },
	}: VoeFormContextType = useContext(VoeFormContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new ApplicantVoeEntity(),
		validationSchema: ApplicantVoeEntity.yupSchemaAccidentHistory(),
		onSubmit: ({
			position,
			start_date,
			end_date,
			did_drive_check,
			drived_vehicle,
			safety_performance,
			registered_accidents_details,
			accidents_reported_to_government,
			reason_to_leave,
		}) => {
			updateVoe({
				position,
				start_date,
				end_date,
				did_drive_check,
				drived_vehicle,
				safety_performance,
				registered_accidents_details,
				accidents_reported_to_government,
				reason_to_leave,
			});
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});
	useEffect(() => {
		const {
			position,
			start_date,
			end_date,
			drived_vehicle,
			did_drive_check = Boolean(drived_vehicle)
				? BooleanType.YES
				: BooleanType.NO,
			safety_performance,
			registered_accidents_details,
			accidents_reported_to_government,
			reason_to_leave,
		} = voe;
		form.setValues({
			...form.values,
			position,
			start_date,
			end_date,
			did_drive_check,
			drived_vehicle,
			safety_performance,
			registered_accidents_details,
			accidents_reported_to_government,
			reason_to_leave,
		});
	}, [voe]);

	useEffect(() => {
		console.log("form values ===", form.values);
		console.log("form eror", form.errors);
	}, [form.values, form.errors]);

	return (
		<>
			<h1 className={styles.carrierName}>{t("EMPLOYMENT_VERIF")}</h1>

			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row>
					<div className={`${styles.align__text_left} ${styles.bold}`}>
						<BaseInput
							className="col my-3 p-0"
							name="position"
							label={t(
								"{applicantName}_WAS_EMPLOYED_AS",
								{
									applicantName: `${applicant?.first_name} ${applicant?.last_name}`,
								},
								{ translateProps: true }
							)}
							placeholder="POSITION"
							formik={form}
						/>
					</div>
					<div className={`${styles.align__text_left} ${styles.bold}`}>
						<BaseInput
							className="col my-3 p-0"
							name="start_date"
							label="START_DATE"
							type="date"
							formik={form}
							placeholder="MM/YY"
							max={new Date().toISOString().split("T")[0]}
						/>
					</div>
					<div className={`${styles.align__text_left} ${styles.bold}`}>
						<BaseInput
							className="col my-3 p-0"
							name="end_date"
							type="date"
							label="END_DATE"
							formik={form}
							placeholder="MM/YY"
							max={new Date().toISOString().split("T")[0]}
						/>
					</div>
				</Row>

				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseRadio
						className="float-left my-2 col"
						label="VOE_DRIVER_QUESTION"
						name="did_drive_check"
						formik={form}
						labelPrefix="BooleanType"
						enumType={BooleanType}
						onChange={({ target: { value } }) => {
							form.setFieldValue("did_drive_check", value);
							if (value != BooleanType.YES)
								form.setFieldValue("drived_vehicle", null);
						}}
						required
					/>
				</Row>

				{form.values?.did_drive_check == BooleanType.YES && (
					<Row
						className={`${styles.align__text_left} ${styles.bold} ${styles.paragraph}`}
					>
						<BaseTextArea
							className="float-left my-2 col"
							name="drived_vehicle"
							label="TYPE_OF_VEHICLE"
							formik={form}
						/>
					</Row>
				)}

				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseRadio
						className="float-left my-2 col"
						label="SAFETY_PERFORMANCE_REPORT"
						name="safety_performance"
						formik={form}
						labelPrefix="BooleanType"
						// enumType={BooleanType}
						onChange={(e) => {
							form.setFieldValue(
								"safety_performance",
								{ true: true, false: false }[e.target.value] || false
							);
							form.setFieldValue("registered_accidents_details", false);
						}}
						options={[
							{
								label: BooleanType.YES,
								value: true,
							},
							{
								label: BooleanType.NO,
								value: false,
							},
						]}
						required
					/>
				</Row>

				{form.values?.safety_performance == true && (
					<Row className={`${styles.align__text_left} ${styles.bold}`}>
						<BaseRadio
							className="float-left my-2 col"
							label="ACCIDENT_REGISTER_DATA"
							name="registered_accidents_details"
							formik={form}
							labelPrefix="BooleanType"
							// enumType={BooleanType}
							onChange={(e) => {
								form.setFieldValue(
									"registered_accidents_details",
									{ true: true, false: false }[e.target.value] || false
								);
								e.target.value == "false" &&
									form.setFieldValue("accidents_reported_to_government", null);
							}}
							options={[
								{
									label: BooleanType.YES,
									value: true,
								},
								{
									label: BooleanType.NO,
									value: false,
								},
							]}
						/>
					</Row>
				)}

				{form.values?.registered_accidents_details == true && (
					<Row
						className={`${styles.align__text_left} ${styles.bold} ${styles.paragraph}`}
					>
						<BaseTextArea
							required
							className="float-left col my-3"
							name="accidents_reported_to_government"
							label="OTHER_GOV_REPORTED_ACCIDENTS"
							formik={form}
						/>
					</Row>
				)}

				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseSelect
						className="col my-3"
						required
						labelPrefix="ReasonsForLeavingEmployment"
						enumType={ReasonsForLeavingEmployment}
						name="reason_to_leave"
						placeholder="CHOOSE"
						label="REASONS_FOR_LEAVING_EMPLOYMENT"
						formik={form}
					/>
				</Row>

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
