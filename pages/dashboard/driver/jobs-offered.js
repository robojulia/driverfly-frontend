import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import { Col, Row, Card, CardBody, Table } from "reactstrap";
import useRedirect from '../../../hooks/useRedirect';
import { Container } from "react-bootstrap";
import style from '../../../public/dashboard/styles/css/Driver/dashboard.module.css';
import { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import axios from "axios";
import JobList from "../../../public/dashboard/styles/css/JobList.module.css"
import Link from 'next/link';
import ApplicantApi from '../../api/applicant';
import { ApplicantStatus } from '../../../enums/applicants/applicant-status.enum';
import { useTranslation } from "../../../hooks/useTranslation";
import { CurrencyDollar } from 'react-bootstrap-icons';
import ShowEnumFromString from '../../../components/enum-filters/show-enum-from-string';
import { DriverLicenseType } from '../../../enums/users/driver-license-type.enum';
import ViewDataTable from '../../../components/viewDetails/viewDataTable';
import OverlyPopover from '../../../components/popover/overly-popover';
import { buildAddress } from '../../../utils/common';
import { JobDeliveryType } from '../../../enums/jobs/job-delivery-type.enum';

export default function OfferedJobs() {

    const { authDriver } = useRedirect();
    authDriver()
    const { t } = useTranslation();
    const { authCheck } = useAuth();
    const user = authCheck();
    const applicantApi = new ApplicantApi();

    const [applicantJobs, setApplicantJobs] = useState([])

    const fetchJobs = () => {

        applicantApi.getApplicantJobsByStatus({
            application_status: ApplicantStatus.HIRED
        })
            .then(data => {
                console.log("data", data);

                setApplicantJobs(data)
            })
            .catch(function (error) {

            }).then(function () {

            })
    }

    useEffect(() => {
        fetchJobs()
    }, []);

    // useEffect(() => {
    //     console.log("applicantJobs", applicantJobs)
    // }, [applicantJobs]);

    return (
        <>

            <div className={JobList.joblisting}>
                <Row className={JobList.link}>
                    <Col sm="6" lg="8">
                        <h2 className='mt-3'>{t('jobs_offered')}</h2>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col lg="12 ">
                        <ViewDataTable
                            columns={[
                                {
                                    name: "job_title",
                                    selector: applicant =>
                                        (<OverlyPopover skipTranslate={true} header={t('job_title')} str={applicant.job.title} />),
                                    hidable: false
                                },
                                {
                                    name: "company",
                                    selector: applicant => applicant.company?.name || null
                                },
                                {
                                    name: "location",
                                    selector: applicant =>
                                        (<OverlyPopover skipTranslate={true} header={t('location')} str={buildAddress(applicant.job.location || {})} />)
                                },
                                {
                                    name: "drivers_needed",
                                    selector: applicant => applicant.job.drivers_needed
                                },
                                {
                                    name: "est_pay_per_week",
                                    selector: applicant =>
                                        (<OverlyPopover skipTranslate={true} header={t('est_pay_per_week')} str={`${applicant.job.min_weekly_pay ? applicant.job.min_weekly_pay : 0} - ${applicant.job.max_weekly_pay ? applicant.job.max_weekly_pay : 0} ${t('per_week')}`} icon={< CurrencyDollar className='mr-1' />} />)
                                },
                                {
                                    name: "LICENSE_TYPE",
                                    selector: applicant =>
                                    (<ShowEnumFromString
                                        popover_header={t('LICENSE_TYPE')}
                                        labelPrefix="DriverLicenseType"
                                        popover={true}
                                        str={applicant.job.cdl_class}
                                        enumArray={DriverLicenseType} />)
                                },
                                {
                                    name: "DATE_HIRED",
                                    selector: applicant =>
                                        applicant.last_updated_at ?
                                            (<OverlyPopover skipTranslate={true} header={t('DATE_HIRED')} str={new Date(applicant.last_updated_at).toDateString()} />)
                                            : null
                                },
                                {
                                    name: "expiration_date",
                                    selector: applicant =>
                                        applicant.job.expiry_date ?
                                            (<OverlyPopover skipTranslate={true} header={t('expiration_date')} str={new Date(applicant.job.expiry_date).toDateString()} />)
                                            : null
                                },
                                {
                                    name: "schedule",
                                    selector: applicant =>
                                        (<OverlyPopover labelPrefix="JobSchedule" skipTranslate={false} header={t('schedule')} str={applicant.job.schedule} />),
                                },
                                {
                                    name: "employment_type",
                                    selector: applicant =>
                                        (<OverlyPopover labelPrefix="JobEmploymentType" skipTranslate={false} header={t('employment_type')} str={applicant.job.employment_type} />),
                                },
                                {
                                    name: "delivery_type",
                                    selector: applicant =>
                                    (<ShowEnumFromString
                                        popover_header={t('delivery_type')}
                                        labelPrefix="JobDeliveryType"
                                        popover={true}
                                        str={applicant.job.delivery_type}
                                        enumArray={JobDeliveryType} />
                                    )
                                },
                                {
                                    name: "team_drivers",
                                    selector: applicant =>
                                        (<OverlyPopover labelPrefix="JobTeamDriver" skipTranslate={false} header={t('team_drivers')} str={applicant.job.team_drivers} />),
                                },
                            ]}
                            items={applicantJobs}
                        />
                    </Col>
                </Row>
            </div>

        </>
    )
};

OfferedJobs.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
