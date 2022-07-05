
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import JobList from "../../../../public/dashboard/styles/css/JobList.module.css"
import useRedirect from '../../../../hooks/useRedirect';
import { useEffect } from "react";
import { useState } from "react";
import React from "react";

import { PenFill, TrashFill, Eye, EyeFill } from 'react-bootstrap-icons';


import JobApi from "../../../api/job";
import { JobEntity } from "../../../../models/job/job.entity";
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
import OverlyPopover from "../../../../components/popover/overly-popover";
import useAuth from "../../../../hooks/useAuth";
import useStorage from "../../../../hooks/useStorage";
import { useEffectAsync } from "../../../../utils/react";

export default function JobListing() {

    const { authCompany } = useRedirect();
    authCompany()

    const { authCheck } = useAuth();
    const user = authCheck();
    const columnSettingKey = `company.${user.id}.jobs.columns`
    let settingsJson = useStorage().getItem(columnSettingKey)
    let settingsArray = settingsJson ? JSON.parse(settingsJson) : []

    const { t } = useTranslation();
    const router = useRouter()
    const [jobs, setJobs] = useState([])
    const [columnHistory, setColumnHistory] = useState([])

    useEffectAsync(async () => {
        const api = new JobApi();

        const v = await api.list();

        setJobs(v);

        let columnArray = []
        await settingsArray.map(v => {
            columnArray[v.name] = v
        })
        setColumnHistory(columnArray)
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
                        <button className="theme-secondary-btn" onClick={onAddClick}>
                            + {t("CREATE")}
                        </button>
                    </Col>
                </Row>
                <Row className="mt-5 my_job_listing">
                    <Col lg="12 ">
                        <ViewDataTable<JobEntity>
                            columns={[
                                {
                                    name: "job_title",
                                    cell: job => (<OverlyPopover skipTranslate={true} header={t('job_title')} str={job.title} />),
                                    selector: job => job.title,
                                    hidable: false
                                },
                                {
                                    name: "location",
                                    cell: job => (<OverlyPopover skipTranslate={true} header={t('location')} str={buildAddress(job.location || {})} />),
                                    selector: job => buildAddress(job.location || {})
                                },
                                {
                                    name: "drivers_needed",
                                    selector: j => j.drivers_needed,
                                },
                                {
                                    name: "expiration_date",
                                    selector: j => j.expiry_date ? new Date(j.expiry_date).toDateString() : null,
                                },
                                {
                                    name: "GEOGRAPHY",
                                    selector: j => j.geography ? t("JobGeography." + j.geography) : null,
                                },
                                {
                                    name: "SCHEDULE",
                                    cell: job => (<OverlyPopover labelPrefix="JobSchedule" skipTranslate={false} header={t('SCHEDULE')} str={job.schedule} />),
                                    selector: job => t(`JobSchedule.${job.schedule}`)
                                },
                                {
                                    name: "EMPLOYMENT_TYPE",
                                    cell: job => (<OverlyPopover labelPrefix="JobEmploymentType" skipTranslate={false} header={t('EMPLOYMENT_TYPE')} str={job.employment_type} />),
                                    selector: job => t(`JobEmploymentType.${job.employment_type}`)
                                },
                                {
                                    name: "DELIVERY_TYPE",
                                    cell: j =>
                                    (<ShowEnumFromString
                                        popover_header={t('DELIVERY_TYPE')}
                                        labelPrefix="JobDeliveryType"
                                        popover={true}
                                        str={j.delivery_type}
                                        enumArray={JobDeliveryType} />
                                    ),
                                    selector: job => t(`JobDeliveryType.${job.delivery_type}`),
                                },
                                {
                                    name: "TEAM_DRIVERS",
                                    cell: job => (<OverlyPopover labelPrefix="JobTeamDriver" skipTranslate={false} header={t('TEAM_DRIVERS')} str={job.team_drivers} />),
                                    selector: job => t(`JobTeamDriver.${job.team_drivers}`),
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
                            columnSettingKey={columnSettingKey}
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
