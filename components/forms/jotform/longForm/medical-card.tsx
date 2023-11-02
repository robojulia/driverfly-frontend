import { useContext, useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { Button, Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import FileInput from "../../file-input";
import { DocumentsDto } from "../../../../models/jot-form/long-form/documents.dto";
import { ApplicantDocumentType } from "../../../../enums/applicants/applicant-document-type.enum";
import { DocumentEntity } from "../../../../models/documents/document.entity";
import { CameraComponent } from './camera'
import BaseCheck from "../../base-check";
export function MedicalCard() {
	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const isMedicalCard = (v: DocumentEntity): boolean => v.type == ApplicantDocumentType.MEDICAL_CARD;
	const isNotMedicalCard = (v: DocumentEntity): boolean => v.type != ApplicantDocumentType.MEDICAL_CARD;

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new DocumentsDto(),
		validationSchema: DocumentsDto.yupSchema(),
		onSubmit: (values, { resetForm }) => {
			const { document } = values;

			if (!!document.file_base64) {
				const documents: DocumentEntity[] = applicant.documents?.filter(isNotMedicalCard)
				setApplicant({
					...applicant,
					documents: [...documents, { ...document }],
				});
			}

			resetForm();
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		}
	});

	useEffect(() => {
		const doc: DocumentEntity = applicant?.documents?.find(isMedicalCard);

		form.setValues({
			document: doc ?? {
				...(new DocumentEntity()),
				type: ApplicantDocumentType.MEDICAL_CARD,
			},
			mediaOptions: false
		});
	}, [applicant]);


	return (
		<>
		<h4 className={`${styles.align__text_center} text-black  ${styles.bold}`}>{t("MEDICAL_CARD_UPLOAD_TITLE")}</h4>

		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
			
			<BaseCheck
				className="my-3 col float-left p-0"
				label="MEDIA_PREFERENCE"
				name="mediaOptions"
				formik={form}
			/>

			<Row className={`${styles.align__text_left} ${styles.bold}`}>
				{
					Boolean(form.values.mediaOptions) ? (
						<CameraComponent form={form} />
					) : (
						<FileInput
							hideView={Boolean(form.values?.document?.id)}
							className="my-3"
							name="document"
							accept="application/pdf"
							allowedSizeInByte={3145728}
							formik={form} />
					)
				}

			</Row>
			<Row className="mt-4">
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
	)
}
