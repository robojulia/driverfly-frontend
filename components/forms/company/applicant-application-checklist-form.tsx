import { useMemo, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import Section from "../../view-details/section";
import { useTranslation } from "../../../hooks/use-translation";
import { useAuth } from "../../../hooks/use-auth";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { BaseFormProps } from "./base-form-props";
import ApplicantApi from "../../../pages/api/applicant";
import CompanyApi from "../../../pages/api/company";
import { CompanyPreferenceEntity } from "../../../models/company/company-preferences.entity";
import { CompanyPreferenceCategory } from "../../../enums/company/company-preference-category.enum";
import { CompanyPreferenceOnboardingChecklistLabel } from "../../../enums/company/company-preferences-onboarding-checklist-label.enum";
import { ApplicantDacEntity } from "../../../models/applicant";
import ShowFormattedDate from "../../jobs/show-formatted-date";
import { CompanyPreferencesDacForm } from "./company-preferences-dac-form";
import { toast } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { useEffectAsync } from "../../../utils/react";

export interface ApplicantApplicationChecklistFormProps extends BaseFormProps<ApplicantEntity> {
  readOnly?: boolean;
}


export function ApplicantApplicationChecklistForm(
  props: ApplicantApplicationChecklistFormProps
) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { entity, setEntity } = props;
  const applicantApi = new ApplicantApi();
  const companyApi = new CompanyApi();
  const readOnly = props.readOnly || Boolean(entity?.is_hired);

  const [editChecklistItems, setEditChecklistItems] = useState<boolean>(false);
  const [companyOnboardingPreferences, setCompanyOnboardingPreferences] =
    useState<CompanyPreferenceEntity[]>();

  useEffectAsync(async () => {
    if (user?.company) {
      const preferences = await companyApi.preferences.list(user.company.id, {
        category: CompanyPreferenceCategory.ONBOARDING_CHECKLIST,
      });
      setCompanyOnboardingPreferences(preferences);
    }
  }, [user]);

  const companyDaclist = useMemo(
    () =>
      companyOnboardingPreferences?.find(
        ({ label }) =>
          label == CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DAC
      ),
    [companyOnboardingPreferences, user]
  );

  const handleCheckboxToggle = async (
    type: string,
    applicatDacItem?: ApplicantDacEntity
  ) => {
    try {
      let dac: ApplicantDacEntity;
      const newValue = !applicatDacItem?.value;

      // When checking the box, default to today's date if no date exists
      const dateValue = newValue && !applicatDacItem?.details
        ? new Date().toISOString().split('T')[0]
        : applicatDacItem?.details || null;

      if (applicatDacItem?.id) {
        // Update existing item
        dac = await applicantApi.dac.update(entity.id, applicatDacItem.id, {
          ...applicatDacItem,
          value: newValue,
          details: dateValue,
        });
        entity.dac = entity.dac.filter((v) => v.id != dac.id);
      } else {
        // Create new item
        dac = await applicantApi.dac.create(entity.id, {
          type,
          value: newValue,
          details: dateValue,
        });
      }

      entity.dac.push(dac);
      toast.success(t("Successfully updated checklist"));
      setEntity?.({ ...entity });
    } catch (e) {
      globalAjaxExceptionHandler(e, { toast: toast, t: t });
    }
  };

  const handleDateChange = async (
    type: string,
    applicatDacItem: ApplicantDacEntity,
    newDate: string
  ) => {
    try {
      if (!applicatDacItem?.id) return;

      const dac = await applicantApi.dac.update(entity.id, applicatDacItem.id, {
        ...applicatDacItem,
        details: newDate,
      });

      entity.dac = entity.dac.filter((v) => v.id != dac.id);
      entity.dac.push(dac);
      toast.success(t("Successfully updated date"));
      setEntity?.({ ...entity });
    } catch (e) {
      globalAjaxExceptionHandler(e, { toast: toast, t: t });
    }
  };

  // Get union of global template items and items that have data for this applicant
  const globalItems = companyDaclist?.value || [];
  const applicantItemsWithData = (entity?.dac || []).map(d => d.type);
  const allItems = [...new Set([...globalItems, ...applicantItemsWithData])];

  const sectionActions = !readOnly ? (
    <Button variant="link" className="p-0" size="sm" onClick={() => setEditChecklistItems(!editChecklistItems)}>
      {editChecklistItems ? t("Cancel") : t("Edit Checklist Items")}
    </Button>
  ) : null;

  if (editChecklistItems) {
    return (
      <Section title="Application Checklist" actions={sectionActions}>
        <CompanyPreferencesDacForm
          className="m-5"
          companyDaclist={companyDaclist}
          onSaveComplete={(newDac: CompanyPreferenceEntity) => {
            setCompanyOnboardingPreferences([
              ...companyOnboardingPreferences?.filter(
                (v) =>
                  v.label !==
                  CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DAC
              ),
              newDac,
            ]);
            setEditChecklistItems(false);
          }}
        />
      </Section>
    );
  }

  return (
    <Section title="Application Checklist" actions={sectionActions}>
      {allItems.length === 0 ? (
        <div className="text-muted text-center py-4">
          {t("No checklist items configured. Click 'Edit Checklist Items' to add items.")}
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th style={{ width: "50px" }}></th>
              <th>{t("Title")}</th>
              <th className="text-center" style={{ width: "200px" }}>{t("Date")}</th>
            </tr>
          </thead>
          <tbody>
            {allItems.map((companyDacItemType: string) => {
              const applicatDacItem: ApplicantDacEntity = entity?.dac?.find(
                (v) => v.type == companyDacItemType
              );
              const isHistorical = !globalItems.includes(companyDacItemType);
              const isChecked = !!applicatDacItem?.value;

              return (
                <tr key={companyDacItemType}>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={isChecked}
                      disabled={readOnly}
                      onChange={() => handleCheckboxToggle(companyDacItemType, applicatDacItem)}
                    />
                  </td>
                  <td>
                    {companyDacItemType}
                    {isHistorical && (
                      <span className="badge bg-warning text-dark ms-2" title={t("This item was removed from the global template but data is preserved")}>
                        {t("Historical")}
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    {isChecked ? (
                      <Form.Control
                        type="date"
                        value={applicatDacItem?.details || ''}
                        disabled={readOnly}
                        onChange={(e) => handleDateChange(companyDacItemType, applicatDacItem, e.target.value)}
                        style={{ maxWidth: "180px", margin: "0 auto" }}
                      />
                    ) : (
                      <span className="text-muted font-italic">{t(`—`)}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Section>
  );
}


