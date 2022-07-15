import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { useAuth } from '../../../../hooks/useAuth';

import { useTranslation } from "../../../../hooks/useTranslation";

import { CompanyEntity } from "../../../../models/company/company.entity";
import PageLayout from "../../../../components/layouts/PageLayout";
import { CompanyForm } from "../../../../components/forms/company/CompanyForm";

export default function Settings() {
  const { t } = useTranslation();

  const { user, updateUser } = useAuth();

  function onSaveComplete(c: CompanyEntity) {
    updateUser({
      ...user,
      company: {
        ...user.company,
        name: c.name,
        about: c.about,
        photo: c.photo
      }
    })

  }

  return (
    <PageLayout
      title="COMPANY"
    >
      <CompanyForm
        entity={user.company}
        onSaveComplete={onSaveComplete}
      />
    </PageLayout>
  )
};

Settings.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}
