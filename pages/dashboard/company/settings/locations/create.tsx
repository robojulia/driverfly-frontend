import { useRouter } from 'next/router';
import { useTranslation } from '../../../../../hooks/use-translation';

import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../components/layouts/page/child-page-layout';

import { LocationEntity } from '../../../../../models/company/location.entity';
import { LocationForm } from '../../../../../components/forms/company/location-form';

export default function CreateLocation() {
  const router = useRouter();
  const { t } = useTranslation();

  const backPath = '/dashboard/company/settings/locations';

  async function onSaveComplete(e: LocationEntity) {
    window.setTimeout(() => router.push(backPath), 2000);
  }

  return (
    <ChildPageLayout
      title={t('CREATE_{name}', { name: 'LOCATION' }, { translateProps: true })}
      backPath={backPath}
    >
      <LocationForm onSaveComplete={onSaveComplete} />
    </ChildPageLayout>
  );
}

CreateLocation.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
