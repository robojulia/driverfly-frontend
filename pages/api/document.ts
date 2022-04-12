import { DocumentEntity } from "../../models/documents/document.entity";
import { DriverEntity } from "../../models/driver/Driver.entity";
import { DriverPreferenceEntity } from "../../models/driver/DriverPreference.entity";
import BaseApi from "./_baseApi";

export default class DocumentApi extends BaseApi {
    async getSignedUrl(id: number): Promise<DocumentEntity> {
        const { data } = await this.get(`documents/${id}`);

        return data;
    }
}
