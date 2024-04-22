import { useState } from "react";
import { Button } from "react-bootstrap";
import { ClockHistory, CloudArrowDown, Eye } from "react-bootstrap-icons";
import { useTranslation } from "../../hooks/use-translation";
import { DocumentHistoryEntity } from "../../models/documents/document-history.entity";
import DocumentApi from "../../pages/api/document";
import { ViewDocumentHistoryProps } from "../../types/applicant/view-document-history-props.type";
import ShowFormattedDate from "../jobs/show-formatted-date";
import ViewDataTable from "../view-details/view-data-table";
import ViewModal from "../view-details/view-modal";
import ViewPdf from "../view-details/view-pdf";


export default function ViewDocumentHistory({
    buttonClass,
    document: doc,
    type,
    documentable_type,
    documentable_id,
    typePrefix
}: ViewDocumentHistoryProps) {

    const { t } = useTranslation();

    const [pdf, setPdf] = useState({});
    const [documentHistory, setDocumentHistory] = useState<DocumentHistoryEntity[]>([])

    /**
     * It sets the document history to an empty array.
     */
    const resetDocumentHistory = () => setDocumentHistory([])

    /**
     * It fetches the document history of an document and sets the state of the document history
     */
    const viewHistory = async () => {
        const documentApi = new DocumentApi()
        const data = await documentApi.getDocumentHistory({
            type: type,
            documentable_type: doc?.documentable_type as string ?? documentable_type,
            documentable_id: doc?.documentable_id ?? documentable_id,
        })
        if (!data?.length) alert(t('NO_RECORDS_FOUND'))
        setDocumentHistory(data)
    }

    const handleDownloadDocument = async (path: string): Promise<void> => {


        // Make a request to get the file data
        const response = await fetch(path);
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
                            selector: doc => t(`${typePrefix}.${doc.type}`),
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
                            cell: doc => <>
                                <Button
                                    onClick={() => {
                                        setPdf({
                                            name: `(${doc.name})`,
                                            url: doc.path
                                        })
                                    }}
                                    className="btn btn-success p-0 py-1 mr-2 w-50"><Eye /></Button>
                                <button
                                    type="button"
                                    onClick={() => handleDownloadDocument(doc.path)}
                                    className={"btn theme-primary2-btn p-0 pt-1 mr-2"}
                                >
                                    <CloudArrowDown />
                                </button>
                            </>,
                            hidable: false
                        },
                    ]}
                    items={documentHistory}
                />
            </ViewModal>
            <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />

        </>
    )
}