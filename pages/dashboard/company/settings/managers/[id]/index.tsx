import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { ArrowsExpand, BookmarkCheck, BookmarkDash, Pencil, Plus, Trash } from "react-bootstrap-icons";

import FullLayout from "../../../../../../components/dashboard/layouts/layout/full-layout";
import ChildPageLayout from "../../../../../../components/layouts/page/child-page-layout";
import ViewDetails from "../../../../../../components/view-details/view-details";
import { useEffectAsync } from "../../../../../../utils/react";
import { useTranslation } from "../../../../../../hooks/use-translation";
import { useAuth } from "../../../../../../hooks/use-auth";
import CompanyApi from "../../../../../api/company";
import { CompanyManagerEntity } from "../../../../../../models/company/company-manager.entity";

export default function ViewUser({ id }) {

    const router = useRouter();
    const { t } = useTranslation();
    const companyApi = new CompanyApi();

    const backPath = "/dashboard/company/settings/managers";
    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    const [manager, setManager] = useState<CompanyManagerEntity>();

    useEffectAsync(async () => {
        if (id) {
            let data = null

            try {
                data = await companyApi.manager.findById(id);
            }
            catch (e) {
                // silent error for now
            }
            if (!data) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: t("MANAGER") }));
                goBack();
                return;
            }

            setManager(data);
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "MANAGER" }, { translateProps: true }));
            goBack();
        }

    }, [manager, id]);

    const onEditClick = async () => {
        await router.push(router.asPath + `/edit`);
    };

    return (
        <ChildPageLayout
            backPath={backPath}
            title={t("VIEW_{name}", { name: "MANAGER" }, { translateProps: true })}
            actions={
                (<ButtonGroup>
                    <Button type="button" onClick={onEditClick}>
                        <Pencil className="me-2" /> {t("EDIT")}
                    </Button>
                </ButtonGroup>
                )
            }
        >
            <Row>
                <Col>
                    <ViewDetails
                        obj={{
                            NAME: manager?.name,
                            EMAIL: manager?.email,
                            phone: manager?.phone,
                        }}
                    />
                </Col>
            </Row>
        </ChildPageLayout>);
}

ViewUser.getLayout = function getLayout(page) {
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
        console.error("ViewUser error:", error);
        return { props: { id: null } }
    }
}
