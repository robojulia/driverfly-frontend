import { useState } from "react";
import { Button } from "react-bootstrap";
import { ClockHistory, Eye } from "react-bootstrap-icons";
import { useTranslation } from "../../hooks/use-translation";
import { DocumentHistoryEntity } from "../../models/documents/document-history.entity";
import DocumentApi from "../../pages/api/document";
import { ViewDocumentHistoryProps } from "../../types/applicant/view-document-history-props.type";
import ShowFormattedDate from "../jobs/show-formatted-date";
import ViewDataTable from "../view-details/view-data-table";
import ViewModal from "../view-details/view-modal";
import ViewPdf from "../view-details/view-pdf";
import { handleDownloadDocument, handleViewDocument } from "../../utils/documents/button-actions";
import { DownloadDocumentButton, ViewDocumentButton } from "./buttons";


export default function ViewDocumentHistory({
    buttonClass,
    document,
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
            documentable_type: document?.documentable_type as string ?? documentable_type,
            documentable_id: document?.documentable_id ?? documentable_id,
        })
        if (!data?.length) alert(t('NO_RECORDS_FOUND'))
        setDocumentHistory(data)
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
                                <ViewDocumentButton
                                    className="btn btn-success p-0 py-1 mr-2 w-50"
                                    document={document}
                                    onClick={() => handleViewDocument(doc.id, setPdf)}
                                />
                                <DownloadDocumentButton
                                    className="btn theme-primary2-btn p-0 py-1 mr-2 w-50"
                                    document={document}
                                    onClick={() => handleDownloadDocument(doc.id)}
                                />
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