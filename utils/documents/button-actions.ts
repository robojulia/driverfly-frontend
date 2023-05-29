import { SetStateAction } from "react";
import { DocumentEntity } from "../../models/documents/document.entity";
import DocumentApi from "../../pages/api/document";
import { ViewPdfProps } from "../../components/view-details/view-pdf";

/**
 * This function downloads a document by getting a signed URL from an API and creating a temporary
 * link element to initiate the download.
 * @param {number} id - The `id` parameter is a number representing the ID of the document that
 * needs to be downloaded. It is used to fetch the signed URL of the document from the API.
 */
export const handleDownloadDocument = async (id: number): Promise<void> => {

    const api = new DocumentApi();
    const doc: DocumentEntity = await api.getSignedUrl(id);

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

type StateHandler<T> = React.Dispatch<SetStateAction<T>>;

/**
 * It gets the signed URL for a document and sets the state of the PDF viewer
 * @param {number} id - The id of the document you want to view
 */
export const handleViewDocument = async (id: number, setPdf: StateHandler<ViewPdfProps>): Promise<void> => {
    const api = new DocumentApi();

    const document: DocumentEntity = await api.getSignedUrl(id);

    if (document) {
        setPdf({
            name: document.name,
            url: document.path
        });
    }
}



