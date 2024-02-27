import { useFormik } from "formik";
import { useContext, useEffect, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VoeFormContext, {
	VoeFormContextType,
} from "../../../../context/voeform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantVoeEntity } from "../../../../models/applicant/applicant-voe.entity";
import ApplicantApi from "../../../../pages/api/applicant";
import styles from "../../../../styles/voe.module.css";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { LoaderIcon } from "../../../loading/loader-icon";
import OverlyPopover from "../../../popover/overly-popover";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";

export function SubmissionDetails() {
	const {
		state: { voe, applicant, employer },
		method: { updateVoe, stepBack, stepNext, jumpToStep },
	}: VoeFormContextType = useContext(VoeFormContext);

	const { t } = useTranslation();
	let padRef = useRef<SignatureCanvas>(null);
	const clearSignatureCanvas = () => padRef?.current?.clear();

	const form = useFormik({
		initialValues: new ApplicantVoeEntity(),
		validationSchema: ApplicantVoeEntity.yupSchemaSubmissionDetails(),
		onSubmit: async ({
			signature,
			focal_person_name,
			focal_person_title,
			focal_person_phone,
			focal_person_email,
			signed_date,
			allow_share
		}) => {
			const applicantApi = new ApplicantApi();
			// updateVoe({
			// 	signature,
			// 	focal_person_name,
			// 	focal_person_title,
			// 	focal_person_phone,
			// 	focal_person_email,
			// 	signed_date,
			// });
			try {
				await applicantApi.voeform.submitVoe({
					applicant_uuid_token: applicant?.uuid_token,
					employer_uuid_token: employer?.uuid_token,
					voeData: {
						...voe,
						signature,
						focal_person_name,
						focal_person_title,
						focal_person_phone,
						focal_person_email,
						signed_date,
						allow_share
					},
				});

				stepNext();
			} catch (error) {
				console.log(error);
				globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
			}
		},
		onReset: (values) => {
			if (!!Boolean(voe.was_employed)) {
				stepBack();
			} else {
				jumpToStep(1);
			}
		},
	});

	const signatureEnd = () => {
		const signatureValue = padRef.current.toDataURL().toString();
		form.setFieldValue("signature", signatureValue);
	};

	useEffect(() => {
		const {
			id,
			signature,
			focal_person_name,
			focal_person_title,
			focal_person_phone,
			focal_person_email,
			signed_date,
			allow_share = true
		} = voe;
		form.setValues({
			...form.values,
			signature,
			focal_person_name: Boolean(id) ? focal_person_name : employer.manager_name,
			focal_person_title: Boolean(id) ? focal_person_title : employer.title,
			focal_person_phone: Boolean(id) ? focal_person_phone : employer.phone,
			focal_person_email: Boolean(id) ? focal_person_email : employer.email,
			signed_date,
			allow_share
		});
		padRef?.current?.fromDataURL(signature)
	}, [voe, employer]);

	// useEffect(() => {
	// 	console.log("form values", form.values);
	// 	console.log("form eror", form.errors);
	// }, [form.values, form.errors]);
 

	return (
		<>
			<h1 className={styles.carrierName}>{t("SUBMISSION_DETAILS")}</h1>

			<ToastContainer />
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseInput
						className="my-3 float-left col-md-6"
						label="FULL_NAME"
						name="focal_person_name"
						formik={form}
					/>
					<BaseInput
						className="my-3 float-left col-md-6"
						label="TITLE"
						name="focal_person_title"
						formik={form}
					/>
				</Row>

				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseInput
						className="my-3 float-left col"
						label="company"
						// name={`employer[${employer.name}]`}
						value={employer.name}
						type="text"
						readOnly
					// formik={form}
					/>
				</Row>
				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseInputPhone
						className="my-3 float-left col-md-6"
						label="PHONE"
						required
						name="focal_person_phone"
						formik={form}
					/>
					<BaseInput
						className="my-3 float-left col-md-6"
						label="EMAIL"
						name="focal_person_email"
						formik={form}
					/>
				</Row>

				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseInput
						className="my-3 float-left col"
						label="DATE"
						name="signed_date"
						type="date"
						required
						formik={form}
					/>
				</Row>

				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<OverlyPopover
						str="TOOLTIP_ALLOW_VOE_SHARE"
						placement="top"
					>
						<BaseCheck
							className="my-3 float-left col"
							label={t("ALLOW_VOE_SHARE_FOR_{APPLICANT_NAME}", { APPLICANT_NAME: `${applicant.first_name} ${applicant.last_name}` })}
							name="allow_share"
							formik={form}
						/>
					</OverlyPopover>
				</Row>
				<Row className={`${styles.align__text_left}`}>
					<Col md="10">
						<h6 className={`${styles.bold} text-black ${styles.bold}`}>
							{t("SIGNATURE")}
							<label style={{color:'red'}}>*</label>
						</h6>
						<SignatureCanvas
							name="signature"
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
					<Col
						md="2"
						className="d-flex align-self-center justify-content-center"
					>
						<button
							type="button"
							className="theme-secondary-btn"
							onClick={clearSignatureCanvas}
						>
							{t("CLEAR")}
						</button>
					</Col>
				</Row>

				<Row className="my-3">
					<Col>
						<Button className="float-right" type="reset">
							{t("BACK")}
						</Button>
					</Col>
					<Col>
						<Button
							disabled={form.isValidating || form.isSubmitting || !form.isValid}
							className="float-left"
							type="submit"
						>
							{t("SUBMIT")}
							<LoaderIcon isLoading={!!form?.isSubmitting} />
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}
