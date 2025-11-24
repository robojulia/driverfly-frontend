import Link from "next/link";
import ChildPageLayout from "../../../../components/layouts/page/child-page-layout";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import ImportApplicants from "../../../../components/dashboard/import-applicants";

export default function Import() {
  return (
    <>
      <ChildPageLayout title="IMPORT_APPLICANTS" backPath="/dashboard/company/applicants">
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
            <strong className="text-dark">Import Applicants</strong>
          </div>
        </nav>
        <ImportApplicants />
      </ChildPageLayout>
    </>
  );
}

Import.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

