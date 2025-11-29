import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import FullLayout from '../../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../../components/layouts/page/child-page-layout';
import { VehicleRepairRecordForm } from '../../../../../../../components/forms/company/vehicle-repair-record-form';
import { VehicleRepairRecordEntity } from '../../../../../../../models/company/vehicle-repair-record.entity';
import { useTranslation } from '../../../../../../../hooks/use-translation';

export default function CreateRepairRecord({ id }) {
  const router = useRouter();
  const { t } = useTranslation();

  const onSaveComplete = async () => {
    toast.success(t('Repair record created successfully'));
    await router.push(`/dashboard/company/settings/vehicles/${id}`);
  };

  return (
    <ChildPageLayout
      backPath={`/dashboard/company/settings/vehicles/${id}`}
      title={t('Upload Repair Receipt')}
    >
      <VehicleRepairRecordForm
        entity={new VehicleRepairRecordEntity()}
        onSaveComplete={onSaveComplete}
        vehicleId={id}
      />
    </ChildPageLayout>
  );
}

CreateRepairRecord.getLayout = function getLayout(page) {
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
    console.error('CreateRepairRecord error:', error);
    return { props: { id: null } };
  }
}
