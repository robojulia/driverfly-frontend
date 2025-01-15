import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { VehicleType } from "../../../enums/vehicles/vehicle-type.enum";
import { useAuth } from "../../../hooks/use-auth";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantVehicleEntity } from "../../../models/applicant/applicant-vehicle-entity";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { VehicleEntity } from "../../../models/company/vehicle.entity";
import ApplicantApi from "../../../pages/api/applicant";
import VehicleApi from "../../../pages/api/vehicle";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import { LoaderIcon } from "../../loading/loader-icon";
import ViewCard from "../../view-details/view-card";
import ViewModal from "../../view-details/view-modal";
import BaseSelect from "../base-select";
import { BaseListRowControl } from "../lists/base-list-row-control";
import { BaseFormProps } from "./base-form-props";
import { VehicleForm } from "./vehicle-form";

export interface ApplicantVehicleAssiigedFormProps
	extends BaseFormProps<ApplicantEntity> {
	isSubmitting: boolean;
	setIsSubmitting(value: boolean): void;
}

export function ApplicantVehicleAssiigedForm(
	props: ApplicantVehicleAssiigedFormProps
) {
	let {
		className,
		entity,
		setEntity,
		onSaveComplete,
		isSubmitting,
		setIsSubmitting,
	} = props;
	let { user, hasPermission } = useAuth();
	const { t } = useTranslation();

	const applicantApi = new ApplicantApi();

	const [companyVehicles, setCompanyVehicles] = useState<VehicleEntity[]>([]);
	const [createVehicle, setCreateVehicle] = useState<boolean | number>(false);
	const [can, setCan] = useState({ createVehicle: false });

	const form = useFormik({
		initialValues: new ApplicantEntity(),
		validationSchema:
			ApplicantEntity.yupSchemaForApplicantVehicleAssiigedForm(),
		onSubmit: async (values, { setValues }) => {
			let { vehicles } = values;
			setIsSubmitting(true);
			try {
				for (let i = 0; i < entity?.vehicles?.length; i++) {
					let applicantVehicle = entity?.vehicles[i];

					if (!vehicles.some((v) => v.id == applicantVehicle.id)) {
						await applicantApi.vehicle.remove(entity.id, applicantVehicle.id);
						vehicles = vehicles.filter((v) => v.id != applicantVehicle.id);
					}
				}

				for (let i = 0; i < vehicles.length; i++) {
					let applicantVehicle = vehicles[i];

					if (applicantVehicle.id) {
						await applicantApi.vehicle.update(
							applicantVehicle.id,
							entity.id,
							applicantVehicle
						);
					} else {
						vehicles[i] = await applicantApi.vehicle.create(
							entity.id,
							applicantVehicle
						);
					}
				}
				setEntity({ ...entity, vehicles });

				formSuccess(t, entity?.id ? "update" : "create", "APPLICANT");
				if (onSaveComplete) onSaveComplete({ vehicles });
				setIsSubmitting(false);
			} catch (e) {
				setIsSubmitting(false);
				console.error("Unable to save applicant info", e);
				if (!globalAjaxExceptionHandler(e, { formik: form, t, toast }))
					formFailed(t, entity?.id ? "update" : "create", "APPLICANT");
			}
		},
	});

	const onVehicleAdded = (vehicle: VehicleEntity) => {
		setCompanyVehicles([...companyVehicles, vehicle]);
		setCreateVehicle(false);
	};

	useEffectAsync(async () => {
		if (!!entity?.id) {
			await form.setValues({
				...entity,
			});
		} else {
			await form.setValues({
				...new ApplicantEntity(),
				type: ApplicantType.COMPANY,
			});
		}
	}, [entity, setEntity]);

	useEffectAsync(async () => {
		const api = new VehicleApi();
		const vehicles = await api.list();

		setCompanyVehicles(vehicles);
		setCan({
			createVehicle: hasPermission("CanCreateVehicle"),
		});
	}, [user]);

	useEffect(() => focusOnErrorField(form), [form.submitCount]);

	// Ucommet in debbbug mode
	// useEffect(() => {
	// 	console.log("formm.values", form.values?.vehicles);
	// 	console.log("formm.errors", form.errors);
	// }, [form.values, form.errors])

	return (
		<Form onSubmit={form.handleSubmit} className={className}>
			<Row>
				<Col md="12" className="p-2 mt-2">
					<ViewCard
						title="VEHICLE_ASSIGNED"
						actions={
							<Button
								disabled={Boolean(entity?.is_hired)}
								size="sm"
								onClick={() =>
									form.setValues({
										...form.values,
										vehicles: [
											...(form.values?.vehicles || []),
											new ApplicantVehicleEntity(),
										],
									})
								}
							>
								<PlusCircle /> {t("ADD")}
							</Button>
						}
					>
						{form.values?.vehicles?.map((entity, i) => {
							return (
								<BaseListRowControl
									key={i}
									index={i}
									onRemoveClick={() =>
										form.setFieldValue(
											"vehicles",
											form.values.vehicles.filter((v, idx) => i != idx)
										)
									}
								>
									<BaseSelect
										className="mx-1"
										name={`vehicles.${i}.vehicle.id`}
										placeholder={t(
											"SELECT_{name}",
											{ name: "VEHICLE" },
											{ translateProps: true }
										)}
										options={companyVehicles}
										valueKey="id"
										createLabel={(veh) => {
											const {
												type,
												type_other,
												make,
												model,
												transmission_type,
												year,
											} = veh;
											let label =
												type == VehicleType.OTHER
													? type_other
													: t("VehicleType." + type);

											if (make) label += ` / ${make}`;

											if (model) label += ` / ${model}`;

											if (transmission_type)
												label += ` / ${t(transmission_type)}`;

											if (year) label += ` / ${year}`;
											return label; //`${()} / ${veh.make} / ${veh.model} / ${t(veh.transmission_type)} / ${veh.year}`
										}}
										formik={form}
										append={
											<>
												<Button
													variant="btn create_btn"
													disabled={!can.createVehicle}
													onClick={() => setCreateVehicle(i)}
												>
													<PlusCircle /> {t("CREATE")}
												</Button>
											</>
										}
									/>
								</BaseListRowControl>
							);
						})}
						{!form.values?.vehicles?.length && <>{t("NONE")}</>}
						<div style={{ display: "flex", justifyContent: "right" }}>
							<Button
								disabled={form.isSubmitting || isSubmitting}
								style={{ marginTop: "2%" }}
								type="submit"
								className="theme-secondary-btn"
							>
								{t("UPDATE")} <LoaderIcon isLoading={form.isSubmitting} />
							</Button>
						</div>
					</ViewCard>
				</Col>
			</Row>
			<ViewModal
				title={t(
					"CREATE_{name}",
					{ name: "VEHICLE" },
					{ translateProps: true }
				)}
				show={typeof createVehicle == "number"}
				onCloseClick={() => setCreateVehicle(false)}
			>
				<VehicleForm onSaveComplete={onVehicleAdded} />
			</ViewModal>
		</Form>
	);
}
