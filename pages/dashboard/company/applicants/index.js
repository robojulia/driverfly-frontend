import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import Applicant from "../../../../public/dashboard/styles/css/Applicants.module.css"
import useRedirect from '../../../../hooks/useRedirect';

import { useTranslation } from 'react-i18next';

import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import { EyeFill} from 'react-bootstrap-icons';



import ApplicantApi from "../../../api/applicant";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { JobEquipmentType } from '../../../../enums/jobs/job-equipment-type.enum';
import { ApplicantStatus } from '../../../../enums/applicants/applicant-status.enum';

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

    /**
     * 
     * @param {ApplicantEntity} applicant 
     * @returns 
     */
    const convertApplicant = (applicant) => ({
        id: applicant.id,
        first_name: applicant.first_name,
        last_name: applicant.last_name,
        name: `${applicant.first_name} ${applicant.last_name}`.trim(),
        phone: applicant.phone,
        email: applicant.email,
    });

    /**
     * 
     * @param {ApplicantJobEntity} aJob 
     */
    const convertJob = (aJob) => ({
        id: aJob.job.id,
        job: aJob.job,
        title: aJob.job.title,
        location: `${aJob.job.location.city}, ${aJob.job.location.state}`,
        geography: aJob.job.geography,
        employment_type: aJob.job.employment_type,
        weekly_range: `${numbers.toCurrency(aJob.job.min_weekly_pay)} - ${numbers.toCurrency(aJob.job.max_weekly_pay)}`,
    });

    useEffect(async () => {
        if (!viewMode) return;
        const api = new ApplicantApi();

        const data = await api.list({
            jobId: jobId
        });

        // we need to convert the list of applicants into a consolodated body by user

        const applicantMap = {};

        let applicants = [];

        if (viewMode === ViewMode.job) {
            // job view mode flips consolodation
            data.forEach(applicant => {

                applicant.jobs.forEach(aJob => {
                    let consolodatedJob = applicantMap[aJob.job.id];

                    if (!consolodatedJob) {
                        consolodatedJob = applicantMap[aJob.job.id] = {
                            ...convertJob(aJob),
                            applicants: []
                        };
                        consolodatedJob.sort = consolodatedJob.title;
                    }
                    consolodatedJob.applicants.push({
                        ...convertApplicant(applicant),
                        created_at: aJob.created_at,
                        status: aJob.status,
                        ...evaluateJobRequirements(applicant, aJob.job)
                    });
                });
            });
        }
        else {
            // applicant is the default view mode
            data.forEach(applicant => {
                /**
                 * @type {ConsolodatedApplicant}
                 */
                let consolodatedApplicant = applicantMap[applicant.id] = {
                    ...convertApplicant(applicant),
                    jobs: applicant.jobs.map(aJob => {
                        return {
                            ...convertJob(aJob),
                            created_at: aJob.created_at,
                            status: aJob.status,
                            ...evaluateJobRequirements(applicant, aJob.job)
                        };
                    })
                };

                consolodatedApplicant.sort = consolodatedApplicant.name;
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
     * @param {JobEntity} job 
     */
    function evaluateJobRequirements(applicant, job) {
        // calculate if applicant meets basic qualifications:
        const results = {
            meets_basic_qualifications: true,
            qualification_fail_reason: []
        };

        if (applicant.years_cdl_experience < job.min_years_experience) {
            results.meets_basic_qualifications = false;
            results.qualification_fail_reason.push(t("YEARS_OF_CDL_EXPERIENCE_TOO_LOW"));
        }

        if (applicant.accident_count > 0) {
            if (job.must_have_clean_mvr) {
                results.meets_basic_qualifications = false;
                results.qualification_fail_reason.push(t("DOES_NOT_HAVE_CLEAN_MVR"));
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

                if (mvr && mvr.max_count > applicant.accident_count) {
                    results.meets_basic_qualifications = false;
                    results.qualification_fail_reason.push(t("VIOLATION_COUNT_GREATER_THAN_MAX"));
                }
            }
        }

        if (!applicant.can_pass_drug_test && job.must_pass_drug_test) {
            results.meets_basic_qualifications = false;
            results.qualification_fail_reason.push(t("CANNOT_PASS_DRUG_TEST"));
        }

        job.required_skills.forEach(skill => {
            // cannot process OTHER type
            if (skill.type !== JobEquipmentType.OTHER) {
                const experience = applicant.experiences.find(v => v.type === skill.type);

                if (!experience) {
                    results.meets_basic_qualifications = false;
                    results.qualification_fail_reason.push(t("DOES_NOT_HAVE_{name}_EXPERIENCE", { name: t(`JobEquipmentType.${skill.type}`)}));
                }
                else if ( experience.years < skill.years) {
                    results.meets_basic_qualifications = false;
                    results.qualification_fail_reason.push(t("YEARS_OF_{name}_EXPERIENCE_TOO_LOW", { name: t(`JobEquipmentType.${skill.type}`)}));
                }
            }
        });

        return results;
    }

    /**
     * @param {React.ChangeEvent<HTMLSelectElement>} e
     * @param {number} applicantId
     * @param {number} jobId
     */
    const changeStatus = async (e, applicantId, jobId) => {
        const value = e.target.options[e.target.selectedIndex].value;
        if (value) {
            const api = new ApplicantApi();

            await api.jobs.update(applicantId, jobId, { status: value });

            await router.reload();
        }
    }

    /**
     * 
     * @param {React.MouseEvent<HTMLButtonElement>} e 
     */
    const onViewClick = (e) => {
        const { name } = e.currentTarget;

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
 * @param {(e: React.ChangeEvent<HTMLSelectElement>, applicantId: number, jobId: number) => Promise<void>} props.changeStatus
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
                <th>{/* ACTIONS */}</th>
            </tr>
        </thead>

        <tbody>
            {!applicants?.length &&
                <tr>
                    <td colSpan={4}>
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
                    <td>
                        <button className='btn' name={applicant.id} onClick={onViewClick}>
                            <EyeFill />
                            {t("VIEW")}
                        </button>
                    </td>
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
                                <th>{/** Change status */}</th>
                            </tr>
                            {applicant.jobs?.map((a, jobI) => (
                            <tr key={jobI}>
                                <td>{a.title}</td>
                                <td>{new Date(a.created_at).toDateString()}</td>
                                <td className='text-center'>{t(`ApplicantStatus.${a.status}`)}</td>
                                <td className='text-center'>
                                    {t(a.meets_basic_qualifications ? "YES" : "NO")}
                                </td>
                                <td>
                                    {a.qualification_fail_reason.join("<br />")}
                                </td>
                                <td>
                                    <select className={`form-select`} name={a.id} onChange={e => changeStatus(e, applicant.id, a.id)} value="">
                                        <option>{t("CHANGE_STATUS")}</option>
                                        {statuses.map((v, i) => (<option key={i} value={v.key}>{v.label}</option>))}
                                    </select>
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
 * @param {(e: React.ChangeEvent<HTMLSelectElement>, applicantId: number, jobId: number) => Promise<void>} props.changeStatus
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
                            {job.applicants?.map((applicant) => (
                            <tr key={applicant.id}>
                                <td>{applicant.first_name} {applicant.last_name}</td>
                                <td>{new Date(applicant.created_at).toDateString()}</td>
                                <td className='text-center'>{t(`ApplicantStatus.${applicant.status}`)}</td>
                                <td className='text-center'>
                                    {t(applicant.meets_basic_qualifications ? "YES" : "NO")}
                                </td>
                                <td>
                                    {applicant.qualification_fail_reason.join("<br />")}
                                </td>
                                <td>
                                    <select className={`form-select`} onChange={e => changeStatus(e, applicant.id, job.id)} value="">
                                        <option>{t("CHANGE_STATUS")}</option>
                                        {statuses.map((v, i) => (<option key={i} value={v.key}>{v.label}</option>))}
                                    </select>
                                </td>
                                <td>
                                    <button className='btn' name={applicant.id} onClick={onViewClick}>
                                        <EyeFill />
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
