import { useRouter } from 'next/router';
import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Container, Row, Col } from 'react-bootstrap';
import { Calendar2Month, Calendar2, Calendar3 } from 'react-bootstrap-icons';
import { useEffectAsync } from '../../../../../../utils/react';
import { useTranslation } from '../../../../../../hooks/use-translation';
import { useAuth } from '../../../../../../hooks/use-auth';
import FullLayout from '../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../components/layouts/page/child-page-layout';
import { BaseViewCard, ViewSection } from '../../../../../../components/view/base-view-card';
import EntityForm from '../../../../../../components/layouts/page/entity-form';
import CardRadioGroup from '../../../../../../components/forms/card-radio-group';
import NextInspectionExample from '../../../../../../components/vehicle/inspections/NextInspectionExample';
import { VehiclePreferencesEntity } from '../../../../../../models/company/vehicle-preferences.entity';
import { InspectionFrequency } from '../../../../../../enums/vehicles/inspection-frequency.enum';
import VehiclePreferencesApi from '../../../../../api/vehicle-preferences';
import VehicleApi from '../../../../../api/vehicle';

export default function VehiclePreferences({ id }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<VehiclePreferencesEntity | null>(null);
  const [vehicleName, setVehicleName] = useState('');

  const backPath = `/dashboard/company/settings/vehicles/${id}`;

  const form = useFormik({
    initialValues: preferences || new VehiclePreferencesEntity(),
    enableReinitialize: true,
    validationSchema: VehiclePreferencesEntity.yupSchema(),
    onSubmit: async (values) => {
      try {
        const api = new VehiclePreferencesApi();
        const data = preferences ? await api.update(id, values) : await api.create(id, values);

        setPreferences(data);
        toast.success(t('Inspection frequency preferences saved successfully'));
        router.push(backPath);
      } catch (error) {
        console.error('Error saving preferences:', error);
        toast.error(t('Error saving preferences'));
      }
    },
  });

  useEffectAsync(async () => {
    if (!user || !id) return;

    try {
      // Fetch vehicle details for the header
      const vehicleApi = new VehicleApi();
      const vehicle = await vehicleApi.findById(+id);
      if (vehicle) {
        setVehicleName(`${vehicle.year} ${vehicle.make} ${vehicle.model}`);
      }

      // Fetch preferences
      const api = new VehiclePreferencesApi();
      const data = await api.getByVehicleId(+id);
      setPreferences(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status !== 404) {
        toast.error(t('Error loading preferences'));
      }
    }
  }, [user, id]);

  const inspectionFrequencyOptions = [
    {
      value: String(InspectionFrequency.MONTH),
      label: 'MONTH',
      icon: <Calendar2Month size={32} />,
      description: 'Schedule inspections every month',
      variant: 'primary' as const,
    },
    {
      value: String(InspectionFrequency.QUARTER),
      label: 'QUARTER',
      icon: <Calendar2 size={32} />,
      description: 'Schedule inspections every three months',
      variant: 'info' as const,
    },
    {
      value: String(InspectionFrequency.ANNUAL),
      label: 'ANNUAL',
      icon: <Calendar3 size={32} />,
      description: 'Schedule inspections once a year',
      variant: 'warning' as const,
    },
  ];

  return (
    <ChildPageLayout backPath={backPath} title={t('Vehicle Inspection Preferences')}>
      <Container>
        <Row>
          <Col>
            <BaseViewCard>
              <ViewSection title={vehicleName}>
                <p className="text-muted mb-4">
                  {t(
                    'Set up automatic inspection scheduling for this vehicle. When an inspection is completed, a new inspection will be automatically scheduled based on your frequency preference.'
                  )}
                </p>
                <p className="text-muted mb-4">
                  {t(
                    'For example, if you select "Monthly" and complete an inspection in March, a new inspection will be automatically scheduled for the end of April.'
                  )}
                </p>
                <EntityForm
                  formik={form}
                  onSubmit={form.handleSubmit}
                  submitLabel="Save Preferences"
                  actionButtonDown={true}
                >
                  <CardRadioGroup
                    className="mb-2"
                    name="inspection_frequency"
                    label="Inspection Frequency"
                    required
                    options={inspectionFrequencyOptions}
                    labelPrefix="InspectionFrequency"
                    formik={form}
                  />
                  <NextInspectionExample selectedFrequency={form.values.inspection_frequency} />
                </EntityForm>
              </ViewSection>
            </BaseViewCard>
          </Col>
        </Row>
      </Container>
    </ChildPageLayout>
  );
}

VehiclePreferences.getLayout = function getLayout(page) {
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
    console.error('VehiclePreferences error:', error);
    return { props: { id: null } };
  }
}
