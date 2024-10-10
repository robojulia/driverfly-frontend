import { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { ClockHistory, CloudArrowDown, Eye, Trash } from "react-bootstrap-icons";
import { useTranslation } from "../../hooks/use-translation";
import { DocumentHistoryEntity } from "../../models/documents/document-history.entity";
import DocumentApi from "../../pages/api/document";
import { ViewDocumentHistoryProps } from "../../types/applicant/view-document-history-props.type";
import ShowFormattedDate from "../jobs/show-formatted-date";
import ViewDataTable from "../view-details/view-data-table";
import ViewModal from "../view-details/view-modal";
import ViewPdf from "../view-details/view-pdf";
import { toast } from "react-toastify";


export default function ViewDocumentHistory({
    canDelete,
    buttonClass,
    document: doc,
    type,
    documentable_type,
    documentable_id,
    typePrefix
}: ViewDocumentHistoryProps) {

    const { t } = useTranslation();
    const documentApi = new DocumentApi()

    const [pdf, setPdf] = useState({});
    const [documentHistory, setDocumentHistory] = useState<DocumentHistoryEntity[]>([])
    const [deleteId, setDeleteId] = useState<number>(null);

    async function handleClick(id: number) {
        setDeleteId(id);
    }

    async function onCloseClick() {
        setDeleteId(null);
    }

    async function onConfirmClick() {
        try {
            await handleDeleteDocument(deleteId);
        }
        catch (e) {
            toast.error(t("UNABLE_TO_DELETE"))
        }
        finally {
            setDeleteId(null);
        }
    }

    /**
     * It sets the document history to an empty array.
     */
    const resetDocumentHistory = () => setDocumentHistory([])

    /**
     * It fetches the document history of an document and sets the state of the document history
     */
    const viewHistory = async () => {
        const data = await documentApi.getDocumentHistory({
            type: type,
            documentable_type: doc?.documentable_type as string ?? documentable_type,
            documentable_id: doc?.documentable_id ?? documentable_id,
        })
        if (!data?.length) alert(t('NO_RECORDS_FOUND'))
        setDocumentHistory(data)
    }

    const handleViewDocument = async (id: number, name?: string): Promise<void> => {
        const document: DocumentHistoryEntity = await documentApi.getSignedUrlForHistory(id);

        if (document) {
            setPdf({
                name: name ?? document.name,
                url: document.path
            });
        }
    }

    const handleDownloadDocument = async (id: number): Promise<void> => {
        const doc: DocumentHistoryEntity = await documentApi.getSignedUrlForHistory(id);

        // Make a request to get the file data
        const response = await fetch(doc.path);
        const fileBlob = await response.blob();

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(fileBlob);
        link.download = doc.name;

        document.body.appendChild(link);

        // Simulate a click on the link to trigger the download
        link.click();

        // Clean up the temporary link
        document.body.removeChild(link);
        link.remove();
    }

    const handleDeleteDocument = async (documentId: number): Promise<void> => {
        await documentApi.deleteHistoryDoccument(documentId);
        setDocumentHistory(documentHistory.filter(({ id }) => (id != documentId)))
        toast.success(t('DOCUMENT_DELETED_SUCCESS_MESSAGE'))
    }

    return (
        <>
            <Button
                className={buttonClass}
                title={t("HISTORY")}
                onClick={() => { viewHistory() }}
            ><ClockHistory /></Button>

            <ViewModal
                show={Boolean(documentHistory?.length)}
                onCloseClick={resetDocumentHistory}
                closeText="CANCEL"
                title="DOCUMENT_HISTORY"
            >
                <ViewDataTable<DocumentHistoryEntity>
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
                            name: "TYPE",
                            selector: doc => typePrefix ? t(`${typePrefix}.${doc.type}`) : doc.type,
                            hidable: false
                        },
                        {
                            name: "NAME",
                            selector: doc => doc.name,
                            hidable: false
                        },
                        {
                            name: "upload_date",
                            selector: doc => doc.created_at,
                            cell: doc => <ShowFormattedDate date={doc.created_at} />,
                            hidable: false
                        },
                        {
                            cell: document => <>
                                {!document?.name?.includes(".doc") &&
                                    <Button
                                        type="button"
                                        onClick={() => handleViewDocument(document.id)}
                                        className="btn btn-success p-0 py-1 mr-2 w-50"><Eye /></Button>
                                }
                                <Button
                                    type="button"
                                    onClick={() => handleDownloadDocument(document.id)}
                                    className={"btn theme-primary2-btn p-0 py-1 mr-2 w-50"}
                                >
                                    <CloudArrowDown />
                                </Button>
                                {canDelete && <button
                                    type="button"
                                    onClick={() => handleClick(document.id)}
                                    className={"btn btn-danger p-0 py-1 mr-2 w-50"}
                                >
                                    <Trash />
                                </button>}
                            </>,
                            hidable: false
                        },
                    ]}
                    items={documentHistory}
                />
            </ViewModal>
            <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />

            <ViewModal
                show={Boolean(deleteId)}
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
    )
}