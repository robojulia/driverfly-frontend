import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { ApplicantForm } from "../../../../../components/forms/company/ApplicantForm";
import ChildPageLayout from "../../../../../components/layouts/page/ChildPageLayout";
import { useTranslation } from "../../../../../hooks/useTranslation";
import { ApplicantEntity } from "../../../../../models/applicant/applicant.entity";
import { useEffectAsync } from "../../../../../utils/react";
import ApplicantApi from "../../../../api/applicant";

export default function EditApplicant({ id }) {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = `something`;
    

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    const [ applicant, setApplicant ] = useState(new ApplicantEntity());

    useEffectAsync(async () => {
        if (id) {
            const api = new ApplicantApi();

            const entity = await api.getById(+id);

            if (entity) setApplicant(entity);
            else {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "APPLICANT" }, { translateProps: true }));
                goBack();
            }
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "APPLICANT" }, { translateProps: true }));
            goBack();
        }
    }, [ id ]);

    return (
        <ChildPageLayout
            title={t("EDIT_{name}", { name: "APPLICANT" }, { translateProps: true })}
            >
            <ApplicantForm
                entity={applicant}
                onSaveComplete={goBack}
                />
        </ChildPageLayout>
    );
}

EditApplicant.getLayout = function getLayout(page) {
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
        console.error("EditApplicant error:", error);
        return { props: { id: null } }
    }
}

