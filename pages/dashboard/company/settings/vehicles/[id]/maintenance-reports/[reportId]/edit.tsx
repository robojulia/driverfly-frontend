import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffectAsync } from '../../../../../../../../utils/react';
import { useState } from 'react';
import FullLayout from '../../../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../../../components/layouts/page/child-page-layout';
import { VehicleMaintenanceReportForm } from '../../../../../../../../components/forms/company/vehicle-maintenance-report-form';
import { VehicleMaintenanceReportEntity } from '../../../../../../../../models/company/vehicle-maintenance-report.entity';
import { useTranslation } from '../../../../../../../../hooks/use-translation';
import VehicleMaintenanceReportApi from '../../../../../../../api/vehicle-maintenance-report';

export default function EditMaintenanceReport({ id, reportId }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [report, setReport] = useState<VehicleMaintenanceReportEntity | null>(null);

  useEffectAsync(async () => {
    if (id && reportId) {
      try {
        const api = new VehicleMaintenanceReportApi();
        const data = await api.getById(+id, +reportId);
        setReport(data);
      } catch (error) {
        console.error('Error fetching maintenance report:', error);
        toast.error(t('Error loading maintenance report'));
        await router.push(`/dashboard/company/settings/vehicles/${id}`);
      }
    }
  }, [id, reportId]);

  const onSaveComplete = async () => {
    toast.success(t('Maintenance report updated successfully'));
    await router.push(`/dashboard/company/settings/vehicles/${id}`);
  };

  if (!report) return null;

  return (
    <ChildPageLayout
      backPath={`/dashboard/company/settings/vehicles/${id}`}
      title={t('Upload Maintenance Report')}
    >
      <VehicleMaintenanceReportForm entity={report} onSaveComplete={onSaveComplete} vehicleId={id} />
    </ChildPageLayout>
  );
}

EditMaintenanceReport.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export async function getServerSideProps(context) {
  try {
    const id = +context.params?.id;
    const reportId = +context.params?.reportId;
    if (!id || !reportId) return { notFound: true };

    return {
      props: { id: id, reportId: reportId },
    };
  } catch (error) {
    console.error('EditMaintenanceReport error:', error);
    return { props: { id: null, reportId: null } };
  }
}
