import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import { useAuth } from '../../../../hooks/use-auth';

import { CompanyEntity } from '../../../../models/company/company.entity';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { CompanyForm } from '../../../../components/forms/company/company-form';

export default function Settings() {
  const { user, updateUser } = useAuth();

  function onSaveComplete(c: CompanyEntity) {
    updateUser({
      ...user,
      company: {
        ...user.company,
        name: c.name,
        website: c.website,
        about: c.about,
        photo: c.photo,
      },
    });
  }

  return (
    <PageLayout title="COMPANY">
      <CompanyForm showClickToCopy entity={user?.company} onSaveComplete={onSaveComplete} />
    </PageLayout>
  );
}

Settings.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
