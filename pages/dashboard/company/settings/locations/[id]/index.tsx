import { toast } from "react-toastify";

import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";

import { useRouter } from "next/router";
import { useState } from "react";
import { useEffectAsync } from "../../../../../../utils/react";
import { useTranslation } from "../../../../../../hooks/use-translation";
import { useAuth } from "../../../../../../hooks/use-auth";

import FullLayout from "../../../../../../components/dashboard/layouts/layout/full-layout";
import ChildPageLayout from "../../../../../../components/layouts/page/child-page-layout";
import ViewDetails from "../../../../../../components/view-details/view-details";
import { DeleteButton } from "../../../../../../components/buttons/delete-button";

import { globalAjaxExceptionHandler } from "../../../../../../utils/ajax";

import { LocationEntity } from "../../../../../../models/company/location.entity";
import LocationApi from "../../../../../api/location";

export default function ViewLocation({ id }) {
    const router = useRouter();

    const { t } = useTranslation();

    const { user } = useAuth();

    const { hasPermission, refreshToken } = useAuth();

    const [location, setLocation] = useState(new LocationEntity());

    const backPath = "/dashboard/company/settings/locations";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    useEffectAsync(async () => {
        if (id) {
            const api = new LocationApi();

            const data = await api.findById(+id);

            if (!data) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "TERMINAL" }, { translateProps: true }));
                goBack();
                return;
            }

            setLocation(data);
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "TERMINAL" }, { translateProps: true }));
            goBack();
        }

    }, [ id, user ]);

    const onEditClick = async () => {
        await router.push(router.asPath + `/edit`);
    };

    const onDeleteClick = async () => {
        try {
            const api = new LocationApi();

            await api.remove(location.id);
            await router.push(backPath);
        } catch (e) {
            globalAjaxExceptionHandler(e, { t: t, toast: toast });
        }
    };

    const canEdit = hasPermission("CanUpdateLocation");
    const canDelete = hasPermission("CanDeleteLocation");

    return (
        <ChildPageLayout
            backPath={backPath}
            title={t("VIEW_{name}", { name: "TERMINAL" }, { translateProps: true })}
            actions={
                (<ButtonGroup>
                    {canDelete &&
                        <DeleteButton
                            onDelete={onDeleteClick}
                            />
                    }
                    {canEdit &&
                        <Button type="button" onClick={onEditClick}>
                            <Pencil className="me-2" /> {t("EDIT")}
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
                        STREET: location.street,
                        STATE: location.state,
                        CITY: location.city,
                        ZIP_CODE: location.zip_code,
                    }}
                    />
            </Col>
        </Row>
    </ChildPageLayout>);
}

ViewLocation.getLayout = function getLayout(page) {
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
        console.error("ViewLocation error:", error);
        return { props: { id: null } }
    }
}
