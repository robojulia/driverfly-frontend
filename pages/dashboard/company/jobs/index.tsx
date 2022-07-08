
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import useRedirect from '../../../../hooks/useRedirect';
import { useState } from "react";
import React from "react";

import { PenFill, TrashFill, Eye, EyeFill } from 'react-bootstrap-icons';

import PageLayout from "../../../../components/layouts/PageLayout";

import JobApi from "../../../api/job";
import { JobEntity } from "../../../../models/job/job.entity";
import { useTranslation } from "../../../../hooks/useTranslation";
import { JobDeliveryType } from "../../../../enums/jobs/job-delivery-type.enum";
import { useRouter } from "next/router";
import ShowEnumFromString from "../../../../components/enum-filters/show-enum-from-string";

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

    const onPreviewClick = (id: number, slug: string) => {
        router.push(`/jobs/${id}/${slug}`);
    }

    const onViewApplicantsClick = (id: number) => {
        router.push(`/dashboard/company/applicants?jobId=${id}`);
    }

    const onEditClick = (id: number) => {
        router.push(`${router.pathname}/${id}`);
    }

    const onDeleteClick = async (id: number) => {
        const api = new JobApi();

        await api.remove(id);

        setJobs(jobs.filter(v => v.id != id));
    }

    return (
        <PageLayout
            title="JOBS"
            actions={
                <button className="theme-secondary-btn" onClick={onAddClick}>
                    + {t("CREATE")}
                </button>
            }
        >

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
                        onClick: e => onPreviewClick(j.id, j.slug),
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
        </PageLayout>
    )

};

JobListing.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
