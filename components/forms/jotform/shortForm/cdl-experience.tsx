import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { Form, Button, Col, Row, Table } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import BaseCheck from "../../base-check";
import { DriverLicenseType } from "../../../../enums/users/driver-license-type.enum";
import { PageProps } from "../../../../types/jotform/page-props.type";
import { CdlDto } from "../../../../models/jot-form/short-form/cdl-experience.dto";
import jotformContext from "../../../../context/jotform-context";
import { useContext, useEffect } from "react";

export interface CdlExperienceProps extends PageProps { }

export function CdlExperience() {

	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	} = useContext(jotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new CdlDto(),
		validationSchema: CdlDto.yupSchema(),
		onSubmit: (values) => {
			const { license_type, years_cdl_experience, is_owner_operator } = values;
			setApplicant({
				...applicant,
				license_type,
				years_cdl_experience,
				is_owner_operator,
			});
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});
	useEffect(() => {
		const { license_type, years_cdl_experience, is_owner_operator } = applicant;
		form.setValues({
			license_type: license_type || null,
			years_cdl_experience: years_cdl_experience || null,
			is_owner_operator: is_owner_operator || null,
		});
	}, []);

	function onLicenseTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const licenseType = e.target.value;
		switch (licenseType) {
			case DriverLicenseType.CDL_CLASS_C:
				form.setValues({
					...form.values,
					license_type: licenseType,
					is_owner_operator: false,
				});
				break;
			case null:
				form.setValues({
					...form.values,
					license_type: licenseType,
					is_owner_operator: false,
					years_cdl_experience: null,
				});
				break;
			default:
				form.setValues({
					...form.values,
					license_type: licenseType,
				});
				break;
		}
	}

	return (
		<>
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row className="mb-4">
					<BaseSelect
						className="col-6"
						label="CDL_CLASS"
						placeholder="DriverLicenseType.NONE"
						name="license_type"
						required
						labelPrefix="DriverLicenseType"
						enumType={DriverLicenseType}
						formik={form}
						onChange={onLicenseTypeChange}
					/>
				</Row>
				{!!form.values.license_type && (
					<>
						<Row className="mt-3 mb-3">
							<BaseInput
								className="col-6"
								required
								type="number"
								step={0.1}
								min={0.1}
								name="years_cdl_experience"
								label="years_cdl_experience"
								placeholder="PLACEHOLDER_FOR_DIGITS"
								formik={form}
							/>
						</Row>
						<Row>
							<BaseCheck
								className="mt-3 mb-3"
								required
								name="is_owner_operator"
								label="is_owner_operator_question"
								formik={form}
							/>
						</Row>
					</>
				)}

				<Row className="mt-3">
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
	);
}
