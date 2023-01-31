import React, { useContext, useEffect, useState } from "react";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import { Button, Col, Row } from "react-bootstrap";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { toast, ToastContainer } from "react-toastify";
import CompanyApi from "../../../../pages/api/company";
import { CompanyPreferenceCategory } from "../../../../enums/company/company-preference-category.enum";
import { useEffectAsync } from "../../../../utils/react";
import { CompanyPreferenceJotformLabel } from "../../../../enums/company/company-preferences-jotform-label.enum";


export function ContinueLongForm() {
	const {
		state: { applicant },
		method: { stepNext },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const [cdlCategory, setCdlCategory] = useState<[]>([])
	const form = useFormik({
		initialValues: {},
		onSubmit: () => {
			console.log(`applicant company ${applicant?.company?.name}`, applicant?.company?.id)
			stepNext();
		}
	});
	useEffectAsync(async () => {
		if (applicant?.company) {
			const api = new CompanyApi();
			const preferences = await api.preferences.list(applicant?.company?.id, {
				category: CompanyPreferenceCategory.JOTFORM,
			}).then((pref) => {
				const category = pref?.find(v => v?.label === CompanyPreferenceJotformLabel.CDL_CLASS)
				setCdlCategory(category?.value)
			})

			toast.success(t("successfully_saved_information"));
		}
	}, [])


	const categoryTypes = cdlCategory.join(', ')
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
					{cdlCategory.length > 0 && !cdlCategory.includes(applicant?.license_type) && (
						<h6 className={`${styles.paragraph} ${styles.margin__top} bg-danger text-light  p-1`}>
							{t("{company_name}_THANKS_NOTE_{cdl_category}", { company_name: applicant?.company?.name, cdl_category: categoryTypes }, { translateProps: true })}
						</h6>
					)}
				</Row>
				<Row className="mt-3">
					<Col className="text-center" >
						<Button type="submit">
							{t("CONTINUE_APPLICATION")}
						</Button>
					</Col>
				</Row>
			</form>
		</>
	);
}
