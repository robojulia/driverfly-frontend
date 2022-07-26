import { toast } from "react-toastify";

import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { ArrowsExpand, BookmarkCheck, BookmarkDash, Pencil, Plus, Trash } from "react-bootstrap-icons";

import FullLayout from "../../../../../../components/dashboard/layouts/Layout/FullLayout";
import ChildPageLayout from "../../../../../../components/layouts/page/ChildPageLayout";
import ViewCard from "../../../../../../components/viewDetails/viewCard";
import ViewDetails from "../../../../../../components/viewDetails/viewDetails";

import { useRouter } from "next/router";
import { useState } from "react";
import { useEffectAsync } from "../../../../../../utils/react";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useAuth } from "../../../../../../hooks/useAuth";

import UserApi from "../../../../../api/user";
import { UserEntity } from "../../../../../../models/user/user.entity";
import { DeleteButton } from "../../../../../../components/buttons/DeleteButton";

export default function ViewUser({ id }) {
    const router = useRouter();

    const { t } = useTranslation();

    const { company, hasPermission } = useAuth();

    const [user, setUser] = useState(new UserEntity());

    const backPath = "/dashboard/company/settings/users";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    useEffectAsync(async () => {
        if (!user) return;
        
        if (id) {
            const api = new UserApi();

            const data = await api.findById(+id);

            if (!data) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: t("USER") }));
                goBack();
                return;
            }

            setUser(data);
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "USER" }, { translateProps: true }));
            goBack();
        }

    }, [ company, id ]);

    const onEditClick = async () => {
        await router.push(router.asPath + `/edit`);
    };

    const onDeleteClick = async () => {
        const api = new UserApi();

        await api.remove(user.id);
        await router.push(backPath);
    };

    const canEdit = hasPermission("CanUpdateUser");
    const canDelete = hasPermission("CanDeleteUser");

    return (
        <ChildPageLayout
            backPath={backPath}
            title={t("VIEW_{name}", { name: "USER" }, { translateProps: true })}
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
                        FIRST_NAME: user.first_name,
                        LAST_NAME: user.last_name,
                        EMAIL: user.email,
                        phone: user.contact_number,
                        phone_cell: user.cell_number,
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
