import { toast } from 'react-toastify';

import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from '../../../../../../hooks/use-translation';
import { useEffectAsync } from '../../../../../../utils/react';

import FullLayout from '../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../components/layouts/page/child-page-layout';
import { VehicleForm } from '../../../../../../components/forms/company/vehicle-form';

import { VehicleEntity } from '../../../../../../models/company/vehicle.entity';
import VehicleApi from '../../../../../api/vehicle';
import { useAuth } from '../../../../../../hooks/use-auth';

export default function EditVehicle({ id }) {
  const router = useRouter();
  const { t } = useTranslation();

  const { user } = useAuth();

  const backPath = `/dashboard/company/settings/vehicles/${id}`;

  const goBack = (path?: string) => window.setTimeout(() => router.push(path || backPath), 2000);

  const [vehicle, setVehicle] = useState(new VehicleEntity());

  useEffectAsync(async () => {
    if (id) {
      const api = new VehicleApi();

      const entity = await api.findById(+id);

      if (entity) setVehicle(entity);
      else {
        toast.error(t('UNABLE_TO_FIND_{name}', { name: 'VEHICLE' }, { translateProps: true }));
        goBack('/dashboard/company/settings/vehicles');
      }
    } else {
      toast.error(t('UNABLE_TO_FIND_{name}', { name: 'VEHICLE' }, { translateProps: true }));
      goBack();
    }
  }, [id, user]);

  return (
    <ChildPageLayout
      title={t('EDIT_{name}', { name: 'VEHICLE' }, { translateProps: true })}
      backPath={backPath}
    >
      <VehicleForm entity={vehicle} onSaveComplete={(v) => goBack()} />
    </ChildPageLayout>
  );
}

EditVehicle.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export async function getServerSideProps(context) {
  try {
    const id = +context.params?.id;
    if (!id) return { notFound: true };

    return {
      props: { id: id },
    };
  } catch (error) {
    console.error('EditVehicle error:', error);
    return { props: { id: null } };
  }
}
