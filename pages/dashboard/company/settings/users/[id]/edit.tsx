import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import FullLayout from "../../../../../../components/dashboard/layouts/layout/full-layout";
import { UserForm } from "../../../../../../components/forms/company/user-form";
import ChildPageLayout from "../../../../../../components/layouts/page/child-page-layout";
import { useAuth } from "../../../../../../hooks/use-auth";
import { useTranslation } from "../../../../../../hooks/use-translation";
import { UserEntity } from "../../../../../../models/user/user.entity";
import { useEffectAsync } from "../../../../../../utils/react";
import UserApi from "../../../../../api/user";

export default function EditUser({ id }) {
    const router = useRouter();
    const { t } = useTranslation();

    const { company } = useAuth();

    const backPath = `/dashboard/company/settings/users/${id}`;

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    const [ user, setUser ] = useState(new UserEntity());

    useEffectAsync(async () => {
        if (id) {
            const api = new UserApi();

            let entity = null
            
            try {
                entity = await api.findById(+id);
            }
            catch (e) {
                // silent error for now
                entity = null;
            }

            if (entity) setUser(entity);
            else {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "USER" }, { translateProps: true }));
                goBack();
            }
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "USER" }, { translateProps: true }));
            goBack();
        }
    }, [ company, id ]);

    return (
        <ChildPageLayout
            title={t("EDIT_{name}", { name: "USER" }, { translateProps: true })}
            backPath={backPath}
            >
            <UserForm
                entity={user}
                onSaveComplete={goBack}
                // onSaveError={goBack}
                />
        </ChildPageLayout>
    );
}

EditUser.getLayout = function getLayout(page) {
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
        console.error("EditUser error:", error);
        return { props: { id: null } }
    }
}
