import React from "react";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";

import { PenFill, Plus, Recycle } from 'react-bootstrap-icons';

import PageLayout from "../../../../components/layouts/page/page-layout";

import { useRouter } from "next/router";
import ShowEnumFromString from "../../../../components/enum-filters/show-enum-from-string";
import { JobDeliveryType } from "../../../../enums/jobs/job-delivery-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { JobEntity } from "../../../../models/job/job.entity";
import JobApi from "../../../api/job";

import moment from "moment";
import Link from "next/link";
import { Button, ButtonGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import BaseInput from "../../../../components/forms/base-input";
import { TabbedLayout } from "../../../../components/layouts/page/tabbed-layout";
import OverlyPopover from "../../../../components/popover/overly-popover";
import ViewDataTable, { getDataTableColumnKey } from "../../../../components/view-details/view-data-table";
import ViewModal from "../../../../components/view-details/view-modal";
import { useAuth } from "../../../../hooks/use-auth";
import { buildAddress } from "../../../../utils/common";
import { isExpired } from "../../../../utils/date";
import { useEffectAsync } from "../../../../utils/react";

export default function JobListing() {

    const [activeJobs, setActiveJobs] = React.useState<JobEntity[]>([]);
    const [expiredJobs, setExpiredJobs] = React.useState<JobEntity[]>([]);
    const [reactivateJob, setReactivateJob] = React.useState<JobEntity>();
    const [expiryDate, setExpiryDate] = React.useState<string | Date>();

    const { user, hasPermission } = useAuth();
    const { t } = useTranslation();
    const router = useRouter();
    const jobApi = new JobApi();

    const columnSettingKey = getDataTableColumnKey("company", user, "jobs");

    useEffectAsync(async () => {
        console.log("refresh fired");
        const v = await jobApi.list();

        const currentDate = new Date();
        const active = v.filter(job => job.expiry_date && new Date(job.expiry_date) >= currentDate);
        const expired = v.filter(job => job.expiry_date && new Date(job.expiry_date) < currentDate);

        setExpiredJobs(expired);
        setActiveJobs(active);
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

    const onEditClick = (id: number) => {
        router.push(`${router.pathname}/${id}/edit`);
    }

    const onDeleteClick = async (id: number) => {
        await jobApi.remove(id);

        setActiveJobs(activeJobs.filter(v => v.id != id));
    }

    const can = {
        editJob: hasPermission("CanUpdateJob"),
        deleteJob: hasPermission("CanDeleteJob"),
    };

    function onReactivateClick(job: JobEntity) {
        setReactivateJob(job);
        setExpiryDate(job?.expiry_date);
    }

    const onCloseClick = () => {
        setReactivateJob(null);
        setExpiryDate("");
    };

    const onConfirmReactivateClick = React.useCallback(async (e: React.MouseEvent) => {
        try {
            const updatedJob = await jobApi.update(+reactivateJob.id, {
                ...reactivateJob,
                expiry_date: expiryDate,
            });
            setActiveJobs([...activeJobs, updatedJob])
            setExpiredJobs([...expiredJobs?.filter(v => v.id != updatedJob?.id)])
        } catch (e) {
            toast.error("UNABLE_TO_SAVE_INFORMATION");
        } finally {
            onCloseClick();
        }
    }, [expiryDate, reactivateJob])

    return (
        <PageLayout
            title="JOBS"
            actions={
                <Button variant="primary" onClick={onAddClick}>
                    <Plus /> {t("CREATE")}
                </Button>
            }
        >
            <TabbedLayout
                items={{
                    ACTIVE: (<ViewDataTable<JobEntity>
                        columnSettingKey={columnSettingKey}
                        customStyles={{
                            headRow: {
                                style: {
                                    background: "linear-gradient(to bottom right, #2ec8c4, #1b4454ba)",
                                    color: "white"
                                },
                            },
                        }}
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
                                cell: j => (<Link href={`/dashboard/company/applicants?jobId=${j.id}&viewMode=applicant`}><a className="btn btn-link"><span className="badge badge-pill badge-primary">{j.applicantsCount}</span></a></Link>),
                                selector: j => j.applicantsCount,
                            },
                            {
                                id: "created_at",
                                name: "CREATED_AT",
                                cell: job => job?.created_at ? moment(job?.created_at).format('DD MMM YYYY') : null,
                            },
                            {
                                id: "expiration_date",
                                name: "expiration_date",
                                cell: j => j.expiry_date ? moment(j.expiry_date).format('DD MMM YYYY') : null,
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
                                    value={j.delivery_type}
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
                                onClick: e => onEditClick(j.id),
                                icon: PenFill,
                                label: "EDIT",
                                hide: !can.editJob
                            },
                            // {
                            //     onClick: e => onDeleteClick(j.id),
                            //     icon: TrashFill,
                            //     label: "DELETE",
                            //     hide: !can.deleteJob
                            // },
                        ])}
                        items={activeJobs}
                    />
                    ),
                    EXPIRED: (<ViewDataTable<JobEntity>
                        columnSettingKey={columnSettingKey}
                        customStyles={{
                            headRow: {
                                style: {
                                    background: "linear-gradient(to bottom right, #2ec8c4, #1b4454ba)",
                                    color: "white"
                                },
                            },
                        }}
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
                                cell: j => (<Link href={`/dashboard/company/applicants?jobId=${j.id}&viewMode=applicant`}><a className="btn btn-link"><span className="badge badge-pill badge-primary">{j.applicantsCount}</span></a></Link>),
                                selector: j => j.applicantsCount,
                            },
                            {
                                id: "created_at",
                                name: "CREATED_AT",
                                cell: job => job?.created_at ? moment(job?.created_at).format('DD MMM YYYY') : null,
                            },
                            {
                                id: "expiration_date",
                                name: "expiration_date",
                                cell: j => j.expiry_date ? moment(j.expiry_date).format('DD MMM YYYY') : null,
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
                                    value={j.delivery_type}
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
                        actions={job => ([
                            {
                                onClick: e => onEditClick(job.id),
                                icon: PenFill,
                                label: "EDIT",
                                hide: !can.editJob
                            },
                            {
                                onClick: e => onReactivateClick(job),
                                icon: Recycle,
                                label: "REACTIVATE",
                                hide: !can.editJob
                            },
                            // {
                            //     onClick: e => onDeleteClick(j.id),
                            //     icon: TrashFill,
                            //     label: "DELETE",
                            //     hide: !can.deleteJob
                            // },
                        ])}
                        items={expiredJobs}
                    />
                    )
                }}
            />
            <ViewModal
                show={!!reactivateJob?.id}
                title="REACTIVATE_JOB"
                closeText="CANCEL"
                onCloseClick={onCloseClick}
                footer={
                    <ButtonGroup>
                        <Button
                            disabled={isExpired(expiryDate) || !expiryDate}
                            type="button"
                            variant="info"
                            onClick={onConfirmReactivateClick}
                        >
                            {t("SAVE")}
                        </Button>
                    </ButtonGroup>
                }
            >
                <BaseInput
                    className="col-12 p-0 px-lg-2"
                    label="expiration_date"
                    displayPlaceholder
                    type="date"
                    // min={new Date().toISOString().split("T")[0]}
                    onChange={({ target: { value } }) => setExpiryDate(value)}
                    value={expiryDate}
                    error={isExpired(expiryDate) && "EXPIRATION_DATE_MUST_BE_IN_FUTURE"}
                />
            </ViewModal>

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
