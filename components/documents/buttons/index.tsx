import { toast } from "react-toastify";
import { Button, ButtonGroup } from "react-bootstrap";
import { CloudArrowDown, Eye, Pen, Trash } from "react-bootstrap-icons";
import { TranslateInterface, useTranslation } from "../../../hooks/use-translation";
import { DocumentEntity } from "../../../models/documents/document.entity";
import { LoaderIcon } from "../../loading/loader-icon";
import ViewModal from "../../view-details/view-modal";
import { useState } from "react";

type ButtonProps = {
    document?: DocumentEntity;
    type?: string;
    t?: TranslateInterface;
    onClick?: (...args: any) => any;
    className?: string;
    isLoading?: boolean | (() => boolean);
    disabled?: boolean;
    style?: React.CSSProperties;
};

/**
 * This is a functional component that renders a button to add or update a document based on the
 * provided props.
 * @param  - The `AddDocumentButton` component takes in two props:
 */
export const AddDocumentButton = ({
    document,
    type,
    t,
    onClick,
    className,
    disabled,
    style,
}: ButtonProps) => (
    <>
        <Button
            type="button"
            className={className ?? "mr-2 w-100"}
            style={style}
            onClick={() => onClick(type, document?.id)}
            disabled={disabled}
        >
            {document ? <Pen /> : t("ADD")}
        </Button>
    </>
);

/* This is a functional component in TypeScript React that renders a delete button for a
document. It takes a prop `document` which is an object containing information about the document.
If the `document` prop is truthy, it renders an anchor tag with a trash icon that, when clicked,
calls the `handleDeleteDocument` function with the `document.type` as an argument. The button is
styled using Bootstrap classes. */
export const DeleteDocumentButton = ({
    document,
    onClick,
    className,
    isLoading,
    style,
}: ButtonProps) => {
    const [showDialog, setShowDialog] = useState(false);

    const { t } = useTranslation();

    async function handleClick(e: React.MouseEvent) {
        setShowDialog(true);
    }

    async function onCloseClick() {
        setShowDialog(false);
    }

    async function onConfirmClick() {
        try {
            await onClick(document.type);
        }
        catch (e) {
            toast.error(t("UNABLE_TO_DELETE"))
        }
        finally {
            setShowDialog(false);
        }
    }

    return (
        <>
            {document && (
                <>
                    <button
                        type="button"
                        className={className ?? "btn btn-danger  p-0 pt-1 mr-2 w-100"}
                        style={style}
                        onClick={handleClick}
                    >
                        <Trash /> <LoaderIcon isLoading={Boolean(isLoading)} />
                    </button>
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
                        {t("ARE_YOU_SURE_YOU_WANT_TO_DELETE_FILE")}
                    </ViewModal>

                </>
            )}
        </>
    )
};

/* This is a functional component in TypeScript React that renders a button with a cloud
arrow down icon. It takes a prop called "document" and checks if it exists. If it does, it renders
the button with an onClick event that calls a function called "handleDownloadDocument" with the
document's ID as an argument. If the "document" prop does not exist, it does not render anything. */
export const DownloadDocumentButton = ({
    document,
    onClick,
    className,
    isLoading,
    style,
}: ButtonProps) => (
    <>
        {document && (
            <button
                type="button"
                onClick={() => onClick(document.id)}
                className={className ?? "btn theme-primary2-btn p-0 pt-1 mr-2"}
                style={style}
            >
                <CloudArrowDown /> <LoaderIcon isLoading={Boolean(isLoading)} />
            </button>
        )}
    </>
);

/* This code is a functional component in TypeScript React that renders a button with an Eye icon.
It takes a prop called `document` and checks if it exists. If it does, it renders an anchor tag with
the Eye icon and a click event listener that calls the `handleViewDocument` function with the
`document.id` as an argument. The button has a class name and some styles applied to it. */
export const ViewDocumentButton = ({
    document,
    onClick,
    className,
    isLoading,
    style,
}: ButtonProps) => (
    <>
        {document && (
            <button
                type="button"
                className={className ?? "btn btn-success p-0 pt-1 mr-2 w-100"}
                style={style}
                onClick={() => onClick(document.id)}
            >
                <Eye /> <LoaderIcon isLoading={Boolean(isLoading)} />
            </button>
        )}
    </>
);
