import { Button, Col, Row } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { BaseFormProps } from "./base-form-props";
import { ApplicantBasicDetailsFormNew } from "./applicant-basic-details-form-new";
import { ApplicantWorkHistoryForm } from "./applicant-work-history-form";
import { ApplicantEquipmentExperienceForm } from "./applicant-equipment-experience-form";
import { ApplicantSafetyBackgroundForm } from "./applicant-safety-background-form";
import { ApplicantUploadedDocumentsForm } from "./applicant-uploaded-documents-form";
import { ApplicantSignedAgreementsForm } from "./applicant-signed-agreements-form";
import { HireApplicantForm } from "./hire-applicant-form";
import ViewCard from "../../view-details/view-card";
import CompanyApi from "../../../pages/api/company";
import ApplicantApi from "../../../pages/api/applicant";
import { toast } from "react-toastify";
import { ApplicantExtras as ApplicantExtrasEnum } from "../../../enums/applicants/applicant-extras.enum";
import { useFeatureFlag } from "../../../context/feature-flag-context";

export interface EditApplicantFormNewProps extends BaseFormProps<ApplicantEntity> {
  isSubmitting: boolean;
  setIsSubmitting(value: boolean): void;
}

export function EditApplicantFormNew(props: EditApplicantFormNewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const routeToApplicants = () => router.push("/dashboard/company/applicants");
  const showDotVerification = useFeatureFlag('DOT_VERIFICATION_RESULTS');
  const [dotVerifyRaw, setDotVerifyRaw] = useState<any>(null);

  return (
    <>
      {/* Header actions */}
      <Row className="px-2">
        <Col xs="12" className="text-end">
          <HireApplicantForm entity={props?.entity} className={props?.className} />
          <Button
            type="button"
            className={`btn theme-general-btn mr-2`}
            onClick={() => routeToApplicants()}
          >
            {t("BACK")}
          </Button>
        </Col>
      </Row>

      {/* Basic information, contact, address, licensing, preferences, emergency contact, notes */}
      <Row className="px-2">
        <ApplicantBasicDetailsFormNew
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
          afterLicensing={(
            <>
              {props?.entity?.is_owner_operator && showDotVerification && (
                <ViewCard title="DOT Lookup Results">
                  <div className="d-flex justify-content-between align-items-start flex-wrap">
                {(() => {
                  const tokens: string[] =
                    (props?.entity?.extras?.find((e: any) => e.type === ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS)?.value as string[]) || [];
                  if (!tokens.length) return null;
                  const checks = [
                    { key: "EMAIL", label: "Email" },
                    { key: "PHONE", label: "Phone" },
                    { key: "STREET_ADDRESS", label: "Street address" },
                    { key: "CITY", label: "City" },
                    { key: "STATE", label: "State" },
                    { key: "ZIP_CODE", label: "ZIP code" },
                  ];
                  const getStatus = (k: string): boolean | null => {
                    if (tokens.includes(`${k}_SUCCESS`)) return true;
                    if (tokens.includes(`${k}_FAIL`)) return false;
                    return null;
                  };
                  return (
                    <div className="mb-2" style={{ minWidth: 240 }}>
                      {checks.map(({ key, label }) => {
                        const status = getStatus(key);
                        return (
                          <div key={key} className="d-flex align-items-center mb-1">
                            <div style={{ width: 140 }}>{label}</div>
                            {status === true && (
                              <span className="badge bg-success">Match</span>
                            )}
                            {status === false && (
                              <span className="badge bg-danger">No match</span>
                            )}
                            {status === null && (
                              <span className="badge bg-secondary">Unknown</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
                    <div style={{ flex: 1, minWidth: 280 }} className="text-start">
                      <div>
                    {(() => {
                      if (!dotVerifyRaw) return null;
                      const data: any = (dotVerifyRaw as any)?.records ?? dotVerifyRaw;
                      const records: any[] = Array.isArray(data) ? data : [data];
                      const join = (parts: Array<string | undefined | null>, sep: string) =>
                        parts.filter((p) => Boolean(p && String(p).trim().length)).map((p) => String(p)).join(sep);
                      const toTitleCase = (value?: string) => {
                        if (!value) return value;
                        const cased = String(value)
                          .toLowerCase()
                          .replace(/\b([a-z])(\w*)/g, (_: any, a: string, b: string) => a.toUpperCase() + b);
                        return cased.replace(/ Llc\b/g, ' LLC');
                      };
                      const formatCountry = (value?: string) => {
                        if (!value) return value;
                        const raw = String(value).trim();
                        const normalized = raw.toUpperCase().replace(/\./g, '');
                        if (normalized === 'US' || normalized === 'USA' || normalized === 'UNITED STATES' || normalized === 'UNITED STATES OF AMERICA') {
                          return 'United States of America';
                        }
                        return raw.toUpperCase();
                      };
                      const formatPhone = (value?: string) => {
                        if (!value) return value;
                        const raw = String(value);
                        const digitsOnly = raw.replace(/\D/g, '');
                        const normalized = digitsOnly.length === 11 && digitsOnly.startsWith('1') ? digitsOnly.slice(1) : digitsOnly;
                        if (normalized.length === 10) {
                          const area = normalized.slice(0, 3);
                          const exchange = normalized.slice(3, 6);
                          const line = normalized.slice(6);
                          return `(${area}) ${exchange}-${line}`;
                        }
                        if (normalized.length === 7) {
                          return `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
                        }
                        return raw;
                      };
                      return (
                        <div>
                          {records.map((rec: any, idx: number) => {
                            const phyCityStateZip = join([
                              toTitleCase(rec?.phy_city),
                              join([String(rec?.phy_state || '').toUpperCase(), rec?.phy_zip], ' '),
                            ], ', ');
                            const mailingCityStateZip = join([
                              toTitleCase(rec?.carrier_mailing_city),
                              join([String(rec?.carrier_mailing_state || '').toUpperCase(), rec?.carrier_mailing_zip], ' '),
                            ], ', ');
                            const phyStreet = toTitleCase(rec?.phy_street);
                            const phyCountryDisplay = formatCountry(rec?.phy_country);
                            const addressString = join([
                              phyStreet,
                              phyCityStateZip,
                              phyCountryDisplay,
                            ], ', ');
                            const mailingStreet = toTitleCase(rec?.carrier_mailing_street);
                            const mailingCountryDisplay = formatCountry(rec?.carrier_mailing_country);
                            const mailingAddressString = join([
                              mailingStreet,
                              mailingCityStateZip,
                              mailingCountryDisplay,
                            ], ', ');
                            const areAddressesIdentical = Boolean(addressString) && Boolean(mailingAddressString) && addressString === mailingAddressString;
                            return (
                              <div key={idx} className="mb-2">
                                <div className="fw-semibold">Company Name</div>
                                <div className="mb-1">{toTitleCase(rec?.legal_name) ?? ''}</div>
                                <div className="fw-semibold">Address</div>
                                <div className="mb-1">
                                  {phyStreet && <div>{phyStreet}</div>}
                                  {phyCityStateZip && <div>{phyCityStateZip}</div>}
                                  {phyCountryDisplay && <div>{phyCountryDisplay}</div>}
                                </div>
                                {!areAddressesIdentical && mailingAddressString && (
                                  <>
                                    <div className="fw-semibold">Mailing Address</div>
                                    <div className="mb-1">
                                      {mailingStreet && <div>{mailingStreet}</div>}
                                      {mailingCityStateZip && <div>{mailingCityStateZip}</div>}
                                      {mailingCountryDisplay && <div>{mailingCountryDisplay}</div>}
                                    </div>
                                  </>
                                )}
                                <div className="fw-semibold">Phone</div>
                                <div className="mb-1">{formatPhone(rec?.phone) ?? ''}</div>
                                <div className="fw-semibold">Email Address</div>
                                <div>{rec?.email_address ?? ''}</div>
                                {idx < records.length - 1 && <hr className="my-2" />}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                      </div>
                    </div>
                    <div>
                      <Button
                        type="button"
                        onClick={async () => {
                          try {
                            const companyApi = new CompanyApi();
                            const applicantApi = new ApplicantApi();
                            const dot_number = props?.entity?.extras?.find((e: any) => e.type === ApplicantExtrasEnum.DOT_NUMBER)?.value;
                            const business_name = props?.entity?.extras?.find((e: any) => e.type === ApplicantExtrasEnum.BUSINESS_NAME)?.value;
                            if (!dot_number) return toast.error("DOT number not found");
                            const tokens = await companyApi.dotVerify({
                              dot_number,
                              email: props?.entity?.email,
                              phone: props?.entity?.phone,
                              address_1: (props?.entity as any)?.address_1 || (props?.entity as any)?.street,
                              city: props?.entity?.city,
                              state: props?.entity?.state,
                              zip_code: props?.entity?.zip_code,
                              business_name,
                            });
                            setDotVerifyRaw(tokens);
                            const newTokens = Array.isArray(tokens) && tokens.length ? tokens[0] : [];
                            const others = (props?.entity?.extras || []).filter((e: any) => e.type !== ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS);
                            const updated = {
                              type: ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS,
                              value: newTokens,
                            } as any;
                            const newExtras = [...others, updated];
                            const saved = await applicantApi.update(
                              props?.entity?.id,
                              {
                                first_name: props?.entity?.first_name,
                                last_name: props?.entity?.last_name,
                                accident_history: (props?.entity as any)?.accident_history,
                                moving_violation_history: (props?.entity as any)?.moving_violation_history,
                                extras: newExtras,
                              } as any,
                            );
                            props?.setEntity?.({ ...saved });
                            toast.success("DOT Number Lookup Successful");
                          } catch (e) {
                            toast.error("Failed to refresh DOT verification");
                          }
                        }}
                      >
                        Lookup
                      </Button>
                    </div>
                  </div>
                </ViewCard>
              )}
            </>
          )}
        />
      </Row>

      {/* Previous employment */}
      <Row className="px-2">
        <ApplicantWorkHistoryForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
        />
      </Row>

      {/* Equipment experience */}
      <Row className="px-2">
        <ApplicantEquipmentExperienceForm
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          entity={props?.entity}
          className={props?.className}
          setEntity={props?.setEntity}
        />
      </Row>

      {/* Safety background */}
      <Row className="px-2">
        <ApplicantSafetyBackgroundForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
        />
      </Row>

      {/* Uploaded documents */}
      <Row className="px-2">
        <ApplicantUploadedDocumentsForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
        />
      </Row>

      {/* Application checklist (agreements/safety performance) */}
      <Row className="px-2">
        <ApplicantSignedAgreementsForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
        />
      </Row>
    </>
  );
}


