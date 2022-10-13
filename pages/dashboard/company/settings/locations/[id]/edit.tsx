import { toast } from "react-toastify";

import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useEffectAsync } from "../../../../../../utils/react";
import { useAuth } from "../../../../../../hooks/useAuth";

import FullLayout from "../../../../../../components/dashboard/layouts/Layout/FullLayout";
import ChildPageLayout from "../../../../../../components/layouts/page/ChildPageLayout";

import { LocationForm } from "../../../../../../components/forms/company/LocationForm";
import { LocationEntity } from "../../../../../../models/company/location.entity";
import LocationApi from "../../../../../api/location";

export default function EditLocation({ id }) {
    const router = useRouter();
    const { t } = useTranslation();

    const { user } = useAuth();

    const backPath = `/dashboard/company/settings/locations/${id}`;

    const goBack = (path?: string) => window.setTimeout(() => router.push(path || backPath), 2000);

    const [ location, setLocation ] = useState(new LocationEntity());

    useEffectAsync(async () => {
        if (id) {
            const api = new LocationApi();

            const entity = await api.findById(+id);

            if (entity) setLocation(entity);
            else {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "COMPANY" }, { translateProps: true }));
                goBack("/dashboard/company/settings/companies");
            }
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "COMPANY" }, { translateProps: true }));
            goBack("/dashboard/company/settings/companies");
        }
    }, [ id, user ]);

    return (
        <ChildPageLayout
            title={t("EDIT_{name}", { name: "TERMINAL" }, { translateProps: true })}
            backPath={backPath}
            >
            <LocationForm
                entity={location}
                onSaveComplete={v => goBack()}
                />
        </ChildPageLayout>
    );
}

EditLocation.getLayout = function getLayout(page) {
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
        console.error("EditLocation error:", error);
        return { props: { id: null } }
    }
}
