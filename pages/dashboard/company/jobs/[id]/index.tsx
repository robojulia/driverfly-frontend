import { useRouter } from "next/router";
import { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import ChildPageLayout from "../../../../../components/layouts/page/child-page-layout";
import { useAuth } from "../../../../../hooks/use-auth";
import { useTranslation } from "../../../../../hooks/use-translation";
import { useEffectAsync } from "../../../../../utils/react";

import { DeleteButton } from "../../../../../components/buttons/delete-button";
import { ReactivateJob } from "../../../../../components/jobs/reactivate-job";
import ViewJobDetail from "../../../../../components/jobs/view-job-detail";
import { JobEntity } from "../../../../../models/job/job.entity";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import JobApi from "../../../../api/job";

export default function ViewJob({ id }) {
    const router = useRouter();

    const { t } = useTranslation();

    const { hasPermission, company } = useAuth();

    const [job, setJob] = useState<JobEntity>(new JobEntity());

    const backPath = "/dashboard/company/jobs";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    useEffectAsync(async () => {
        if (id) {
            const api = new JobApi();

            const data = await api.getById(+id);

            if (!data || data.company.id != company?.id) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: t("JOB") }));
                goBack();
                return;
            }

            setJob(data);
        }
        else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "JOB" }, { translateProps: true }));
            goBack();

        }

    }, [id, company]);

    async function onEditClick() {
        await router.push(router.asPath + `/edit`);
    };

    async function onDeleteClick() {
        try {
            const api = new JobApi();
            await api.remove(+id);
            toast.success(t("Forms.SUCCESS_{action}_{name}", { action: "Forms.Deleted", name: "JOB" }, { translateProps: true }));
            goBack();
        }
        catch (e) {
            globalAjaxExceptionHandler(e, { toast: toast, t: t, defaultMessage: "UNABLE_TO_DELETE" });
        }
    };

    const can = {
        update: hasPermission("CanUpdateJob"),
        delete: hasPermission("CanDeleteJob")
    };

    const title = t("VIEW_{name}", { name: "JOB" }, { translateProps: true });

    return (
        <ChildPageLayout
            backPath={backPath}
            title={title}
            actions={(
                <ButtonGroup>
                    <ReactivateJob
                        variant="outline-success"
                        job={job}
                        className="border-0"
                        onComplete={(j) => setJob(j)}
                    />
                    {
                        can.delete &&
                        <DeleteButton
                            onDelete={onDeleteClick}
                        />
                    }
                    {
                        can.update &&
                        <Button type="button" onClick={onEditClick}>
                            <Pencil /> {t("EDIT")}
                        </Button>
                    }
                </ButtonGroup>
            )}
        >

            <ViewJobDetail
                job={job}
                canApply={false}
                canSave={false}
                hideVehicles={false}
                hideCompanyName={true}
                hideSocialLinks={true}

            />
        </ChildPageLayout>
    );
}

ViewJob.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

export async function getServerSideProps(context) {
    try {
        const id = +context.params?.id;
        if (!id)
            return { notFound: true }

        return {
            props: { id: id }
        }
    } catch (error) {
        console.error("ViewApplicant error:", error);
        return { props: { id: null } }
    }
}
