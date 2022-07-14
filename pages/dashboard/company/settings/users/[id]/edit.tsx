import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import FullLayout from "../../../../../../components/dashboard/layouts/Layout/FullLayout";
import { UserForm } from "../../../../../../components/forms/company/UserForm";
import ChildPageLayout from "../../../../../../components/layouts/ChildPageLayout";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { UserEntity } from "../../../../../../models/user/user.entity";
import { useEffectAsync } from "../../../../../../utils/react";
import UserApi from "../../../../../api/user";

export default function EditUser() {
    const router = useRouter();
    const { t } = useTranslation();

    const { id } = router.query;

    const backPath = `/dashboard/company/settings/users/${id}`;

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    const [ user, setUser ] = useState(new UserEntity());

    useEffectAsync(async () => {
        if (id) {
            const api = new UserApi();

            const entity = await api.findById(+id);

            if (entity) setUser(entity);
            else {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "USER" }, { translateProps: true }));
                goBack();
            }
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "USER" }, { translateProps: true }));
            goBack();
        }
    }, [ id ]);

    return (
        <ChildPageLayout
            title={t("EDIT_{name}", { name: "USER" }, { translateProps: true })}
            backPath={backPath}
            >
            <UserForm
                entity={user}
                onSaveComplete={goBack}
                onSaveError={goBack}
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
