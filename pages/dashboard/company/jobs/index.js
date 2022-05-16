
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import JobList from "../../../../public/dashboard/styles/css/JobList.module.css"
import useRedirect from '../../../../hooks/useRedirect';
import { useEffect } from "react";
import { useState } from "react";
import React from "react";

import {PenFill, TrashFill, Eye, EyeFill} from 'react-bootstrap-icons';


import JobApi from "../../../api/job";
import { useTranslation } from "../../../../hooks/useTranslation";
import { JobGeography } from "../../../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../../../enums/jobs/job-schedule.enum";
import { JobEmploymentType } from "../../../../enums/jobs/job-employment-type.enum";
import { JobEquipmentType } from "../../../../enums/jobs/job-equipment-type.enum";
import { JobDeliveryType } from "../../../../enums/jobs/job-delivery-type.enum";
import { JobTeamDriver } from "../../../../enums/jobs/job-team-driver.enum";
import { useRouter } from "next/router";
import ShowEnumFromString from "../../../../components/enum-filters/show-enum-from-string";
import ListActions from "../../../../components/list-actions/ListActions";

import { buildAddress } from "../../../../utils/common";

export default function JobListing() {

    const { authCompany } = useRedirect();

    authCompany()

    const { t } = useTranslation();
    const router = useRouter()
    const [jobs, setJobs] = useState([])

    useEffect(async () => {
        const api = new JobApi();

        const v = await api.list();

        setJobs(v);
    }, []);

    /**
     * 
     * @param {React.MouseEvent} e 
     */
    const onAddClick = (e) => {
        e.preventDefault();

        router.push(`${router.pathname}/create`);
    }

    /**
     * 
     * @param {number} id
     */
     const onPreviewClick = (id) => {
        router.push(`/jobs/${id}`);
    }

    /**
     * 
     * @param {number} id
     */
     const onViewApplicantsClick = (id) => {
        router.push(`/dashboard/company/applicants?jobId=${id}`);
    }

    /**
     * 
     * @param {number} id
     */
    const onEditClick = (id) => {
        router.push(`${router.pathname}/${id}`);
    }

    /**
     * 
     * @param {number} id
     */
    const onDeleteClick = async (id) => {
        const api = new JobApi();

        await api.remove(id);

        setJobs(jobs.filter(v => v.id != id));
    }

    return (
        <>
            <div className={JobList.joblisting}>

                <Row className={JobList.link}>
                    <Col xs="10">
                        <h2>{t("JOBS")}</h2>
                    </Col>
                    <Col xs="2" className="text-right">
                        <button className="btn btn-primary" onClick={onAddClick}>
                            + {t("CREATE")}
                        </button>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col lg="12 ">
                        <Card className="job_listing">
                            <CardBody className={JobList.jobtable}>
                                <div className="table-responsive">
                                    <Table striped>
                                        <thead className="listing_head">
                                            <tr>
                                                <th>{t('job_title')}</th>
                                                <th>{t('location')}</th>
                                                <th>{t('drivers_needed')}</th>
                                                <th>{t('expiration_date')}</th>
                                                <th>{t('geography')}</th>
                                                <th>{t('schedule')}</th>
                                                <th>{t('employment_type')}</th>
                                                <th>{t('equipment_type')}</th>
                                                <th>{t('delivery_type')}</th>
                                                <th>{t('team_drivers')}</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!jobs || !jobs.length &&
                                                <tr>
                                                    <td colSpan={11}>
                                                        {t("NO_{name}_FOUND", { name: t("JOBS") })}

                                                    </td>
                                                </tr>
                                            }
                                            {
                                                jobs &&
                                                jobs.map((job, index) => {
                                                    return <tr key={index}>
                                                        <td>{job.title} </td>
                                                        <td>
                                                            {buildAddress(job.location || {})}
                                                        </td>
                                                        <td>{job.drivers_needed} </td>
                                                        <td>{job.expiry_date && new Date(job.expiry_date).toDateString()} </td>
                                                        <td><ShowEnumFromString popover={true} str={job.geography} enumArray={JobGeography} /></td>
                                                        <td><ShowEnumFromString popover={true} str={job.schedule} enumArray={JobSchedule} /></td>
                                                        <td><ShowEnumFromString popover={true} str={job.employment_type} enumArray={JobEmploymentType} /></td>
                                                        <td><ShowEnumFromString popover={true} str={job.equipment_type} enumArray={JobEquipmentType} /></td>
                                                        <td><ShowEnumFromString popover={true} str={job.delivery_type} enumArray={JobDeliveryType} /></td>
                                                        <td><ShowEnumFromString popover={true} str={job.team_drivers} enumArray={JobTeamDriver} /></td>
                                                        <td className="text-nowrap">
                                                            <ListActions
                                                                options={[
                                                                    {
                                                                        onClick: e => onViewApplicantsClick(job.id),
                                                                        label: (<><EyeFill /> {t("VIEW_{name}", { name: t("APPLICANTS") })}</>)
                                                                    },
                                                                    {
                                                                        onClick: e => onPreviewClick(job.id),
                                                                        label: (<><Eye /> {t("VIEW_{name}", { name: t("POST") })}</>)
                                                                    },
                                                                    {
                                                                        onClick: e => onEditClick(job.id),
                                                                        label: (<><PenFill /> {t("EDIT")}</>)
                                                                    },
                                                                    {
                                                                        onClick: e => onDeleteClick(job.id),
                                                                        label: (<><TrashFill /> {t("DELETE")}</>)
                                                                    },
                                                                ]}
                                                                />
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                                <Row className="py-4">
                                    <Col sm="6" lg="9">
                                        <nav aria-label="Page navigation example p-0">
                                            <ul className="pagination p-0">
                                                {/* <li className="page-item"><a className="page-link" href="#">Page 1</a></li> */}
                                            </ul>
                                        </nav>
                                    </Col>
                                </Row>
                            </CardBody>

                        </Card>
                    </Col>
                </Row>
            </div>

        </>
    )

};

JobListing.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
