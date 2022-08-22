import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import ChildPageLayout from "../../../../../components/layouts/page/ChildPageLayout";

import { toast } from "react-toastify";

import { Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";

import { useRouter } from "next/router";
import { useState } from "react";
import { useEffectAsync } from "../../../../../utils/react";
import { useAuth } from "../../../../../hooks/useAuth";
import { useTranslation } from "../../../../../hooks/useTranslation";

import JobApi from "../../../../api/job";
import { JobEntity } from "../../../../../models/job/job.entity";
import { DeleteButton } from "../../../../../components/buttons/DeleteButton";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import ViewCard from "../../../../../components/viewDetails/viewCard";
import ViewDetails from "../../../../../components/viewDetails/viewDetails";
import { buildAddress } from "../../../../../utils/common";
import { JobEquipmentType } from "../../../../../enums/jobs/job-equipment-type.enum";
import { JobPayMethod } from "../../../../../enums/jobs/job-pay-method.enum";
import { JobBenefits } from "../../../../../enums/jobs/job-benefits.enum";
import { VehicleType } from "../../../../../enums/vehicles/vehicle-type.enum";
import { version } from "os";
import { JobEmploymentType } from "../../../../../enums/jobs/job-employment-type.enum";

import CompanyPhoto from "../../../../../components/jobs/company-photo"
import JobDescription from '../../../../../components/job-description/JobDescription'
import { ArrowRight, GeoAltFill, CurrencyDollar } from "react-bootstrap-icons"
import timeSince from "../../../../../utils/timeSince"
import JobVehicles from "../../../../../components/jobs/job-vehicles"
import JonInformation from '../../../../../components/job-information-sidebar/JobInformation'
import ViewJobDetail from "../../../../../components/jobs/view-job-detail";

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

            if (!data || data.company.id !== company?.id) {
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
        
    }, [ id, company ]);

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
            globalAjaxExceptionHandler(e, { toast: toast, t: t, defaultMessage: "UNABLE_TO_DELETE"});
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
        hideCompanyName={false}
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
