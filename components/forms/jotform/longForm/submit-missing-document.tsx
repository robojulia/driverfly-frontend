import { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Button, Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import JotformContext, {
	JotFormContextType,
} from "../../../../context/jotform-context";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { DocumentEntity } from "../../../../models/documents/document.entity";
import { ApplicantDocumentType } from "../../../../enums/applicants/applicant-document-type.enum";
import { DocumentsDto } from "../../../../models/jot-form/long-form/documents.dto";
import ApplicantApi from "../../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoaderIcon } from "../../../loading/loader-icon";


export function SubmitMissingDocuments() {
	const {
		state: { applicant },
		method: { stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const isDriverLicense = (v: DocumentEntity): boolean =>
		v.type == ApplicantDocumentType.DRIVER_LICENSE;
	const isNotDriverLicense = (v: DocumentEntity): boolean =>
		v.type != ApplicantDocumentType.DRIVER_LICENSE;

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new DocumentsDto(),
		validationSchema: DocumentsDto.yupSchema(),
		onSubmit: async (values, { resetForm }) => {
			try {
				const applicantApi = new ApplicantApi();
				await applicantApi.jotform.updateDocuments(
					applicant.id,
					[...applicant.documents] as DocumentEntity[]
				)

				stepNext()
			} catch (error) {
				console.log(error);
				globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
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

	return (
		<>
			<ToastContainer />
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<div className="d-flex justify-content-center">
					<h3 className={`text-black  ${styles.bold}`} >{t("SUBMIT_THIS_FORM")}</h3>
				</div>
				<Row className="mt-3">
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
							{t("SUBMIT")} <LoaderIcon isLoading={!!form?.isSubmitting} />
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}
