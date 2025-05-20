import { useRouter } from 'next/router';
import { useTranslation } from '../../../../../../../hooks/use-translation';
import { useAuth } from '../../../../../../../hooks/use-auth';
import FullLayout from '../../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../../components/layouts/page/child-page-layout';
import { VehicleInspectionForm } from '../../../../../../../components/forms/company/vehicle-inspection-form';
import { VehicleInspectionEntity } from '../../../../../../../models/company/vehicle-inspection.entity';

export default function CreateVehicleInspection({ id }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();

  const backPath = `/dashboard/company/settings/vehicles/${id}`;

  const onSaveComplete = async () => {
    await router.push(backPath);
  };

  return (
    <ChildPageLayout
      backPath={backPath}
      title={t('CREATE_{name}', { name: 'INSPECTION' }, { translateProps: true })}
    >
      <VehicleInspectionForm
        entity={new VehicleInspectionEntity()}
        onSaveComplete={onSaveComplete}
        vehicleId={id}
      />
    </ChildPageLayout>
  );
}

CreateVehicleInspection.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export async function getServerSideProps(context) {
  try {
    const id = +context.params?.id;
    if (!id) return { notFound: true };

    return {
      props: { id },
    };
  } catch (error) {
    console.error('CreateVehicleInspection error:', error);
    return { props: { id: null } };
  }
}
