import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { useTranslation } from "../../../../../hooks/use-translation";
import BaseClickToCopyInput from "../../../../../components/forms/base-click-to-copy-input";
import { DriverLicenseType } from "../../../../../enums/users/driver-license-type.enum";

import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useAuth } from "../../../../../hooks/use-auth";
import CompanyApi from "../../../../api/company";
import { Row, Col, Button } from "react-bootstrap";
import { CompanyPreferenceEntity } from "../../../../../models/company/company-preferences.entity";

import * as yup from "yup";
import { CompanyPreferenceCategory } from "../../../../../enums/company/company-preference-category.enum";
import { CompanyPreferenceJotformLabel } from "../../../../../enums/company/company-preferences-jotform-label.enum";
import { useEffectAsync } from "../../../../../utils/react";
import BaseCheckList from "../../../../../components/forms/base-check-list";
import BaseCheck from "../../../../../components/forms/base-check";
import BaseInput from "../../../../../components/forms/base-input";

export default function CompanyPreference() {
  const { user } = useAuth();

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      cdl_class: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.CDL_CLASS,
        value: [],
      } as CompanyPreferenceEntity,
      owner_operator: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.OWNER_OPERATOR,
        value: false,
      } as CompanyPreferenceEntity,
      drug_test_pass: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.DRUG_TEST_PASS,
        value: false,
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
      owner_operator: CompanyPreferenceEntity.yupSchema(),
      drug_test_pass: CompanyPreferenceEntity.yupSchema(),
      minimum_moving_violations: CompanyPreferenceEntity.yupSchema(),
      minimum_accidents: CompanyPreferenceEntity.yupSchema(),
      years_cdl_experience: CompanyPreferenceEntity.yupSchema(),
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

  return (
    <>
      <PageLayout title="COMPANY_PREFERENCE">
        <BaseClickToCopyInput
          label="DIGITAL_HIRING_APP_URL"
          className="my-2 border p-3 rounded"
          value={`${process.env.FRONTEND_BASE_URL ?? ""}form/digitalhiringapp/${user?.company?.id
            }`}
          tooltipText={t("CLICK_TO_COPY")}
        />

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
            <BaseCheck
              className="col-12 mt-4"
              label="OWNER_OPERATOR"
              name="owner_operator.value"
              formik={form}
            />

            <BaseCheck
              className="col-12 mt-4"
              label="DRUG_TEST_PASS"
              name="drug_test_pass.value"
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
