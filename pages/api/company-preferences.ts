import { CompanyPreferencesEntity } from "../../models/company/company-preferences.entity";
import BaseApi from "./_baseApi";

export default class CompanyPreferencesApi extends BaseApi {
    baseUrl: string = "company-preferences";
    constructor() {
        super();
    }

    async companyPreferences(dto: CompanyPreferencesEntity): Promise<CompanyPreferencesEntity> {
        const { data } = await this.post(this.baseUrl, dto);
        return data;
    }
}