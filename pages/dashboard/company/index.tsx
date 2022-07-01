import FullLayout from "../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row } from "reactstrap";
import useRedirect from '../../../hooks/useRedirect';
import { useRouter } from 'next/router'
import PageLayout from "../../../components/layouts/PageLayout";
import { ApplicantPipelineChart } from "../../../components/charts/company/ApplicantPiplineChart";
import { ApplicantsPerRecruiterChart } from "../../../components/charts/company/ApplicantsPerRecruiterChart";
import useAuth from "../../../hooks/useAuth";

export default function Dashboard() {

    const { authCompany } = useRedirect();

    authCompany();

    const { hasPermission } = useAuth();

    return (
        <PageLayout
            title="COMPANY_PROFILE_DASHBOARD"
            >
            <Row>
                {
                    hasPermission("CanViewApplicant") && 
                    <>
                        <Col xs="6">
                            <ApplicantPipelineChart />
                        </Col>
                        <Col xs="6">
                            <ApplicantsPerRecruiterChart />
                        </Col>
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
