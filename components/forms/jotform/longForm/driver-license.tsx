import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import JotformContext, {
	JotFormContextType,
} from "../../../../context/jotform-context";
import { ApplicantDocumentType } from "../../../../enums/applicants/applicant-document-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { DocumentEntity } from "../../../../models/documents/document.entity";
import { DocumentsDto } from "../../../../models/jot-form/long-form/documents.dto";
import BaseCheck from "../../base-check";
import FileInput from "../../file-input";
import { CameraComponent } from "./camera";
import styles from "../../../../styles/digitalhiringapp.module.css";

export function DriverLicense() {
	const {
		state: { applicant, steps },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const isDriverLicense = (v: DocumentEntity): boolean =>
		v?.type == ApplicantDocumentType.DRIVER_LICENSE;

	const isNotDriverLicense = (v: DocumentEntity): boolean =>
		v?.type != ApplicantDocumentType.DRIVER_LICENSE;

	const { t } = useTranslation();
	const router = useRouter();
	const isMissingDocRouteActive = router.route.includes('longform/[applicant_uuid]/missing-document');
	const isLongFormRouteActive = router.route.includes('apply/longform/[applicant_uuid]');
	const quickApplyRouteActive = router.route.includes('apply/quick-apply')
	const dhaRouteActive = router.route.includes('apply/[slug]')


	const form = useFormik({
		initialValues: new DocumentsDto(),
		validationSchema: DocumentsDto.yupSchema(),
		onSubmit: (values, { resetForm }) => {
			const { document } = values;

			if ((isMissingDocRouteActive || isLongFormRouteActive)) {
				if (!!document?.file_base64) {
					const documents: DocumentEntity[] =
						applicant?.documents?.filter(isNotDriverLicense) || [];
					setApplicant({
						...applicant,
						documents: [...documents, { ...document }],
					});
				}
				// resetForm();
				stepNext();
			}
			else if (dhaRouteActive || quickApplyRouteActive) {
				if (!!document?.file_base64) {
					const documents: DocumentEntity[] =
						applicant?.documents?.filter(isNotDriverLicense) || [];
					setApplicant({
						...applicant,
						documents: [...documents, { ...document }],
					});
				}
				// resetForm();
				stepNext();
			}
			else {
				toast.error(t("MUST_ADD_FILE"))
			}
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const doc: DocumentEntity = applicant?.documents?.find(isDriverLicense);

		form.setValues({
			document: doc ?? {
				...new DocumentEntity(),
				type: ApplicantDocumentType.DRIVER_LICENSE,
			},
			mediaOptions: false
		});
	}, [applicant]);

	useEffect(() => {
		if (Object.keys(form.errors)?.length) {
			console.log("form values", form.values);
			console.log("form errors", form.errors);
			console.log("form applicant", applicant);
		}
	}, [form.errors, form.values]);

	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("DRIVER_LICENSE_PHOTO")}</h1>
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>

				<BaseCheck
					className="my-3 col float-left p-0"
					label="MEDIA_PREFERENCE"
					name="mediaOptions"
					formik={form}
				/>

				<Row className={styles.align__text_left}>
					{
						Boolean(form.values.mediaOptions) ? (
							<CameraComponent form={form} />
						) : (
							<FileInput
								hideView={Boolean(form.values?.document?.id)}
								className="my-3"
								name="document"
								accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
								allowedSizeInByte={3145728}
								formik={form}
							/>
						)
					}

				</Row>

				<Row className="mt-3">
					{
						!!steps &&
						<Col>
							<Button className="float-right" type="reset">
								{t("BACK")}
							</Button>
						</Col>
					}

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
