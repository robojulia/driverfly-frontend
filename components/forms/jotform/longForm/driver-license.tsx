import { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { Button, Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import JotformContext, {
	JotFormContextType,
} from "../../../../context/jotform-context";
import FileInput from "../../file-input";
import { DocumentEntity } from "../../../../models/documents/document.entity";
import { ApplicantDocumentType } from "../../../../enums/applicants/applicant-document-type.enum";
import { DocumentsDto } from "../../../../models/jot-form/long-form/documents.dto";
import BaseCheck from "../../base-check";
import { CameraComponent } from "./camera";

export function DriverLicense() {
	const {
		state: { applicant, steps },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const isDriverLicense = (v: DocumentEntity): boolean =>
		v?.type == ApplicantDocumentType.DRIVERS_LICENSE;

	const isNotDriverLicense = (v: DocumentEntity): boolean =>
		v?.type != ApplicantDocumentType.DRIVERS_LICENSE;

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new DocumentsDto(),
		validationSchema: DocumentsDto.yupSchema(),
		onSubmit: (values, { resetForm }) => {
			const { document } = values;

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
				type: ApplicantDocumentType.DRIVERS_LICENSE,
			},
			mediaOptions: false
		});
	}, [applicant]);

	useEffect(() => {
		console.log("form errors", form.errors);
		console.log("form valuez", form.values);
		console.log("form applicant", applicant);
	}, [form.errors, form.values]);

	return (
		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
			<Row>
				<h3>{t("DRIVER_LICENSE_PHOTO")}</h3>
			</Row>
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
							className="my-3"
							name="document"
							accept="application/pdf"
							allowedSizeInByte={3000000}
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
	);
}
