import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import { useAuth } from '../../../../hooks/use-auth';
import { useRef, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

import { CompanyEntity } from '../../../../models/company/company.entity';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { CompanyForm } from '../../../../components/forms/company/company-form';
import { LoaderIcon } from '../../../../components/loading/loader-icon';
import { useTranslation } from '../../../../hooks/use-translation';
import { useEffectAsync } from '../../../../utils/react';
import CompanyApi from '../../../api/company';

export default function Settings() {
  const { user, updateUser, isCompanyAdmin } = useAuth();
  const { t } = useTranslation();
  const formRef = useRef<any>(null);
  const [formState, setFormState] = useState({ isValid: false, isSubmitting: false });
  const [company, setCompany] = useState<CompanyEntity>(user?.company);

  useEffectAsync(async () => {
    try {
      const api = new CompanyApi();
      const data = await api.me.get();
      if (data) setCompany(data);
    } catch (e) {
      // fall back to auth context data
    }
  }, []);

  function onSaveComplete(c: CompanyEntity) {
    setCompany(c);
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
        isCompanyAdmin ? (
          <Button
            type="button"
            className="theme-secondary-btn"
            onClick={handleSubmit}
            disabled={!formState.isValid || formState.isSubmitting}
          >
            <LoaderIcon isLoading={formState.isSubmitting} /> {t('UPDATE')}
          </Button>
        ) : null
      }
    >
      <CompanyForm
        showClickToCopy
        entity={company}
        onSaveComplete={onSaveComplete}
        formRef={formRef}
        hideSubmitButton={true}
        readOnly={!isCompanyAdmin}
      />
    </PageLayout>
  );
}

Settings.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
