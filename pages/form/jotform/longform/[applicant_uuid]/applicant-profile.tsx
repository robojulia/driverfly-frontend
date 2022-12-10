import { useState } from "react";
import { Container } from "react-bootstrap";
import { Col, Row } from "reactstrap";
import ApplicantConsiderFor from "../../../../../components/applicants/applicant-consider-for";
import ApplicantJobsApplied from "../../../../../components/applicants/applicant-jobs-applied";
import ApplicantSafetyBackground from "../../../../../components/applicants/applicant-safety-background";
import ViewApplicantDetail from "../../../../../components/applicants/applicant-view-details";
import ApplicantWorkHistory from "../../../../../components/applicants/applicant-work-history";
import PageLayout from "../../../../../components/layouts/page/page-layout";
import ViewCard from "../../../../../components/view-details/view-card";
import ViewPdf from "../../../../../components/view-details/view-pdf";
import ViewTable from "../../../../../components/view-details/view-table";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../../models/applicant";
import ApplicantApi from "../../../../api/applicant";
import DocumentApi from "../../../../api/document";

export interface LongFormProps {
  entity: ApplicantEntity;
}

export default function Dashboard({ entity }: LongFormProps) {
  const { t } = useTranslation();
  const [pdf, setPdf] = useState({});
  const viewDocumentClick = async (id, name) => {
    const api = new DocumentApi();

    const document = await api.getSignedUrl(entity.id);

    if (document) {
      setPdf({
        name: `${t(name)} (${document.name})`,
        url: document.path,
      });
    }
  };
  return (
    <div className="pt-4 ">
      <PageLayout>
        <Container>
          <Row className="text-center">
            <h1>{t("APPLICANT_PROFILE")}</h1>
          </Row>
          <Row >
            <ViewApplicantDetail applicant={entity} />
          </Row>
          <Row className="p-0">
              <Col md="4" className="pl-0"> 
                <ApplicantWorkHistory applicant={entity} />
              </Col>
              <Col md="8" className="pr-0">
                <ApplicantSafetyBackground applicant={entity} />
              </Col>
            </Row>
          <Row>
            <ViewCard title="UPLOADED_DOCUMENTS">
              <ViewTable
                type="DOCUMENTS"
                headers={{
                  type: "TYPE",
                  document: "DOCUMENT",
                  date_added: "DATE_ADDED",
                }}
                items={entity?.documents?.map((document) => ({
                  type: t(`ApplicantDocumentType.${document.type}`),
                  document: (
                    <a
                      onClick={() =>
                        viewDocumentClick(document.id, document.name)
                      }
                      href="#"
                    >
                      {document.name}
                    </a>
                  ),
                  date_added: new Date(document.created_at).toDateString(),
                }))}
              />
            </ViewCard>
            <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
          </Row>
        </Container>
      </PageLayout>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  try {
    const { applicant_uuid } = query || {};

    if (!!!applicant_uuid) return { notFound: true };

    const applicantApi = new ApplicantApi();
    const entity: ApplicantEntity = await applicantApi.getByUuidToken(
      applicant_uuid
    );

    if (!!!entity) return { notFound: true };

    return { props: { entity } };
  } catch (error) {
    return { notFound: true };
  }
}
