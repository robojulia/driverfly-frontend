import { useRouter } from "next/router";
import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import { ReferralSourceForm } from "../../../../../components/forms/admin/referral-source-form";
import ChildPageLayout from "../../../../../components/layouts/page/child-page-layout";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ReferralSourceEntity } from "../../../../../models/referral-source/referral-source.entity";

export default function CreateReferral() {

    const router = useRouter();
    const { t } = useTranslation();
    const backPath = "/dashboard/company/admin/referral";

    function goBack(delay?: boolean) {
        if (delay) {
            window.setTimeout(goBack, 2000);
        }

        router.push(backPath);
    }

    const entity = new ReferralSourceEntity();

    return <ChildPageLayout
        title={t("CREATE_{name}", { name: "REFERRAL_SOURCE" }, { translateProps: true })}
        backPath={backPath}
        >
        <ReferralSourceForm
            entity={entity}
            onSaveComplete={() => goBack(true)}
            onSaveError={() => goBack(true)}
        />

    </ChildPageLayout>;
}

CreateReferral.getLayout = function getLayout(page) {
    return (
      <FullLayout>
        {page}
      </FullLayout>
    )
  }
