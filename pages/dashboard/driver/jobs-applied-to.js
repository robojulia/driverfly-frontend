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

export default function JobsAppliedTo() {

    const { authDriver } = useRedirect();

    authDriver()
    const { authCheck } = useAuth();

    const { t } = useTranslation();
    const user = authCheck();
    const applicantApi = new ApplicantApi();

    const [applicantJobs, setApplicantJobs] = useState([])

    const fetchJobs = () => {

        applicantApi.getApplicantJobsByStatus({
            application_status: ApplicantStatus.APPLIED
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
                        <h2 className='mt-3'>{t('applied_jobs')}</h2>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col lg="12 ">

                        <CardBody className={JobList.jobtable}>
                            <div className="table-responsive">
                                <Table striped>
                                    <thead className="listing_head">
                                        <tr>
                                            <th>{t('job_title')}</th>
                                            <th>{t('company')}</th>
                                            <th>{t('DATE_APPLIED')}</th>
                                            <th>{t('LICENSE_TYPE')}</th>
                                            <th>{t('est_pay_per_week')}</th>
                                            <th>{t('pay_method')}</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!applicantJobs || !applicantJobs.length &&
                                            <tr>
                                                <td colSpan={11}>
                                                    {t("NO_{name}_FOUND", { name: t("JOBS") })}
                                                </td>
                                            </tr>
                                        }

                                        {applicantJobs && applicantJobs.map((application, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {application.job.title}
                                                </td>
                                                <td>
                                                    {application.company.name}
                                                </td>
                                                <td>
                                                    {new Date(application.created_at).toDateString()}
                                                </td>
                                                <td>
                                                    {
                                                        <ShowEnumFromString
                                                            popover_header={t('LICENSE_TYPE')}
                                                            labelPrefix="DriverLicenseType"
                                                            popover={true}
                                                            str={application.job.cdl_class}
                                                            enumArray={DriverLicenseType} />
                                                    }
                                                    {/* {t(`ApplicantStatus.${application.status}`)} */}
                                                </td>
                                                <td>
                                                    <p>
                                                        < CurrencyDollar className='mr-1' />{application.job.min_weekly_pay ? application.job.min_weekly_pay : 0} - {application.job.max_weekly_pay ? application.job.max_weekly_pay : 0} per week
                                                    </p>
                                                </td>
                                                <td>
                                                    {
                                                        (application.job.pay_method && t(`JobPayMethod.${application.job.pay_method}`))
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>


                    </Col>
                </Row>
            </div>

        </>
    )
};

JobsAppliedTo.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
