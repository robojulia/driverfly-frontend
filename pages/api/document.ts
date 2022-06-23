import { DocumentableType } from "../../enums/documents/documentable-type.enum";
import { DocumentEntity, DocumentType } from "../../models/documents/document.entity";
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
}
