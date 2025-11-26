import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import FullLayout from '../../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../../components/layouts/page/child-page-layout';
import { VehicleMaintenanceReportForm } from '../../../../../../../components/forms/company/vehicle-maintenance-report-form';
import { VehicleMaintenanceReportEntity } from '../../../../../../../models/company/vehicle-maintenance-report.entity';
import { useTranslation } from '../../../../../../../hooks/use-translation';

export default function CreateMaintenanceReport({ id }) {
  const router = useRouter();
  const { t } = useTranslation();

  const onSaveComplete = async () => {
    toast.success(t('Maintenance report created successfully'));
    await router.push(`/dashboard/company/settings/vehicles/${id}`);
  };

  return (
    <ChildPageLayout
      backPath={`/dashboard/company/settings/vehicles/${id}`}
      title={t('CREATE_{name}', { name: 'MAINTENANCE_REPORT' }, { translateProps: true })}
    >
      <VehicleMaintenanceReportForm
        entity={new VehicleMaintenanceReportEntity()}
        onSaveComplete={onSaveComplete}
        vehicleId={id}
      />
    </ChildPageLayout>
  );
}

CreateMaintenanceReport.getLayout = function getLayout(page) {
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
    console.error('CreateMaintenanceReport error:', error);
    return { props: { id: null } };
  }
}
