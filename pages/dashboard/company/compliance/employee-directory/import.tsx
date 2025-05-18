import ChildPageLayout from '../../../../../components/layouts/page/child-page-layout';
import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import ImportEmployees from '../../../../../components/dashboard/import-employees';

export default function Import() {
  return (
    <>
      <ChildPageLayout
        title="IMPORT_EMPLOYEES"
        backPath="/dashboard/company/compliance/employee-directory"
      >
        <ImportEmployees />
      </ChildPageLayout>
    </>
  );
}
Import.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
