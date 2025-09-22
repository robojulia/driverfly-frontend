import { useRouter } from "next/router";
import { Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ViewSuggestedJobs from "../../applicants/view-suggested-jobs";
import { ApplicantAlreadyWorkedForm } from "./applicant-already-worked-form";
import { ApplicantBasicDetailsForm } from "./applicant-basic-details-form";
import { ApplicantDocumentsViewerForm } from "./applicant-documents-viewer-form";
import { ApplicantEquipmentExperienceForm } from "./applicant-equipment-experience-form";
import { ApplicantJobsAppliedForm } from "./applicant-jobs-applied-form";
import { ApplicantSafetyBackgroundForm } from "./applicant-safety-background-form";
import { ApplicantSignedAgreementsForm } from "./applicant-signed-agreements-form";
import { ApplicantUploadedDocumentsForm } from "./applicant-uploaded-documents-form";
import { ApplicantVehicleAssiigedForm } from "./applicant-vehicle-assiged-form";
import { ApplicantWorkHistoryForm } from "./applicant-work-history-form";
import { BaseFormProps } from "./base-form-props";
import { HireApplicantForm } from "./hire-applicant-form";
import SSNDisplay from "../../shared/SSNDisplay";
import ViewCard from "../../view-details/view-card";
import CompanyApi from "../../../pages/api/company";
import ApplicantApi from "../../../pages/api/applicant";
import { toast } from "react-toastify";
import { ApplicantExtras as ApplicantExtrasEnum } from "../../../enums/applicants/applicant-extras.enum";
import { useFeatureFlag } from "../../../context/feature-flag-context";

export interface EditApplicantFormProps extends BaseFormProps<ApplicantEntity> {
  isSubmitting: boolean;
  setIsSubmitting(value: boolean): void;
}

export function EditApplicantForm(props: EditApplicantFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const showDotVerification = useFeatureFlag('DOT_VERIFICATION_RESULTS');
  const routeToApplicants = () => router.push("/dashboard/company/applicants");
  return (
    <>
      <Row className="px-2">
        <Col xs="12" className="text-end">
          <HireApplicantForm
            entity={props?.entity}
            className={props?.className}
          />
          <Button
            type="button"
            className={`btn theme-general-btn mr-2`}
            onClick={() => routeToApplicants()}
          >
            {t("BACK")}
          </Button>
        </Col>
      </Row>
      <Row className="px-2">
        <ApplicantBasicDetailsForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
        />
      </Row>
      {/* DOT Verification Results (Owner Operator only) */}
      {props?.entity?.is_owner_operator && showDotVerification && (
        <Row className="px-2 mt-2">
          <Col md="12">
            <ViewCard title="DOT Verification Results">
              <div className="d-flex justify-content-between align-items-start flex-wrap">
                <div className="mb-2" style={{ minWidth: 240 }}>
                  {(() => {
                    const tokens: string[] =
                      (props?.entity?.extras?.find((e: any) => e.type === ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS)?.value as string[]) || [];

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

                    if (!tokens.length) {
                      return <div className="text-muted">No results yet</div>;
                    }

                    return (
                      <div>
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
                        toast.success("DOT verification refreshed");
                      } catch (e) {
                        toast.error("Failed to refresh DOT verification");
                      }
                    }}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </ViewCard>
          </Col>
        </Row>
      )}
      <Row className="px-2">
        <Col md="6">
          <ApplicantEquipmentExperienceForm
            isSubmitting={props?.isSubmitting}
            setIsSubmitting={props?.setIsSubmitting}
            entity={props?.entity}
            className={props?.className}
            setEntity={props?.setEntity}
          />
        </Col>
        <Col md="6">
          <ApplicantVehicleAssiigedForm
            entity={props?.entity}
            isSubmitting={props?.isSubmitting}
            setIsSubmitting={props?.setIsSubmitting}
            className={props?.className}
            setEntity={props?.setEntity}
          />
        </Col>
      </Row>
      <Row className="px-2">
        <Col md="6">
          <ApplicantWorkHistoryForm
            entity={props?.entity}
            isSubmitting={props?.isSubmitting}
            setIsSubmitting={props?.setIsSubmitting}
            className={props?.className}
            setEntity={props?.setEntity}
          />
        </Col>
        <Col md="6">
          <ApplicantAlreadyWorkedForm
            entity={props?.entity}
            isSubmitting={props?.isSubmitting}
            setIsSubmitting={props?.setIsSubmitting}
            className={props?.className}
            setEntity={props?.setEntity}
          />
        </Col>
      </Row>
      <Row className="px-2">
        <ApplicantSafetyBackgroundForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
        />
      </Row>
      {/*
      <Row className="px-2">
        <ApplicantDocumentsViewerForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
        />
      </Row>
      */}
      <Row className="px-2">
        <ApplicantSignedAgreementsForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
        />
      </Row>
      <Row className="px-2">
        <ApplicantUploadedDocumentsForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
        />
      </Row>
      <Row className="px-2">
        <ApplicantJobsAppliedForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
          onSaveComplete={props?.onSaveComplete}
        />
      </Row>
      {Boolean(props?.entity?.id) && (
        <Row className="mt-2">
          <Col md="12">
            <ViewSuggestedJobs applicant={props?.entity} />
          </Col>
        </Row>
      )}
    </>
  );
}
