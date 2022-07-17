import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import { Col, Row, Card, CardBody, Table } from "reactstrap";
import { useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";
import JobList from "../../../public/dashboard/styles/css/JobList.module.css"
import Link from 'next/link';
import ApplicantApi from '../../api/applicant';
import { ApplicantStatus } from '../../../enums/applicants/applicant-status.enum';
import { useTranslation } from "../../../hooks/useTranslation";
import { CurrencyDollar } from 'react-bootstrap-icons';
import ShowEnumFromString from '../../../components/enum-filters/show-enum-from-string';
import { DriverLicenseType } from '../../../enums/users/driver-license-type.enum';
import ViewDataTable, { getDataTableColumnKey } from '../../../components/viewDetails/viewDataTable';
import OverlyPopover from '../../../components/popover/overly-popover';
import { buildAddress } from '../../../utils/common';
import { JobDeliveryType } from '../../../enums/jobs/job-delivery-type.enum';
import useStorage from '../../../hooks/useStorage';

export default function OfferedJobs() {

    const { t } = useTranslation();
    const applicantApi = new ApplicantApi();
    const { user } = useAuth();
    const columnSettingKey = getDataTableColumnKey("driver", user, "jobs-offered");
    const [applicantJobs, setApplicantJobs] = useState([])

    useEffect(async () => {
        if (user) {
            const data = await applicantApi.getApplicantJobsByStatus({
                application_status: ApplicantStatus.HIRED
            })

            setApplicantJobs(data);
    
        }
    }, []);

    return (
        <div className={JobList.joblisting}>
            <Row>
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
                                (<Link href={`/dashboard/driver/find-jobs/${applicant.job.id}`}>
                                    < a>
                                        <OverlyPopover skipTranslate={true} header={t('job_title')} str={applicant.job.title} />
                                    </a>
                                </Link>),
                                hidable: false

                            },
                            {
                                name: "company",
                                selector: applicant => applicant.company?.name || null,
                                hide: (!!columnHistory.company?.hide),
                            },
                            {
                                name: "location",
                                selector: applicant =>
                                    (<OverlyPopover skipTranslate={true} header={t('location')} str={buildAddress(applicant.job.location || {})} />),
                                hide: (!!columnHistory.location?.hide),
                            },
                            {
                                name: "drivers_needed",
                                selector: applicant => applicant.job.drivers_needed,
                                hide: (!!columnHistory.drivers_needed?.hide),
                            },
                            {
                                name: "est_pay_per_week",
                                selector: applicant =>
                                    (<OverlyPopover skipTranslate={true} header={t('est_pay_per_week')} str={`${applicant.job.min_weekly_pay ? applicant.job.min_weekly_pay : 0} - ${applicant.job.max_weekly_pay ? applicant.job.max_weekly_pay : 0} ${t('per_week')}`} icon={< CurrencyDollar className='mr-1' />} />),
                                hide: (!!columnHistory.est_pay_per_week?.hide),
                            },
                            {
                                name: "LICENSE_TYPE",
                                selector: applicant =>
                                (<ShowEnumFromString
                                    popover_header={t('LICENSE_TYPE')}
                                    labelPrefix="DriverLicenseType"
                                    popover={true}
                                    str={applicant.job.cdl_class}
                                    enumArray={DriverLicenseType} />),
                                hide: (!!columnHistory.LICENSE_TYPE?.hide),
                            },
                            {
                                name: "DATE_HIRED",
                                selector: applicant =>
                                    applicant.last_updated_at ?
                                        (<OverlyPopover skipTranslate={true} header={t('DATE_HIRED')} str={new Date(applicant.last_updated_at).toDateString()} />)
                                        : null,
                                hide: (!!columnHistory.DATE_HIRED?.hide),
                            },
                            {
                                name: "expiration_date",
                                selector: applicant =>
                                    applicant.job.expiry_date ?
                                        (<OverlyPopover skipTranslate={true} header={t('expiration_date')} str={new Date(applicant.job.expiry_date).toDateString()} />)
                                        : null,
                                hide: (!!columnHistory.expiration_date?.hide),
                            },
                            {
                                name: "SCHEDULE",
                                selector: applicant =>
                                    (<OverlyPopover labelPrefix="JobSchedule" skipTranslate={false} header={t('SCHEDULE')} str={applicant.job.schedule} />),
                                hide: (!!columnHistory.SCHEDULE?.hide),
                            },
                            {
                                name: "EMPLOYMENT_TYPE",
                                selector: applicant =>
                                    (<OverlyPopover labelPrefix="JobEmploymentType" skipTranslate={false} header={t('EMPLOYMENT_TYPE')} str={applicant.job.employment_type} />),
                                hide: (!!columnHistory.EMPLOYMENT_TYPE?.hide),
                            },
                            {
                                name: "DELIVERY_TYPE",
                                selector: applicant =>
                                (<ShowEnumFromString
                                    popover_header={t('DELIVERY_TYPE')}
                                    labelPrefix="JobDeliveryType"
                                    popover={true}
                                    str={applicant.job.delivery_type}
                                    enumArray={JobDeliveryType} />
                                ),
                                hide: (!!columnHistory.DELIVERY_TYPE?.hide),
                            },
                            {
                                name: "TEAM_DRIVERS",
                                selector: applicant =>
                                    (<OverlyPopover labelPrefix="JobTeamDriver" skipTranslate={false} header={t('TEAM_DRIVERS')} str={applicant.job.team_drivers} />),
                                hide: (!!columnHistory.TEAM_DRIVERS?.hide),
                            },
                        ]}
                        items={applicantJobs}
                        columnSettingKey={columnSettingKey}
                    />
                </Col>
            </Row>
        </div>
    )
};

OfferedJobs.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
