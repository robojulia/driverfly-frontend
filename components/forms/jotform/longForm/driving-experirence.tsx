import React, { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { States } from "../../../../enums/users/us-states.enum";
import { DrivingExperienceDto } from "../../../../models/jot-form/long-form/driving-experience.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface DrivingExperienceProps extends PageProps { }

export function DrivingExperience() {

	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	} = useContext(jotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new DrivingExperienceDto(),
		validationSchema: DrivingExperienceDto.yupSchema(),
		onSubmit: (values) => {
			try {
				const { license_number, state, license_expiry, license_state } = values;

				setApplicant({
					...applicant,
					license_number,
					state,
					license_expiry,
					license_state,
				});
			} catch (error) {
				console.log(error);
			}
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const { license_number, state, license_expiry, license_state } = applicant;

		form.setValues({
			license_number: license_number || null,
			state: state || null,
			license_expiry: license_expiry || null,
			license_state: license_state || null,
		});
	}, []);

	return (
		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
			<h4 className={styles.carrierName__smaller}>Driving Experience</h4>
			<Row>
				<Col>
					<BaseInput
						className="col-12 mt-3"
						required
						name="license_number"
						placeholder="CDL_LICENSE_PLACEHOLDER"
						label="CDL_NUMBER"
						formik={form}
					/>
				</Col>
				<Col>
					<BaseSelect
						className="col-12 mt-3"
						required
						enumType={States}
						name="state"
						placeholder="state"
						label="CURRENT_STATE"
						formik={form}
					/>
				</Col>
				<Col>
					<BaseInput
						className="col-12 mt-3"
						required
						type="date"
						name="license_expiry"
						placeholder="expiration_date"
						label="expiration_date"
						formik={form}
					/>
				</Col>
			</Row>

			<Row>
				<Col>
					<BaseSelect
						className="col-4 mt-3"
						required
						label="state_issued"
						name="license_state"
						placeholder="ISSUANCE_STATE"
						enumType={States}
						formik={form}
					/>
				</Col>
			</Row>
			<Row>
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
	);
}
