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
    try {
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
    } catch (error) {
        console.error('Error downloading document:', error);
        throw error;
    }
}

type StateHandler<T> = React.Dispatch<SetStateAction<T>>;

/**
 * It gets the signed URL for a document and sets the state of the PDF viewer
 * @param {number} id - The id of the document you want to view
 * @param {StateHandler<ViewPdfProps>} setPdf - The state setter for the PDF viewer
 * @param {string} name - Optional name for the document
 * @param {DocumentEntity} documentEntity - Optional pre-loaded document entity with path
 */
export const handleViewDocument = async (
    id: number,
    setPdf: StateHandler<ViewPdfProps>,
    name?: string,
    documentEntity?: DocumentEntity
): Promise<void> => {
    try {
        // If document entity with path is already provided, use it directly
        if (documentEntity && documentEntity.path) {
            setPdf({
                name: name ?? documentEntity.name,
                url: documentEntity.path
            });
            return;
        }

        // Otherwise, fetch the signed URL from API
        const api = new DocumentApi();
        const document: DocumentEntity = await api.getSignedUrl(id);

        if (document) {
            setPdf({
                name: name ?? document.name,
                url: document.path
            });
        }
    } catch (error: any) {
        console.error('Error viewing document:', error);

        // Check if it's a 401 authentication error
        if (error?.response?.status === 401) {
            console.error('Authentication error: Token may be expired or invalid');
            // Re-throw with more context
            const authError = new Error('You do not have permission to view this document. Please log in again.');
            (authError as any).originalError = error;
            throw authError;
        }

        throw error;
    }
}



