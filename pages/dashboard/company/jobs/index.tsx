
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { useEffect, useState } from "react";
import React from "react";

import { PenFill, TrashFill, Eye, EyeFill, Plus } from 'react-bootstrap-icons';

import PageLayout from "../../../../components/layouts/page/PageLayout";

import JobApi from "../../../api/job";
import { JobEntity } from "../../../../models/job/job.entity";
import { useTranslation } from "../../../../hooks/useTranslation";
import { JobDeliveryType } from "../../../../enums/jobs/job-delivery-type.enum";
import Router, { useRouter } from "next/router";
import ShowEnumFromString from "../../../../components/enum-filters/show-enum-from-string";

import { buildAddress } from "../../../../utils/common";
import ViewDataTable, { getDataTableColumnKey } from "../../../../components/viewDetails/viewDataTable";
import OverlyPopover from "../../../../components/popover/overly-popover";
import { useAuth } from "../../../../hooks/useAuth";
import { useEffectAsync } from "../../../../utils/react";
import Link from "next/link";
import { Button } from "react-bootstrap";

export default function JobListing() {

    const { user, hasPermission } = useAuth();

    const columnSettingKey = getDataTableColumnKey("company", user, "jobs");

    const { t } = useTranslation();
    const router = useRouter()
    const [jobs, setJobs] = useState<JobEntity[]>([])
    const api = new JobApi();

    useEffectAsync(async () => {
        console.log("refresh fired");
        // const api = new JobApi();

        const v = await api.list();

        setJobs(v);
    }, [user], () => {
        console.log("unloading page...")
    });

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
        router.push(`${router.pathname}/${id}/edit`);
    }

    const onViewClick = (id: number) => {
        router.push(`${router.pathname}/${id}`);
    }

    const onDeleteClick = async (id: number) => {
        await api.remove(id);

        setJobs(jobs.filter(v => v.id != id));
    }

    const can = {
        editJob: hasPermission("CanUpdateJob"),
        deleteJob: hasPermission("CanDeleteJob"),
    };

    return (
        <PageLayout
            title="JOBS"
            actions={
                <Button variant="primary" onClick={onAddClick}>
                    <Plus /> {t("CREATE")}
                </Button>
            }
        >

            <ViewDataTable<JobEntity>
                columnSettingKey={columnSettingKey}

                columns={[
                    {
                        id: "id",
                        name: "ID",
                        selector: j => j.id,
                    },
                    {
                        id: "job_title",
                        name: "job_title",
                        cell: (j) => (<Link href={`${router.asPath}/${j.id}`} ><a>{j.title}</a></Link>),
                        selector: job => job.title,
                        hidable: false
                    },
                    {
                        id: "location",
                        name: "location",
                        cell: job => (<OverlyPopover skipTranslate={true} header={t('location')} str={buildAddress(job.location || {})} />),
                        selector: job => buildAddress(job.location || {})
                    },
                    {
                        id: "drivers_needed",
                        name: "drivers_needed",
                        selector: j => j.drivers_needed,
                    },
                    {
                        id: "applicantsCount",
                        name: "APPLICANTS",
                        selector: j => j.applicantsCount,
                    },
                    {
                        id: "expiration_date",
                        name: "expiration_date",
                        selector: j => j.expiry_date ? new Date(j.expiry_date).toDateString() : null,
                    },
                    {
                        id: "geography",
                        name: "GEOGRAPHY",
                        selector: j => j.geography ? t("JobGeography." + j.geography) : null,
                    },
                    {
                        id: "schedule",
                        name: "SCHEDULE",
                        cell: job => (<OverlyPopover labelPrefix="JobSchedule" skipTranslate={false} header={t('SCHEDULE')} str={job.schedule} />),
                        selector: job => t(`JobSchedule.${job.schedule}`)
                    },
                    {
                        id: "employment_type",
                        name: "EMPLOYMENT_TYPE",
                        cell: job => (<OverlyPopover labelPrefix="JobEmploymentType" skipTranslate={false} header={t('EMPLOYMENT_TYPE')} str={job.employment_type} />),
                        selector: job => t(`JobEmploymentType.${job.employment_type}`)
                    },
                    {
                        id: "delivery_type",
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
                        id: "team_drivers",
                        name: "TEAM_DRIVERS",
                        cell: job => (<OverlyPopover labelPrefix="JobTeamDriver" skipTranslate={false} header={t('TEAM_DRIVERS')} str={job.team_drivers} />),
                        selector: job => t(`JobTeamDriver.${job.team_drivers}`),
                    },
                ]}
                actions={j => ([
                    {
                        onClick: e => onViewApplicantsClick(j.id),
                        icon: EyeFill,
                        label: t("VIEW_{name}", { name: "APPLICANTS" }, { translateProps: true })
                    },
                    {
                        onClick: e => onPreviewClick(j.id, j.slug),
                        icon: Eye,
                        label: t("VIEW_{name}", { name: "POST" }, { translateProps: true })
                    },
                    {
                        onClick: e => onViewClick(j.id),
                        icon: Eye,
                        label: "VIEW"
                    },
                    {
                        onClick: e => onEditClick(j.id),
                        icon: PenFill,
                        label: "EDIT",
                        hide: !can.editJob
                    },
                    {
                        onClick: e => onDeleteClick(j.id),
                        icon: TrashFill,
                        label: "DELETE",
                        hide: !can.deleteJob
                    },
                ])}
                items={jobs}
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
