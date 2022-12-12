import { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import JotformContext, {
	JotFormContextType,
} from "../../../../context/jotform-context";
import { DocumentEntity } from "../../../../models/documents/document.entity";
import { ApplicantDocumentType } from "../../../../enums/applicants/applicant-document-type.enum";
import { DocumentsDto } from "../../../../models/jot-form/long-form/documents.dto";
import ApplicantApi from "../../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export function SubmitMissingDocuments() {
	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const isDriverLicense = (v: DocumentEntity): boolean =>
		v.type == ApplicantDocumentType.DRIVERS_LICENSE;
	const isNotDriverLicense = (v: DocumentEntity): boolean =>
		v.type != ApplicantDocumentType.DRIVERS_LICENSE;

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new DocumentsDto(),
		validationSchema: DocumentsDto.yupSchema(),
		onSubmit: async (values, { resetForm }) => {
			const applicantApi = new ApplicantApi();

			console.log("applicant.id", applicant.id);

			try {
				const filtered_extras = applicantExtras?.filter((v) => !!v.value);
				const response = await applicantApi.jotform.update(applicant.id, {
					applicant
				})
				toast.success(t("successfully_saved_information"));
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
				type: ApplicantDocumentType.DRIVERS_LICENSE,
			},
		});
	}, [applicant]);

	return (
		<>
			<ToastContainer />
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row>
					<h3>{t("SUBMIT_THIS_FORM")}</h3>
				</Row>
				<Row className="mt-3">
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
