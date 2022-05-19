
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
import ViewDataTable from "../../../../components/viewDetails/viewDataTable";

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
                        <ViewDataTable
                            columns={[
                                {
                                    name: "job_title",
                                    selector: j => j.title,
                                    hidable: false
                                },
                                {
                                    name: "location",
                                    selector: j => buildAddress(j.location || {})
                                },
                                {
                                    name: "drivers_needed",
                                    selector: j => j.drivers_needed
                                },
                                {
                                    name: "expiration_date",
                                    selector: j => j.expiry_date ? new Date(j.expiry_date).toDateString() : null
                                },
                                {
                                    name: "GEOGRAPHY",
                                    selector: j => j.geography ? t("JobGeography." + j.geography) : null
                                },
                                {
                                    name: "schedule",
                                    selector: j => j.schedule ? t("JobSchedule." + j.schedule) : null
                                },
                                {
                                    name: "employment_type",
                                    selector: j => j.employment_type ? t("JobEmploymentType." + j.employment_type) : null
                                },
                                {
                                    name: "delivery_type",
                                    selector: j => j.delivery_type ? t("JobDeliveryType." + j.delivery_type) : null
                                },
                                {
                                    name: "team_drivers",
                                    selector: j => j.team_drivers ? t("JobTeamDriver." + j.team_drivers) : null
                                },
                            ]}
                            actions={j => ([
                                {
                                    onClick: e => onViewApplicantsClick(j.id),
                                    label: (<><EyeFill /> {t("VIEW_{name}", { name: "APPLICANTS" }, { translateProps: true })}</>)
                                },
                                {
                                    onClick: e => onPreviewClick(j.id),
                                    label: (<><Eye /> {t("VIEW_{name}", { name: t("POST") })}</>)
                                },
                                {
                                    onClick: e => onEditClick(j.id),
                                    label: (<><PenFill /> {t("EDIT")}</>)
                                },
                                {
                                    onClick: e => onDeleteClick(j.id),
                                    label: (<><TrashFill /> {t("DELETE")}</>)
                                },
                            ])}
                            items={jobs}
                            />
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
