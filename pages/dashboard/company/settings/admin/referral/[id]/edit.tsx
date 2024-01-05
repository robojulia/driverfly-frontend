import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import FullLayout from "../../../../../../../components/dashboard/layouts/layout/full-layout";
import { ReferralSourceForm } from "../../../../../../../components/forms/admin/referral-source-form";
import ChildPageLayout from "../../../../../../../components/layouts/page/child-page-layout";
import { useAuth } from "../../../../../../../hooks/use-auth";
import { useTranslation } from "../../../../../../../hooks/use-translation";
import { ReferralSourceEntity } from "../../../../../../../models/referral-source/referral-source.entity";
import { useEffectAsync } from "../../../../../../../utils/react";
import { ReferralSourceApi } from "../../../../../../api/referral-source";


export default function EditReferral({ id }) {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = `/dashboard/company/settings/admin/referral/${id || ""}`;

    const { user } = useAuth();

    function goBack(delay?: boolean) {
        if (delay) {
            window.setTimeout(goBack, 2000);
        }

        router.push(backPath);
    }

    const [entity, setEntity] = useState<ReferralSourceEntity>(new ReferralSourceEntity());

    useEffectAsync(async () => {
        if (id) {
            const api = new ReferralSourceApi();

            let entity = null

            try {
                entity = await api.getById(+id);
            }
            catch (e) {
                // silent error for now
                entity = null;
            }

            if (entity) setEntity(entity);
            else {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "REFERRAL_SOURCE" }, { translateProps: true }));
                goBack();
            }
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "REFERRAL_SOURCE" }, { translateProps: true }));
            goBack();
        }

    }, [user, id]);

    return (
        <ChildPageLayout
            title={t("EDIT_{name}", { name: "REFERRAL_SOURCE" }, { translateProps: true })}
            backPath={backPath}
        >
            <ReferralSourceForm
                entity={entity}
                onSaveComplete={() => goBack(true)}
            // onSaveError={goBack}
            />
        </ChildPageLayout>
    );
}

EditReferral.getLayout = function getLayout(page) {
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
        console.error("EditReferralSource error:", error);
        return { props: { id: null } }
    }
}
