import { DocumentEntity } from './../../models/documents/document.entity';

export type ViewDocumentHistoryProps = {
    type: string;
    typePrefix?: string;
    document?: DocumentEntity;
    documentable_id?: number;
    documentable_type?: string;
    buttonClass?: string;
}
