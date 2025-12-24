import { toast } from "react-toastify";

import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";

import FullLayout from "../../../../../../components/dashboard/layouts/layout/full-layout";
import ChildPageLayout from "../../../../../../components/layouts/page/child-page-layout";
import ViewDetails from "../../../../../../components/view-details/view-details";

import { useRouter } from "next/router";
import { useState } from "react";
import { useEffectAsync } from "../../../../../../utils/react";
import { useTranslation } from "../../../../../../hooks/use-translation";
import { useAuth } from "../../../../../../hooks/use-auth";

import { DeleteButton } from "../../../../../../components/buttons/delete-button";
import { CompanyEntity } from "../../../../../../models/company/company.entity";
import CompanyApi from "../../../../../api/company";

export default function ViewCompany({ id }) {
    const router = useRouter();

    const { t } = useTranslation();

    const { hasPermission, refreshToken } = useAuth();

    const [company, setCompany] = useState(new CompanyEntity());

    const backPath = "/dashboard/company/settings/companies";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    useEffectAsync(async () => {
        if (id) {
            const api = new CompanyApi();

            const data = await api.findById(+id, { withPhoto: true });

            if (!data) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "COMPANY" }, { translateProps: true }));
                goBack();
                return;
            }

            setCompany(data);
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "COMPANY" }, { translateProps: true }));
            goBack();
        }

    }, [ id ]);

    const onEditClick = async () => {
        await router.push(router.asPath + `/edit`);
    };

    const onDeleteClick = async () => {
        const api = new CompanyApi();

        await api.remove(company.id);
        await router.push(backPath);
        await refreshToken();
    };

    const canEdit = hasPermission("CanUpdateCompany");
    const canDelete = hasPermission("CanDeleteCompany");

    return (
        <ChildPageLayout
            backPath={backPath}
            title={t("VIEW_{name}", { name: "COMPANY" }, { translateProps: true })}
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
                            text: company?.photo ? <img className="img-thumbnail" style={{maxWidth: "100px"}} src={company.photo.path} alt={`${company.name} logo`} /> : null
                        },
                        NAME: company.name,
                        WEBSITE: company.website,
                        ABOUT: company.about,
                    }}
                    />
            </Col>
        </Row>
    </ChildPageLayout>);
}

ViewCompany.getLayout = function getLayout(page) {
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
        console.error("CompanyView error:", error);
        return { props: { id: null } }
    }
}
