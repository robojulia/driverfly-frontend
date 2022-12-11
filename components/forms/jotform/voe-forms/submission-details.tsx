import { useFormik } from "formik";
import { useContext, useEffect, useRef } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseInput from "../../base-input";
import VoeFormContext, {VoeFormContextType} from "../../../../context/voeform-context";
import styles from "../../../../styles/voe.module.css";
import SignatureCanvas from "react-signature-canvas";
import { SubmissionDetailsDto } from "../../../../models/jot-form/voe-form/submission-details.dto";
import { ApplicantVoeFormEnum } from "../../../../enums/applicants/applicant-voe-form.enum";
import { ApplicantVoeFormEntity } from "../../../../models/applicant/applicant-voe-form.entity";
import BaseInputPhone from "../../base-input-phone";
import ApplicantApi from "../../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function SubmissionDetails() {
	const {
		state: { applicantVoe, applicant },
		method: { updateApplicantVoe, stepBack, stepNext },
	}: VoeFormContextType = useContext(VoeFormContext);

	const { t } = useTranslation();
	let padRef = useRef<SignatureCanvas>(null);
	const clearSignatureCanvas = () => padRef?.current?.clear();

	const form = useFormik({
		initialValues: new SubmissionDetailsDto(),
		validationSchema: SubmissionDetailsDto.yupSchema(),
		onSubmit: async (values) => {
			const { SIGNATURE_VOE, SENDER_INFO } = values;
			updateApplicantVoe(SIGNATURE_VOE);
			updateApplicantVoe(SENDER_INFO);

			const applicantApi = new ApplicantApi();
			const filtered_voe = applicantVoe?.filter((v) => !!v.value);
			try {
				const response = await applicantApi.voeform.create({
					uuid_token: applicant.uuid_token,
					applicantVoeFormData: filtered_voe,
				});
				toast.success(t("successfully_saved_information"));
			} catch (error) {
				console.log(error);
				globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
			}
			// stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	const signatureEnd = () => {
		const signatureValue = padRef.current.toDataURL().toString();
		form.setFieldValue("SIGNATURE_VOE.value", signatureValue);
	};
	useEffect(() => {
		const apx_sign = applicantVoe?.find(
			(v) => v.type === ApplicantVoeFormEnum.SIGNATURE_VOE
		);
		const apx_sender_info = applicantVoe?.find(
			(v) => v.type === ApplicantVoeFormEnum.SENDER_INFO
		);

		form.setValues({
			...form.values,
			SIGNATURE_VOE: !!apx_sign?.type
				? padRef?.current?.fromDataURL(apx_sign?.value)
				: new ApplicantVoeFormEntity(ApplicantVoeFormEnum.SIGNATURE_VOE),

			SENDER_INFO: !!apx_sender_info?.type
				? apx_sender_info
				: new ApplicantVoeFormEntity(ApplicantVoeFormEnum.SENDER_INFO),
		});
	}, [applicantVoe]);

	useEffect(() => {
		console.log("form values", form.values);
		console.log("form eror", form.errors);
	}, [form.values, form.errors]);

	return (
		<>
			<ToastContainer />
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row className={`${styles.align__text_left}`}>
					<Col>
						<h6 className={styles.bold}>{t("SIGNATURE")}</h6>
						<SignatureCanvas
							name="SIGNATURE_VOE.value"
							ref={padRef}
							onEnd={signatureEnd}
							canvasProps={{
								width: 720,
								height: 200,
								style: { border: "1px solid black" },
								className: "sigCanvas",
							}}
						/>
					</Col>
				</Row>

				<Row>
					<Col>
						<button className="theme-secondary-btn" onClick={clearSignatureCanvas}>
							{t("CLEAR")}
						</button>
					</Col>
				</Row>

				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseInput
						className="my-3 float-left col-md-6"
						label="FULL_NAME"
						name="SENDER_INFO.value.name"
						formik={form}
					/>
					<BaseInput
						className="my-3 float-left col-md-6"
						label="TITLE"
						name="SENDER_INFO.value.title"
						formik={form}
					/>
				</Row>
				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseInputPhone
						className="my-3 float-left col-md-6"
						label="PHONE"
						name="SENDER_INFO.value.phone"
						formik={form}
					/>
					<BaseInput
						className="my-3 float-left col-md-6"
						label="EMAIL"
						name="SENDER_INFO.value.email"
						formik={form}
					/>
				</Row>

				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseInput
						className="my-3 float-left col"
						label="DATE"
						name="SENDER_INFO.value.date"
						type="date"
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
							{t("SUBMIT")}
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}
