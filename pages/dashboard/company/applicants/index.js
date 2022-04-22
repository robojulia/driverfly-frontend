import LogoutButton from '../../../../components/buttons/Logout';
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import download from "../../../../public/dashboard/assets/images/download/download.png";
import Applicant from "../../../../public/dashboard/styles/css/Applicants.module.css"
import Link from 'next/link';
import Image from 'next/image';
import useRedirect from '../../../../hooks/useRedirect';

import { useTranslation } from 'react-i18next';

import ApplicantApi from "../../../api/applicant";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { JobEquipmentType } from '../../../../enums/jobs/job-equipment-type.enum';
import { ApplicantStatus } from '../../../../enums/applicants/ApplicantStatus.enum';


export default function Applicants() {
    const { t } = useTranslation();

    const router = useRouter();

    const { authCompany } = useRedirect();

    authCompany();

    const [ applicants, setApplicants ] = useState([]);

    const statuses = Object.keys(ApplicantStatus).map(k => ({
        key: k,
        label: t(`ApplicantStatus.${k}`)
    }));

    useEffect(async () => {
        const api = new ApplicantApi();

        const data = await api.company.list(router.query);

        // we need to convert the list of applicants into a consolodated body by user

        const applicantMap = {};

        data.forEach(applicant => {
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
            }

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
                    
            consolodatedApplicant.jobs.push(applicant);
        });

        setApplicants(Object.values(applicantMap));

    }, [ router.query ]);

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
                                                                <th>{/** Change status */}</th>
                                                            </tr>
                                                            {applicant.jobs.map((a, jobI) => (
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
                                                            </tr>
                                                            ))}
                                                        </Table>
                                                    </td>
                                                </tr>
                                                </>
                                            ))}
                                        </tbody>
                                    </Table>

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
