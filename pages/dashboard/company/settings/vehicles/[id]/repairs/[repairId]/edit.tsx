import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffectAsync } from '../../../../../../../../utils/react';
import { useState } from 'react';
import FullLayout from '../../../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../../../components/layouts/page/child-page-layout';
import { VehicleRepairRecordForm } from '../../../../../../../../components/forms/company/vehicle-repair-record-form';
import { VehicleRepairRecordEntity } from '../../../../../../../../models/company/vehicle-repair-record.entity';
import { useTranslation } from '../../../../../../../../hooks/use-translation';
import VehicleRepairRecordApi from '../../../../../../../api/vehicle-repair-record';

export default function EditRepairRecord({ id, repairId }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [repair, setRepair] = useState<VehicleRepairRecordEntity | null>(null);

  useEffectAsync(async () => {
    if (id && repairId) {
      try {
        const api = new VehicleRepairRecordApi();
        const data = await api.getById(+id, +repairId);
        setRepair(data);
      } catch (error) {
        console.error('Error fetching repair record:', error);
        toast.error(t('Error loading repair record'));
        await router.push(`/dashboard/company/settings/vehicles/${id}`);
      }
    }
  }, [id, repairId]);

  const onSaveComplete = async () => {
    toast.success(t('Repair record updated successfully'));
    await router.push(`/dashboard/company/settings/vehicles/${id}`);
  };

  if (!repair) return null;

  return (
    <ChildPageLayout
      backPath={`/dashboard/company/settings/vehicles/${id}`}
      title={t('Upload Repair Receipt')}
    >
      <VehicleRepairRecordForm entity={repair} onSaveComplete={onSaveComplete} vehicleId={id} />
    </ChildPageLayout>
  );
}

EditRepairRecord.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export async function getServerSideProps(context) {
  try {
    const id = +context.params?.id;
    const repairId = +context.params?.repairId;
    if (!id || !repairId) return { notFound: true };

    return {
      props: { id: id, repairId: repairId },
    };
  } catch (error) {
    console.error('EditRepairRecord error:', error);
    return { props: { id: null, repairId: null } };
  }
}
