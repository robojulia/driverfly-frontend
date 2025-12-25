import { useRouter } from "next/router";
import { useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { DeleteButton } from "../../../../../../../components/buttons/delete-button";
import { RestoreButton } from "../../../../../../../components/buttons/restore-button";
import FullLayout from "../../../../../../../components/dashboard/layouts/layout/full-layout";
import ChildPageLayout from "../../../../../../../components/layouts/page/child-page-layout";
import ViewDetails from "../../../../../../../components/view-details/view-details";
import { Status } from "../../../../../../../enums/status.enum";
import { useAuth } from "../../../../../../../hooks/use-auth";
import { useTranslation } from "../../../../../../../hooks/use-translation";
import { ReferralSourceEntity } from "../../../../../../../models/referral-source/referral-source.entity";
import { globalAjaxExceptionHandler } from "../../../../../../../utils/ajax";
import { useEffectAsync } from "../../../../../../../utils/react";
import { ReferralSourceApi } from "../../../../../../api/referral-source";

export default function ViewReferral({ id, host }) {
    const router = useRouter();

    const { t } = useTranslation();

    const backPath = `/dashboard/company/settings/admin/referral`;

    const { hasPermission, user } = useAuth();

    function goBack(delay?: boolean) {
        if (delay) {
            window.setTimeout(goBack, 2000);
        }

        router.push(backPath);
    }

    const [entity, setEntity] = useState(new ReferralSourceEntity());


    useEffectAsync(async () => {
        if (id) {
            const api = new ReferralSourceApi();

            let data = null

            try {
                data = await api.getById(+id);
            }
            catch (e) {
                // silent error for now
                data = null;
            }
            if (!data) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: t("REFERRAL_SOURCE") }));
                goBack(true);
                return;
            }

            setEntity(data);
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "REFERRAL_SOURCE" }, { translateProps: true }));
            goBack(true);
        }

    }, [user, id]);

    async function onEditClick() {
        await router.push(router.asPath + `/edit`);
    };

    async function onDeleteClick() {
        try {
            const api = new ReferralSourceApi();

            const newEntity = await api.remove(entity.id);

            setEntity(newEntity);
        }
        catch (e) {
            globalAjaxExceptionHandler(e, { t: t, toast: toast, defaultMessage: "UNABLE_TO_DELETE" });
        }
    }

    async function onRestoreClick() {
        try {
            const api = new ReferralSourceApi();

            const newEntity = await api.restore(entity.id);

            setEntity(newEntity);
        }
        catch (e) {
            globalAjaxExceptionHandler(e, { t: t, toast: toast, defaultMessage: "UNABLE_TO_RESTORE" });
        }
    }

    return (
        <ChildPageLayout
            backPath={backPath}
            title={t("VIEW_{name}", { name: "REFERRAL_SOURCE" }, { translateProps: true })}
            actions={
                (<ButtonGroup>
                    {
                        entity.status == Status.ACTIVE &&
                        <DeleteButton
                            onDelete={onDeleteClick}
                        />
                    }
                    {
                        entity.status == Status.DELETED &&
                        <RestoreButton
                            onRestore={onRestoreClick}
                        />
                    }
                    {
                        entity.id &&
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
                            ID: entity.id,
                            NAME: entity.name,
                            REFERRAL_CODE: entity.code,
                            SOURCE: entity.source,
                            MEDIUM: entity.medium,
                            URL: entity.code ? ReferralSourceEntity.getReferralUrl(host, entity, user?.company?.slug) : null,
                            REFERRALS: entity.referrals,
                            CREATED_AT: (typeof entity.createdAt == "string" ? new Date(entity.createdAt) : entity.createdAt)?.toLocaleString()
                        }}
                    />
                </Col>
            </Row>
        </ChildPageLayout>);
}

ViewReferral.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}


export async function getServerSideProps(context) {
    const { req, query, res, asPath, pathname } = context;
    let host = null;
    if (req) {
        host = req.headers.host // will give you localhost:3000
    }

    try {
        const id = +context.params?.id;
        if (!id)
            return { notFound: true }

        return {
            props: { id: id, host: host }
        }
    } catch (error) {
        console.error("ViewReferralSource error:", error);
        return { props: { id: null, host: host } }
    }
}
