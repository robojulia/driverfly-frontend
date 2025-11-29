import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from '../../../../../../../../hooks/use-translation';
import { VehicleInspectionEntity } from '../../../../../../../../models/company/vehicle-inspection.entity';
import VehicleInspectionApi from '../../../../../../../api/vehicle-inspection';
import { VehicleInspectionForm } from '../../../../../../../../components/forms/company/vehicle-inspection-form';
import ChildPageLayout from '../../../../../../../../components/layouts/page/child-page-layout';
import FullLayout from '../../../../../../../../components/dashboard/layouts/layout/full-layout';
import { useEffectAsync } from '../../../../../../../../utils/react';

export default function EditVehicleInspection() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id, inspectionId } = router.query;
  const [inspection, setInspection] = useState<VehicleInspectionEntity | null>(null);

  const backPath = `/dashboard/company/settings/vehicles/${id}`;

  useEffectAsync(async () => {
    if (id && inspectionId) {
      try {
        const api = new VehicleInspectionApi();
        const data = await api.getById(+id, +inspectionId);
        if (!data) {
          toast.error(t('UNABLE_TO_FIND_{name}', { name: 'INSPECTION' }, { translateProps: true }));
          router.push(backPath);
          return;
        }
        setInspection(data);
      } catch (error) {
        console.error('Error fetching inspection:', error);
        toast.error(t('Error loading inspection'));
        router.push(backPath);
      }
    }
  }, [id, inspectionId]);

  const onSaveComplete = async () => {
    toast.success(
      t('Forms.SUCCESS_UPDATED_{name}', { name: 'INSPECTION' }, { translateProps: true })
    );
    await router.push(backPath);
  };

  return (
    <ChildPageLayout
      backPath={backPath}
      title={t('Upload Inspection Report')}
    >
      {inspection && (
        <VehicleInspectionForm
          entity={inspection}
          onSaveComplete={onSaveComplete}
          vehicleId={+id}
        />
      )}
    </ChildPageLayout>
  );
}

EditVehicleInspection.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
