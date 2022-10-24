import FullLayout from "../../../components/dashboard/layouts/layout/full-layout";
import { Col, Row } from "reactstrap";
import PageLayout from "../../../components/layouts/page/page-layout";
import { ApplicantPieChart } from "../../../components/charts/company/applicant-pipeline-chart";
import { ApplicantsPerRecruiterChart } from "../../../components/charts/company/applicants-per-recruiter-chart";
import { TotalApplicantBarChart } from "../../../components/charts/company/total-applicants-bar-chart";

import { useAuth } from "../../../hooks/use-auth";
import { PieChart } from "../../../components/charts/pie-chart";

export default function Dashboard() {

    const { hasPermission } = useAuth();

    return (
        <PageLayout
            title="COMPANY_PROFILE_DASHBOARD"
        >
            <Row>
                {
                    hasPermission("CanViewApplicant") &&
                    <>
                        <Row className="my_chart">
                            <Col md="6" className="p-0" >
                                <ApplicantPieChart />
                            </Col>
                            <Col md="6" className="p-0" >
                                <ApplicantsPerRecruiterChart />
                            </Col>
                            <Col md="12"  className="mt-5 p-0">
                                <TotalApplicantBarChart />
                            </Col>
                        </Row>
                    </>
                }
            </Row>

        </PageLayout>
    )
};

Dashboard.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
