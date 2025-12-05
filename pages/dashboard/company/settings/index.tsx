import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import { useAuth } from '../../../../hooks/use-auth';
import { useRef, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

import { CompanyEntity } from '../../../../models/company/company.entity';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { CompanyForm } from '../../../../components/forms/company/company-form';
import { LoaderIcon } from '../../../../components/loading/loader-icon';
import { useTranslation } from '../../../../hooks/use-translation';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const formRef = useRef<any>(null);
  const [formState, setFormState] = useState({ isValid: false, isSubmitting: false });

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

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (formRef.current) {
        setFormState({
          isValid: formRef.current.isValid,
          isSubmitting: formRef.current.isSubmitting,
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout
      title="COMPANY"
      actions={
        <Button
          type="button"
          className="theme-secondary-btn"
          onClick={handleSubmit}
          disabled={!formState.isValid || formState.isSubmitting}
        >
          <LoaderIcon isLoading={formState.isSubmitting} /> {t('UPDATE')}
        </Button>
      }
    >
      <CompanyForm
        showClickToCopy
        entity={user?.company}
        onSaveComplete={onSaveComplete}
        formRef={formRef}
        hideSubmitButton={true}
      />
    </PageLayout>
  );
}

Settings.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
