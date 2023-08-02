import { useState } from "react";
import { Button } from "react-bootstrap";
import { ClockHistory, Eye } from "react-bootstrap-icons";
import { ViewDocumentHistoryProps } from "../../types/applicant/view-document-history-props.type";
import ViewModal from "../view-details/view-modal";
import { DocumentHistoryEntity } from "../../models/documents/document-history.entity";
import DocumentApi from "../../pages/api/document";
import ViewDataTable from "../view-details/view-data-table";
import ShowFormattedDate from "../jobs/show-formatted-date";
import { useTranslation } from "../../hooks/use-translation";
import ViewPdf from "../view-details/view-pdf";


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
                            cell: doc => <Button
                                onClick={() => {
                                    setPdf({
                                        name: `(${doc.name})`,
                                        url: doc.path
                                    })
                                }}
                                className="btn btn-success p-0 py-1 mr-2 w-50"><Eye /></Button>,
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