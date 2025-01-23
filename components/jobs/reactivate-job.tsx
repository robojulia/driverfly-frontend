import React from "react";
import { Button, ButtonGroup, ButtonProps } from "react-bootstrap";
import { Recycle } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { useTranslation } from "../../hooks/use-translation";
import { JobEntity } from "../../models/job/job.entity";
import JobApi from "../../pages/api/job";
import { isExpired } from "../../utils/date";
import BaseInput from "../forms/base-input";
import ViewModal from "../view-details/view-modal";

export interface ReactivateJobProps extends ButtonProps {
    job: JobEntity;
    onComplete?: (job?: JobEntity) => void;
}

export function ReactivateJobButton(props: ReactivateJobProps) {
    const { job, onComplete, ...rest } = props;

    if (!isExpired(job.expiry_date)) return <></>;

    const jobApi = new JobApi();
    const { t } = useTranslation();

    const [showDialog, setShowDialog] = React.useState(false);
    const [expiryDate, setExpiryDate] = React.useState<string | Date>(job?.expiry_date);

    function onClick(e: React.MouseEvent) {
        setShowDialog(true);
        setExpiryDate(job?.expiry_date);
    }

    const onCloseClick = () => setShowDialog(false);

    const onConfirmClick = React.useCallback(async (e: React.MouseEvent) => {
        try {
            const data = await jobApi.update(+job.id, {
                ...job,
                expiry_date: expiryDate,
            });
            onComplete(data);
        } catch (e) {
            toast.error("UNABLE_TO_SAVE_INFORMATION");
        } finally {
            setShowDialog(false);
        }
    }, [expiryDate, job])

    return (
        <>
            <Button type="button" onClick={onClick} {...rest}>
                <Recycle /> {t("REACTIVATE")}
            </Button>
            <ViewModal
                show={showDialog}
                title="REACTIVATE_JOB"
                closeText="CANCEL"
                onCloseClick={onCloseClick}
                footer={
                    <ButtonGroup>
                        <Button
                            disabled={isExpired(expiryDate) || !expiryDate}
                            type="button"
                            variant="info"
                            onClick={onConfirmClick}
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
        </>
    );
}
