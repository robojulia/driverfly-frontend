import { toast } from "react-toastify";

import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useEffectAsync } from "../../../../../../utils/react";

import FullLayout from "../../../../../../components/dashboard/layouts/Layout/FullLayout";
import ChildPageLayout from "../../../../../../components/layouts/ChildPageLayout";
import { CompanyForm } from "../../../../../../components/forms/company/CompanyForm";

import { CompanyEntity } from "../../../../../../models/company/company.entity";
import CompanyApi from "../../../../../api/company";
import { useAuth } from "../../../../../../hooks/useAuth";

export default function EditCompany({ id }) {
    const router = useRouter();
    const { t } = useTranslation();

    const { refreshToken } = useAuth();

    const backPath = id ? `/dashboard/company/settings/companies/${id}` : "/dashboard/company/settings/companies";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    const [ company, setCompany ] = useState(new CompanyEntity());

    useEffectAsync(async () => {
        if (id) {
            const api = new CompanyApi();

            const entity = await api.findById(+id);

            if (entity) setCompany(entity);
            else {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "COMPANY" }, { translateProps: true }));
                goBack();
            }
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "COMPANY" }, { translateProps: true }));
            goBack();
        }
    }, [ id ]);

    async function onSaveComplete(e: CompanyEntity) {
        await refreshToken();
        goBack();
    }

    return (
        <ChildPageLayout
            title={t("EDIT_{name}", { name: "COMPANY" }, { translateProps: true })}
            backPath={backPath}
            >
            <CompanyForm
                entity={company}
                onSaveComplete={onSaveComplete}
                />
        </ChildPageLayout>
    );
}

EditCompany.getLayout = function getLayout(page) {
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
        console.error("CompanyEdit error:", error);
        return { props: { id: null } }
    }
}
