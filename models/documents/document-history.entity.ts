export class DocumentHistoryEntity {
    id?: number;
    name?: string;
    description?: string;
    path?: string;
    type?: string;

    mime_type?: string;
    file_base64?: string;

    documentable_id?: number;
    documentable_type?: string;
    created_at?: string;
    last_updated_at?: string;

}
