import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { useTranslation } from "../../../../../hooks/use-translation";
import BaseClickToCopyInput from "../../../../../components/forms/base-click-to-copy-input";
import { DriverLicenseType } from "../../../../../enums/users/driver-license-type.enum";

import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useAuth } from "../../../../../hooks/use-auth";
import CompanyApi from "../../../../api/company";
import { Row, Col, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CompanyPreferenceEntity } from "../../../../../models/company/company-preferences.entity";

import * as yup from "yup";
import { CompanyPreferenceCategory } from "../../../../../enums/company/company-preference-category.enum";
import { CompanyPreferenceJotformLabel } from "../../../../../enums/company/company-preferences-jotform-label.enum";
import { useEffectAsync } from "../../../../../utils/react";
import BaseCheckList from "../../../../../components/forms/base-check-list";
import BaseInput from "../../../../../components/forms/base-input";
import { JobEmploymentType } from "../../../../../enums/jobs/job-employment-type.enum";
import { JobGeography } from "../../../../../enums/jobs/job-geography.enum";

export default function CompanyPreference() {
  const { user } = useAuth();

  const { t } = useTranslation();
  const removeEmploymentTypes = [JobEmploymentType.SEASONAL, JobEmploymentType.PART_TIME, JobEmploymentType.ONE_TIME_GIG]
  const FilteredEmploymentTypes = Object.values(JobEmploymentType).filter(v => !removeEmploymentTypes.includes(v))
  const form = useFormik({
    initialValues: {
      cdl_class: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.CDL_CLASS,
        value: [],
      } as CompanyPreferenceEntity,
      employment_type: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.EMPLOYMENT_TYPE,
        value: [],
      } as CompanyPreferenceEntity,
      job_geography: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.JOB_GEOGRAPHY,
        value: [],
      } as CompanyPreferenceEntity,
      minimum_accidents: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.MINIMUM_ACCIDENTS,
        value: 0,
      } as CompanyPreferenceEntity,
      minimum_moving_violations: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.MIN_MOVING_VIOLATIONS,
        value: 0,
      } as CompanyPreferenceEntity,
      years_cdl_experience: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.YEARS_CDL_EXPERIENCE,
        value: 0,
      },
    } as CompanyPreferenceEntity,

    validationSchema: yup.object({
      cdl_clas: CompanyPreferenceEntity.yupSchema(),
      minimum_moving_violations: CompanyPreferenceEntity.yupSchema(),
      minimum_accidents: CompanyPreferenceEntity.yupSchema(),
      years_cdl_experience: CompanyPreferenceEntity.yupSchema(),
      employment_type: CompanyPreferenceEntity.yupSchema(),
      job_geography: CompanyPreferenceEntity.yupSchema(),
    }),
    onSubmit: async (values) => {
      const api = new CompanyApi();

      try {
        const preferences = await Promise.all(
          Object.values(values).map(async (preference) => {
            console.log('preference ----', preference);
            if (preference.value) {
              if (preference.id)
                preference = await api.preferences.update(
                  user?.company.id,
                  preference.id,
                  preference
                );
              else {
                preference = await api.preferences.create(
                  user?.company.id,
                  preference
                );
              }
            } else if (preference.id) {
              await api.preferences.remove(user.id, preference.id);
              delete preference.id;
            }

            return preference;
          })
        );
        populateForm(preferences);
        toast.success(t("successfully_saved_information"));
      } catch (e) {
        console.error("Unable to save preferences", e);
        toast.error(t("unable_to_save_information"));
      }
    },
  });

  useEffectAsync(async () => {
    if (user.company) {
      const api = new CompanyApi();
      const preferences = await api.preferences.list(user.company.id, {
        category: CompanyPreferenceCategory.JOTFORM,
      });
      populateForm(preferences);
    }
  }, []);

  /**
   *
   * @param {CompanyPreferenceEntity[]} preferences
   */
  const populateForm = function (preferences) {
    preferences.forEach((v) => {
      console.log('v.label', v)
      const label = v.label?.toLowerCase();
      if (label in form.values) {
        form.initialValues[label] = v;
        form.setFieldValue(label, v);
      }
    });
  };



  const tooltip = <Tooltip id="my-tooltip" >{t("REFER_BACK_DETAILS")}</Tooltip>;


  return (
    <>
      <PageLayout title="DIGITAL_HIRING_APPLICATION">
        <p className="pt-2 pb-2">{t("DHA_PREFERENCE_POINT_1")}</p>
        <BaseClickToCopyInput
          label="DIGITAL_HIRING_APP_URL"
          className="my-2 border p-3 rounded"
          value={`${process.env.FRONTEND_BASE_URL ?? ""}form/digitalhiringapp/${user?.company?.id
            }`}
          tooltipText={t("CLICK_TO_COPY")}
        />

        <h2 className="pt-2 pb-2">{t("COMPANY_PREFERENCE")}</h2>
        <p className="pt-2 pb-2">{t("DHA_PREFERENCE_POINT_2")}</p>

        <form onSubmit={form.handleSubmit} className="py-4 px-3 border rounded mt-4" style={{ background: '#e9ecef' }}>
          <Row>
            <BaseCheckList
              className="col-12 mt-2"
              label="CDL_CLASS"
              name="cdl_class.value"
              labelPrefix="DriverLicenseType"
              required
              enumType={DriverLicenseType}
              formik={form}
            />
            <BaseCheckList
              className="col-12 mt-2"
              label="EMPLOYMENT_TYPE"
              name="employment_type.value"
              labelPrefix="JobEmploymentType"
              required
              enumType={FilteredEmploymentTypes}
              formik={form}
            />
            <BaseCheckList
              className="col-12 mt-2"
              label="PREFERRED_LOCATION"
              name="job_geography.value"
              labelPrefix="JobGeography"
              required
              enumType={JobGeography}
              formik={form}
            />
            <BaseInput
              className="col-md-4 mt-4"
              label="years_cdl_experience"
              name="years_cdl_experience.value"
              type="number"
              placeholder
              formik={form}
            />

            <BaseInput
              className="col-md-4 mt-4"
              label="MIN_ACCIDENTS"
              name="minimum_accidents.value"
              type="number"
              placeholder
              formik={form}
            />

            <BaseInput
              className="col-md-4 mt-4"
              label="MIN_MOVING_VIOLATIONS"
              name="minimum_moving_violations.value"
              type="number"
              placeholder
              formik={form}
            />
          </Row>

          <Row className="mt-3">
            <Col className="">
              <OverlayTrigger trigger={['hover', 'focus']} delay={{ show: 0, hide: 0 }} overlay={tooltip}>
                <Button>
                  {t("REFER_BACK_QUESTION")}
                </Button>
              </OverlayTrigger>
            </Col>
            <Col className="text-end">
              <Button
                type="submit"
                variant="primary"
                disabled={form.isSubmitting || !form.isValid || !form.dirty}
              >
                {t("UPDATE")}
              </Button>

            </Col>
          </Row>
        </form>
      </PageLayout>
    </>
  );
}

CompanyPreference.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
