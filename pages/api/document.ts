import { DocumentEntity } from "../../models/documents/document.entity";
import BaseApi from "./_baseApi";

export default class DocumentApi extends BaseApi {
    async getSignedUrl(id: number): Promise<DocumentEntity> {
        const { data } = await this.get(`documents/${id}`);

        return data;
    }

    async getCompanyPhoto(id: number): Promise<DocumentEntity> {
        const { data } = await this.get(`documents/company/${id}/photo`);

        return data;
    }
    // /vehicle/:vehicleId/:type
    async getVehiclePhoto(vehicleId: number): Promise<DocumentEntity> {
        const { data } = await this.get(`documents/vehicle/${vehicleId}`);

        return data;
    }
}
