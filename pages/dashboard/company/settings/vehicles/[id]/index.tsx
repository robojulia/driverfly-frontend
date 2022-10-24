import { toast } from "react-toastify";

import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";

import FullLayout from "../../../../../../components/dashboard/layouts/layout/full-layout";
import ChildPageLayout from "../../../../../../components/layouts/page/child-page-layout";
import ViewDetails from "../../../../../../components/view-details/view-details";
import { DeleteButton } from "../../../../../../components/buttons/delete-button";

import { useRouter } from "next/router";
import { useState } from "react";
import { useEffectAsync } from "../../../../../../utils/react";
import { useTranslation } from "../../../../../../hooks/use-translation";
import { useAuth } from "../../../../../../hooks/use-auth";

import VehicleApi from "../../../../../api/vehicle";
import { VehicleEntity } from "../../../../../../models/company/vehicle.entity";
import { VehicleTrailerType } from "../../../../../../enums/vehicles/vehicle-trailer-type.enum";
import { VehicleType } from "../../../../../../enums/vehicles/vehicle-type.enum";
import { VehicleAccessory } from "../../../../../../enums/vehicles/vehicle-accessory.enum";

export default function ViewVehicle({ id }) {
    const router = useRouter();

    const { t } = useTranslation();

    const { user, hasPermission } = useAuth();

    const [ vehicle, setVehicle] = useState(new VehicleEntity());

    const backPath = "/dashboard/company/settings/vehicles";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    useEffectAsync(async () => {
        if (!user) return;

        if (id) {
            const api = new VehicleApi();

            const data = await api.findById(+id, { withPhoto: true });

            if (!data) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "VEHICLE" }, { translateProps: true }));
                goBack();
                return;
            }

            setVehicle(data);
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "VEHICLE" }, { translateProps: true }));
            goBack();
        }

    }, [ user, id ]);

    const onEditClick = async () => {
        await router.push(router.asPath + `/edit`);
    };

    const onDeleteClick = async () => {
        const api = new VehicleApi();

        await api.remove(user.id);
        await router.push(backPath);
    };

    const canEdit = hasPermission("CanUpdateVehicle");
    const canDelete = hasPermission("CanDeleteVehicle");

    return (
        <ChildPageLayout
            backPath={backPath}
            title={t("VIEW_{name}", { name: "VEHICLE" }, { translateProps: true })}
            actions={
                (<ButtonGroup>
                    {canDelete &&
                        <DeleteButton
                            onDelete={onDeleteClick}
                            />
                    }
                    {canEdit &&
                        <Button type="button" onClick={onEditClick}>
                            <Pencil /> {t("EDIT")}
                        </Button>
                    }
                </ButtonGroup>
                )
            }
        >
        <Row>
            <Col>
                <ViewDetails
                    obj={{
                        PHOTO: {
                            label: "PHOTO",
                            text: vehicle?.photo ? <img className="img-thumbnail" style={{maxWidth: "100px"}} src={vehicle.photo.path} /> : null
                        },
                        TYPE: vehicle.type === VehicleType.OTHER ? vehicle.type_other : t(`VehicleType.${vehicle.type}`),
                        TRAILER: vehicle.trailer_type === VehicleTrailerType.OTHER ? vehicle.trailer_type_other : (vehicle.trailer_type && t(`VehicleTrailerType.${vehicle.trailer_type}`) || ""),
                        TRANSMISSION: vehicle.transmission_type ? t(`VehicleTransmissionType.` + vehicle.transmission_type) : null,
                        MAKE: vehicle.make,
                        MODEL: vehicle.model,
                        YEAR: vehicle.year,
                        GOVERNED_SPEED: vehicle.is_governed,
                        MAX_SPEED: {
                            show: vehicle.is_governed,
                            text: vehicle.max_speed
                        },
                        ACCESSORIES: vehicle.accessories?.map((a, i) => (
                            a === VehicleAccessory.OTHER && vehicle.accessory_other ?
                            vehicle.accessory_other : t(`VehicleAccessory.${a}`)
                            )
                        ),
                    }}
                    />
            </Col>
        </Row>
    </ChildPageLayout>);
}

ViewVehicle.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}


export async function getServerSideProps(context) {
    try {
        const id = +context.params?.id;
        if (!id)
            return { notFound: true }

        return {
            props: { id: id }
        }
    } catch (error) {
        console.error("ViewVehicle error:", error);
        return { props: { id: null } }
    }
}
