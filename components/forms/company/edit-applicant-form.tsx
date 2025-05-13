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

export interface EditApplicantFormProps extends BaseFormProps<ApplicantEntity> {
  isSubmitting: boolean;
  setIsSubmitting(value: boolean): void;
}

export function EditApplicantForm(props: EditApplicantFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
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
