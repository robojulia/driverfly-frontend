import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { useTranslation } from "../../hooks/use-translation";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import ViewModal from "../view-details/view-modal";

export interface DeleteButtonProps<TContext> {
    context?: TContext;
    onDelete: (context?: TContext) => Promise<void>;
}

export function DeleteButton<TContext>(props: DeleteButtonProps<TContext>) {
    const { onDelete, context } = props;

    const { t } = useTranslation();

    const [ showDialog, setShowDialog ] = useState(false);

    async function onClick(e: React.MouseEvent) {
        setShowDialog(true);
    }

    async function onCloseClick() {
        setShowDialog(false);
    }

    async function onConfirmClick() {
        try {
            await onDelete(context);
        }
        catch (e) {
            globalAjaxExceptionHandler(e, { t: t, toast: toast, defaultMessage: "UNABLE_TO_DELETE" });
        }
        finally {
            setShowDialog(false);
        }
    }

    return (
        <>
            <Button type="button" variant="danger" onClick={onClick}>
                <Trash /> {t("DELETE")}
            </Button>
            <ViewModal
                show={showDialog}
                title="DELETE_CONFIRMATION"
                closeText="CANCEL"
                onCloseClick={onCloseClick}
                footer={(
                    <ButtonGroup>
                        <Button type="button" variant="info" onClick={onCloseClick}>
                            {t("DO_NOT_DELETE")}
                        </Button>
                        <Button type="button" variant="danger" onClick={onConfirmClick}>
                            {t("DELETE")}
                        </Button>
                    </ButtonGroup>
                )}
                >
                {t("ARE_YOU_SURE_YOU_WANT_TO_DELETE")}
            </ViewModal>
        </>
    );
}