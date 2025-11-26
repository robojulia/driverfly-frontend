import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "react-bootstrap";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import { EditApplicantFormNew } from "../../../../components/forms/company/edit-applicant-form-new";
import ChildPageLayout from "../../../../components/layouts/page/child-page-layout";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";

export default function CreateApplicant() {
  const router = useRouter();
  const { t } = useTranslation();

  const backPath = "/dashboard/company/applicants";
  const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

  return (
    <ChildPageLayout
      title={t("ADD_{name}", { name: "APPLICANT" }, { translateProps: true })}
      backPath={backPath}
      actions={
        <Button
          type="button"
          className={`btn btn-light`}
          onClick={() => router.push(backPath)}
        >
          {t("BACK")}
        </Button>
      }
    >
      <nav aria-label="breadcrumb" className="px-2 mb-2">
        <div className="d-flex align-items-center small text-muted">
          <Link href="/dashboard">
            <a className="text-muted text-decoration-none">Dashboard</a>
          </Link>
          <span className="mx-2">&gt;</span>
          <Link href="/dashboard/company/applicants">
            <a className="text-muted text-decoration-none">Applicants</a>
          </Link>
          <span className="mx-2">&gt;</span>
          <strong className="text-dark">Add Applicant</strong>
        </div>
      </nav>

      <EditApplicantFormNew
        entity={applicant}
        setEntity={setApplicant}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        hideHeaderActions
        onSaveComplete={() => {
          // After creating, redirect to the list
          goBack();
        }}
      />
    </ChildPageLayout>
  );
}

CreateApplicant.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

