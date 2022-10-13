import FullLayout from "../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row } from "reactstrap";
import PageLayout from "../../../components/layouts/page/PageLayout";
import { ApplicantPieChart } from "../../../components/charts/company/ApplicantPipelineChart";
import { ApplicantsPerRecruiterChart } from "../../../components/charts/company/ApplicantsPerRecruiterChart";
import { TotalApplicantBarChart } from "../../../components/charts/company/TotalApplicantsBarChart";

import { useAuth } from "../../../hooks/useAuth";
import { PieChart } from "../../../components/charts/PieChart";

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
