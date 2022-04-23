import LogoutButton from '../../../../components/buttons/Logout';
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import download from "../../../../public/dashboard/assets/images/download/download.png";
import Applicant from "../../../../public/dashboard/styles/css/Applicants.module.css"
import Link from 'next/link';
import Image from 'next/image';
import useRedirect from '../../../../hooks/useRedirect';

import { useTranslation } from 'react-i18next';

import VisibilityIcon from '@mui/icons-material/Visibility';

import { FormGroup, FormControlLabel, Switch } from '@mui/material';


import ApplicantApi from "../../../api/applicant";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { JobEquipmentType } from '../../../../enums/jobs/job-equipment-type.enum';
import { ApplicantStatus } from '../../../../enums/applicants/ApplicantStatus.enum';

import { JobEntity } from '../../../../models/job/job.entity';
import { UserEntity } from '../../../../models/user/user.entity';
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";

import ShowEnumFromString from "../../../../components/enum-filters/show-enum-from-string";

import * as numbers from "../../../../utils/number";
import { JobGeography } from '../../../../enums/jobs/job-geography.enum';
import { JobEmploymentType } from '../../../../enums/jobs/job-employment-type.enum';

const ViewMode = {
    job: "job",
    applicant: "applicant"
}

/**
 * @typedef ConsolodatedApplicant
 * @property {UserEntity} user
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} name
 * @property {string} phone
 * @property {string} email
 * @property {any} sort
 * @property {ApplicantEntity[]} jobs
 */

/**
 * @typedef ConsolodatedJob
 * @property {JobEntity} job
 * @property {string} title
 * @property {string} location
 * @property {string} geography
 * @property {string} employment_type
 * @property {string} weekly_range
 * @property {any} sort
 * @property {ApplicantEntity[]} applicants
*/


export default function Applicants() {
    const { t } = useTranslation();

    const router = useRouter();

    let { viewMode, jobId } = router.query;

    if (!ViewMode[viewMode]) viewMode = ViewMode.applicant;

    const { authCompany } = useRedirect();

    authCompany();

    const [ applicants, setApplicants ] = useState([]);

    const statuses = Object.keys(ApplicantStatus).map(k => ({
        key: k,
        label: t(`ApplicantStatus.${k}`)
    }));

    useEffect(async () => {
        if (!viewMode) return;
        const api = new ApplicantApi();

        const data = await api.company.list({
            jobId: jobId
        });

        // we need to convert the list of applicants into a consolodated body by user

        const applicantMap = {};

        let applicants = [];

        if (viewMode === ViewMode.job) {
            // job view mode flips consolodation
            data.forEach(applicant => {
                /**
                 * @type {ConsolodatedJob}
                 */
                let consolodatedJob = applicantMap[applicant.job.id];

                if (!consolodatedJob) {
                    consolodatedJob = applicantMap[applicant.job.id] = {
                        job: applicant.job,
                        title: applicant.job.title,
                        location: `${applicant.job.location.city}, ${applicant.job.location.state}`,
                        geography: applicant.job.geography,
                        employment_type: applicant.job.employment_type,
                        weekly_range: `${numbers.toCurrency(applicant.job.min_weekly_pay)} - ${numbers.toCurrency(applicant.job.max_weekly_pay)}`,
                        applicants: []
                    };
                    consolodatedJob.sort = consolodatedJob.title;
                }

                evaluateJobRequirements(applicant);
                        
                consolodatedJob.applicants.push(applicant);
            });
        }
        else {
            // applicant is the default view mode
            data.forEach(applicant => {
                /**
                 * @type {ConsolodatedApplicant}
                 */
                let consolodatedApplicant = applicantMap[applicant.user.id];

                if (!consolodatedApplicant) {
                    consolodatedApplicant = applicantMap[applicant.user.id] = {
                        user: applicant.user,
                        first_name: applicant.user.first_name || applicant.first_name,
                        last_name: applicant.user.last_name || applicant.last_name,
                        name: `${applicant.user.first_name || applicant.first_name} ${applicant.user.last_name || applicant.last_name}`.trim(),
                        phone: applicant.user.contact_number || applicant.phone,
                        email: applicant.user.email || applicant.email,
                        jobs: []
                    };

                    consolodatedApplicant.sort = consolodatedApplicant.name;
                }

                evaluateJobRequirements(applicant);
                        
                consolodatedApplicant.jobs.push(applicant);
            });
        }

        applicants = Object.values(applicantMap);

        applicants.sort((a, b) => {
            if (a.sort > b.sort) return -1;
            if (a.sort < b.sort) return 1;

            return 0;
        });

        console.log(applicants);

        setApplicants(applicants);

    }, [ viewMode, jobId ]);

    /**
     * 
     * @param {ApplicantEntity} applicant 
     */
    function evaluateJobRequirements(applicant) {
        // calculate if applicant meets basic qualifications:
        applicant.meets_basic_qualifications = true;
        applicant.qualification_fail_reason = [];

        const { job } = applicant;
        if (applicant.years_cdl_experience < job.min_years_experience) {
            applicant.meets_basic_qualifications = false;
            applicant.qualification_fail_reason.push(t("YEARS_OF_CDL_EXPERIENCE_TOO_LOW"));
        }

        if (applicant.violations_count > 0) {
            if (job.must_have_clean_mvr) {
                applicant.meets_basic_qualifications = false;
                applicant.qualification_fail_reason.push(t("DOES_NOT_HAVE_CLEAN_MVR"));
            }
            else {
                // complicated check around max violations
                // since violation count isn't specific
                // we just want to pull the max number
                // and check against that
                const mvr = job.mvr_requirements.reduce((p, c) => {
                    if (p.max_count >= c.max_count) return p;

                    return c;
                });

                if (mvr && mvr.max_count > applicant.violations_count) {
                    applicant.meets_basic_qualifications = false;
                    applicant.qualification_fail_reason.push(t("VIOLATION_COUNT_GREATER_THAN_MAX"));
                }
            }
        }

        if (!applicant.can_pass_drug_test && job.must_pass_drug_test) {
            applicant.meets_basic_qualifications = false;
            applicant.qualification_fail_reason.push(t("CANNOT_PASS_DRUG_TEST"));
        }

        job.required_skills.forEach(skill => {
            // cannot process OTHER type
            if (skill.type !== JobEquipmentType.OTHER) {
                const experience = applicant.experiences.find(v => v.type === skill.type);

                if (!experience) {
                    applicant.meets_basic_qualifications = false;
                    applicant.qualification_fail_reason.push(t("DOES_NOT_HAVE_{name}_EXPERIENCE", { name: t(`JobEquipmentType.${skill.type}`)}));
                }
                else if ( experience.years < skill.years) {
                    applicant.meets_basic_qualifications = false;
                    applicant.qualification_fail_reason.push(t("YEARS_OF_{name}_EXPERIENCE_TOO_LOW", { name: t(`JobEquipmentType.${skill.type}`)}));
                }
            }
        });
    }

    /**
     * 
     * @param {React.ChangeEvent<HTMLSelectElement>} e 
     */
    const changeStatus = async (e) => {
        const { name } = e.target;

        const value = e.target.options[e.target.selectedIndex].value;

        const api = new ApplicantApi();

        await api.company.updateStatus(name, value);

        router.replace(router.asPath);
    }

    /**
     * 
     * @param {React.MouseEvent<HTMLButtonElement>} e 
     */
    const onViewClick = (e) => {
        const { name } = e.target;

        router.push(`${router.pathname}/${name}`);
    }

    /**
     * 
     * @param {React.ChangeEvent<HTMLInputElement} e 
     */
    const onViewModeChange = async (e) => {
        const { value } = e.target;

        router.query.viewMode = value;

        setApplicants([]);

        await router.push(router);

    }

    return (
        <>

            <div>
                {/***Top Cards***/}
                <Row>
                    <h2>{t("APPLICANTS")}</h2>
                </Row>
                <div className='applicants__section mt-4'>
                    <Row>
                        <Col lg="12" className='force-overflow p-0  '>
                            <Card>
                                <CardBody className={Applicant.applicanttable}>
                                    <FormGroup style={{ float: "right" }}>
                                        <FormControlLabel
                                            control={<Switch value={viewMode === ViewMode.applicant ? ViewMode.job : ViewMode.applicant} checked={viewMode === ViewMode.applicant} onChange={onViewModeChange} />}
                                            label={t("VIEW_BY_{name}", { name: t("APPLICANT") })}
                                        />
                                        {/*checked={checked} onChange={toggleChecked}*/}
                                    </FormGroup>
                                    {viewMode === ViewMode.applicant && renderApplicantView({ applicants, onViewClick, changeStatus, statuses, t })}
                                    {viewMode === ViewMode.job && renderJobView({ jobs: applicants, onViewClick, changeStatus, statuses, t })}
                                    
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </div>
        </>
    )
};

Applicants.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}


/**
 * 
 * @param {object} props 
 * @param {ConsolodatedApplicant[]} props.applicants
 * @param {(e: React.ChangeEvent<HTMLSelectElement>) => Promise<void>} props.changeStatus
 * @param {(e: React.MouseEvent<HTMLButtonElement>) => void} props.onViewClick
 * @param {(name: string, params: object) => string} props.t
 * @param {{key: string, value: string}[]} props.statuses
 * @returns 
 */
function renderApplicantView(props) {
    const { applicants, changeStatus, onViewClick, t, statuses } = props;

    return (
    <Table bordered striped >
        <thead className={Applicant.tablheader}>
            <tr>
                <th>{t("NAME")}</th>
                <th>{t("PHONE")}</th>
                <th>{t("EMAIL")}</th>
            </tr>
        </thead>

        <tbody>
            {!applicants?.length &&
                <tr>
                    <td colSpan={3}>
                        {t("NO_{name}_FOUND", { name: t("APPLICANTS") })}
                    </td>
                </tr>
            }
            {applicants?.map(applicant => (
                <>
                <tr>
                    <td>{applicant.name}</td>
                    <td>{applicant.phone}</td>
                    <td>{applicant.email}</td>
                </tr>
                <tr>
                    <td colSpan={5}>
                        <Table bordered striped>
                            <tr>
                                <th>{t("JOB")}</th>
                                <th>{t("DATE_APPLIED")}</th>
                                <th className='text-center'>{t("STATUS")}</th>
                                <th className='text-center'>{t("MEETS_BASIC_QUALIFICATIONS")}</th>
                                <th>{t("REASONS_IF_NO")}</th>
                                <th colSpan={2}>{/** Change status */}</th>
                            </tr>
                            {applicant.jobs?.map((a, jobI) => (
                            <tr key={jobI}>
                                <td>{a.job.title}</td>
                                <td>{new Date(a.created_at).toDateString()}</td>
                                <td className='text-center'>{t(`ApplicantStatus.${a.status}`)}</td>
                                <td className='text-center'>
                                    {t(a.meets_basic_qualifications ? "YES" : "NO")}
                                </td>
                                <td>
                                    {a.qualification_fail_reason.join("<br />")}
                                </td>
                                <td>
                                    <select className={`form-select`} name={a.id} onChange={changeStatus} value="">
                                        <option>{t("CHANGE_STATUS")}</option>
                                        {statuses.map((v, i) => (<option key={i} value={v.key}>{v.label}</option>))}
                                    </select>
                                </td>
                                <td>
                                    <button className='btn' name={a.id} onClick={onViewClick}>
                                        <VisibilityIcon />
                                        {t("VIEW")}
                                    </button>
                                </td>
                            </tr>
                            ))}
                        </Table>
                    </td>
                </tr>
                </>
            ))}
        </tbody>
    </Table>

    );

}

/**
 * 
 * @param {object} props 
 * @param {ConsolodatedJob[]} props.jobs
 * @param {(e: React.ChangeEvent<HTMLSelectElement>) => Promise<void>} props.changeStatus
 * @param {(e: React.MouseEvent<HTMLButtonElement>) => void} props.onViewClick
 * @param {(name: string, params: object) => string} props.t
 * @param {{key: string, value: string}[]} props.statuses
 * @returns 
 */
 function renderJobView(props) {
    const { jobs, changeStatus, onViewClick, t, statuses } = props;

    return (
    <Table bordered striped >
        <thead className={Applicant.tablheader}>
            <tr>
                <th>{t("JOB")}</th>
                <th>{t("LOCATION")}</th>
                <th>{t("GEOGRAPHY")}</th>
                <th>{t("TYPE")}</th>
                <th>{t("WEEKLY_RANGE")}</th>
            </tr>
        </thead>

        <tbody>
            {!jobs?.length &&
                <tr>
                    <td colSpan={5}>
                        {t("NO_{name}_FOUND", { name: t("JOBS") })}
                    </td>
                </tr>
            }
            {jobs?.map(job => (
                <>
                <tr>
                    <td>{job.title}</td>
                    <td>{job.location}</td>
                    <td><ShowEnumFromString popover={true} str={job.geography} enumArray={JobGeography} /></td>
                    <td><ShowEnumFromString popover={true} str={job.employment_type} enumArray={JobEmploymentType} /></td>
                    <td>{job.weekly_range}</td>
                </tr>
                <tr>
                    <td colSpan={5}>
                        <Table bordered striped>
                            <tr>
                                <th>{t("NAME")}</th>
                                <th>{t("DATE_APPLIED")}</th>
                                <th className='text-center'>{t("STATUS")}</th>
                                <th className='text-center'>{t("MEETS_BASIC_QUALIFICATIONS")}</th>
                                <th>{t("REASONS_IF_NO")}</th>
                                <th colSpan={2}>{/** Change status */}</th>
                            </tr>
                            {job.applicants?.map((a, applicantI) => (
                            <tr key={applicantI}>
                                <td>{a.first_name} {a.last_name}</td>
                                <td>{new Date(a.created_at).toDateString()}</td>
                                <td className='text-center'>{t(`ApplicantStatus.${a.status}`)}</td>
                                <td className='text-center'>
                                    {t(a.meets_basic_qualifications ? "YES" : "NO")}
                                </td>
                                <td>
                                    {a.qualification_fail_reason.join("<br />")}
                                </td>
                                <td>
                                    <select className={`form-select`} name={a.id} onChange={changeStatus} value="">
                                        <option>{t("CHANGE_STATUS")}</option>
                                        {statuses.map((v, i) => (<option key={i} value={v.key}>{v.label}</option>))}
                                    </select>
                                </td>
                                <td>
                                    <button className='btn' name={a.id} onClick={onViewClick}>
                                        <VisibilityIcon />
                                        {t("VIEW")}
                                    </button>
                                </td>
                            </tr>
                            ))}
                        </Table>
                    </td>
                </tr>
                </>
            ))}
        </tbody>
    </Table>

    );

}
