import React, { useContext, useState } from "react";
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
import { CompanyPreferenceEntity } from "../../../../models/company/company-preferences.entity";


export function ContinueLongForm() {
	const {
		state: { applicant },
		method: { stepNext },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const [companyCdlPreferences, setCompanyCdlPreferences] = useState<string[]>([])
	const form = useFormik({
		initialValues: {},
		onSubmit: () => {
			console.log(`applicant company ${applicant?.company?.name}`, applicant?.company?.id)
			stepNext();
		}
	});

	useEffectAsync(async () => {
		if (applicant?.company) {
			const companyApi = new CompanyApi();
			const cdl_class: CompanyPreferenceEntity = await companyApi.preferences
				.list(applicant?.company?.id,
					{ category: CompanyPreferenceCategory.JOTFORM }
				)
				.then((preferences: CompanyPreferenceEntity[]) =>
					preferences?.find((v) =>
						v?.label === CompanyPreferenceJotformLabel.CDL_CLASS
					)
				);

			setCompanyCdlPreferences(cdl_class?.value?.map(v => t(`DriverLicenseType.${v}`)) ?? [])
			toast.success(t("successfully_saved_information"));
		}
	}, [applicant?.company])

	return (
		<>
			<ToastContainer />
			<form onSubmit={form.handleSubmit}>
				<Row>
					<h4 className={styles.heading__sty}>
						{t(
							"{company_name}_THANKS",
							{ company_name: applicant?.company?.name },
							{ translateProps: true }
						)}
					</h4>
				</Row>
				<Row className="mt-3">
					{(
						Boolean(companyCdlPreferences.length > 0)
						&& !Boolean(companyCdlPreferences.includes(t(`DriverLicenseType.${applicant?.license_type}`)))
					) && (
							<h6 className={`${styles.paragraph} ${styles.margin__top} bg-danger text-light  p-1`}>
								{t(
									"{company_name}_REQUIRES_{cdl_category}",
									{
										company_name: applicant?.company?.name,
										cdl_category: companyCdlPreferences.join(", ")
									},
									{ translateProps: true }
								)}
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
