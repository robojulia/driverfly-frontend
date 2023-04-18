import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import FullLayout from "../../../../../../components/dashboard/layouts/layout/full-layout";
import { ManagerForm } from "../../../../../../components/forms/company/manager-form";
import ChildPageLayout from "../../../../../../components/layouts/page/child-page-layout";
import { useTranslation } from "../../../../../../hooks/use-translation";
import { CompanyManagerEntity } from "../../../../../../models/company/company-manager.entity";
import { useEffectAsync } from "../../../../../../utils/react";
import CompanyApi from "../../../../../api/company";

export default function EditUser({ id }) {

    const router = useRouter();
    const { t } = useTranslation();

    const companyApi = new CompanyApi();

    const backPath = `/dashboard/company/settings/managers/${id}`;
    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    const [manager, setManager] = useState<CompanyManagerEntity>();

    useEffectAsync(async () => {
        if (manager) return;

        if (id) {
            let entity = null

            try {
                entity = await companyApi.manager.findById(id);
            }
            catch (e) {
                // silent error for now
            }

            if (entity) setManager(entity);
            else {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "MANAGER" }, { translateProps: true }));
                goBack();
            }
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "MANAGER" }, { translateProps: true }));
            goBack();
        }
    }, [manager, id]);

    return (
        <ChildPageLayout
            title={t("EDIT_{name}", { name: "MANAGER" }, { translateProps: true })}
            backPath={backPath}
        >
            <ManagerForm
                entity={manager}
                onSaveComplete={goBack}
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
        console.error("EditManager error:", error);
        return { props: { id: null } }
    }
}
