import { DocumentHistoryEntity } from './../../models/documents/document-history.entity';
import { DocumentEntity } from "../../models/documents/document.entity";
import BaseApi from "./_baseApi";

export default class DocumentApi extends BaseApi {
    baseUrl: string = "documents";

    async getSignedUrl(id: number): Promise<DocumentEntity> {
        const { data } = await this.get(`${this.baseUrl}/${id}`);

        return data;
    }

    async getCompanyPhoto(id: number): Promise<DocumentEntity> {
        const { data } = await this.get(`${this.baseUrl}/company/${id}/photo`);

        return data;
    }

    async getPhoto(documentableId?: number): Promise<DocumentEntity> {
        const { data } = await this.get(`${this.baseUrl}/${documentableId}/photo`);

        return data;
    }

    async getDocumentHistory(dto: DocumentHistoryEntity): Promise<DocumentHistoryEntity[]> {
        const { data } = await this.get(this.buildUrl(this.baseUrl + "/history", dto));

        return data;
    }
}
