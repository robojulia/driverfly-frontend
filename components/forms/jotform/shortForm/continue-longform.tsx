import React, { useContext } from "react";
import styles from "../../../../styles/jotform.module.css";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import { Button, Col, Row } from "react-bootstrap";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { toast, ToastContainer } from "react-toastify";
import ApplicantApi from "../../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";


export function ContinueLongForm() {
	const {
		state: { applicant, applicantExtras },
		method: { stepNext, setApplicant },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: {},
		onSubmit: async () => {
			const applicantApi = new ApplicantApi();

			try {
				const filtered_extras = applicantExtras?.filter((v) => !!v.value);
				const response = await applicantApi.jotform.create({
					applicant,
					applicantExtras: filtered_extras,
				});
				setApplicant({
					...applicant,
					id: response.id,
				});
				if (!!response) {
					toast.success(t("successfully_saved_information"));
				}
			} catch (error) {
				console.log(error);
				globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
			}

			stepNext();
		},
	});

	return (
		<>
			<ToastContainer />
			<form onSubmit={form.handleSubmit}>
				<Row>
					<h4 className={styles.heading__sty}>
						{t("{company_name}_THANKS", { company_name: applicant?.company?.name }, { translateProps: true })}
					</h4>
				</Row>
				<Row className="mt-3">
					<h6 className={`${styles.paragraph} ${styles.margin__top}`}>
						{t("{company_name}_THANKS_NOTE", { company_name: applicant?.company?.name }, { translateProps: true })}
					</h6>
				</Row>
				<Row className="mt-3">
					<Col>
						<Button className="float-middle" type="submit">
							{t("CONTINUE_APPLICATION")}
						</Button>
					</Col>
				</Row>
			</form>
		</>
	);
}
