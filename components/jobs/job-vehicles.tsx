import { Col, Row } from "react-bootstrap";
import { VehicleAccessory } from "../../enums/vehicles/vehicle-accessory.enum";
import { VehicleTrailerType } from "../../enums/vehicles/vehicle-trailer-type.enum";
import { VehicleType } from "../../enums/vehicles/vehicle-type.enum";
import { useTranslation } from "../../hooks/use-translation";
import ViewCard from "../view-details/view-card";
import VehiclePhoto from "./vehicle-photo";
import { useAuth } from '../../hooks/use-auth'
import { VehicleEntity } from "../../models/company/vehicle.entity";
import Link from "next/link";
import { JobDetailProps } from "../../types/job/job-detail-props.type";

export default function JobVehicles({ job }: JobDetailProps) {
    const { t } = useTranslation();

    const { user } = useAuth();

    if (!!!job.vehicles || !!!job.vehicles?.length) return <></>

    const vehicles: VehicleEntity[] = job.vehicles.filter((vehicle, i) => (user || (!user && vehicle.is_public)))

    if (!!!vehicles || !!!vehicles.length)
        return <>
            <div className="shadow-lg single-job-items p-4 m-1 mb-5">
                <p className="m-0 blockquote">
                    {t("VEHICLE_INFORMATION_HIDDEN_BY_COMPANY")}
                    <Link href="/login">
                        <a className="mx-1 primary" >{t("LOGIN")}</a>
                    </Link>
                    {t("SEE_VEHICLE_INFORMATION")}
                </p>
            </div>
        </>


    return <>

        <div className="job-deatails-inner mt-2">

            <ViewCard
                title="vehicle_info"
            >
                {vehicles.map((vehicle, i) => (
                    <Row key={i} className="mb-3 shadow-sm">
                        <Col lg="2">
                            <VehiclePhoto vehicle={vehicle} className="img-thumbnail" style={{ maxWidth: "100px" }} />
                        </Col>
                        <Col lg="10">
                            <div className="ml-3">
                                <span className="text-secondary">{t("TYPE")}: </span>
                                {vehicle.type == VehicleType.OTHER ? vehicle.type_other : t(vehicle.type.toLowerCase())}
                            </div>
                            <div className="ml-3">
                                <span className="text-secondary">{t("TRAILER")}: </span>
                                {vehicle.trailer_type == VehicleTrailerType.OTHER ? vehicle.trailer_type_other : (vehicle.trailer_type && t(`VehicleTrailerType.${vehicle.trailer_type}`) || "")}
                            </div>
                            <div className="ml-3">
                                <span className="text-secondary">{t("TRANSMISSION")}: </span>
                                {vehicle.transmission_type ? t(`VehicleTransmissionType.` + vehicle.transmission_type) : null}
                            </div>
                            <div className="ml-3">
                                <span className="text-secondary">{t("MAKE")}: </span>
                                {vehicle.make}
                            </div>
                            <div className="ml-3">
                                <span className="text-secondary">{t("MODEL")}: </span>
                                {vehicle.model}
                            </div>
                            <div className="ml-3">
                                <span className="text-secondary">{t("YEAR")}: </span>
                                {vehicle.year}
                            </div>
                            <div className="ml-3">
                                <span className="text-secondary">{t("ACCESSORIES")}: </span>
                                {vehicle.accessories?.map((accessory) => (
                                    accessory == VehicleAccessory.OTHER && vehicle.accessory_other ? vehicle.accessory_other : t(`VehicleAccessory.${accessory}`)
                                ))?.join(", ")}
                            </div>
                        </Col>
                    </Row>
                ))}
            </ViewCard>

        </div>

    </>
}