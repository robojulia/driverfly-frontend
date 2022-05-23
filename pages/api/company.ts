import { CompanyEntity } from "../../models/company/company.entity";
import BaseApi from "./_baseApi";
import { JobEntity } from "../../models/job/job.entity";

export default class CompanyApi extends BaseApi {
    companyId: number = null;
    constructor(companyId: number) {
        super();
        this.companyId = companyId;
    }
    baseUrl(companyId?: number): string { return `companies/${companyId ?? this.companyId}` }
    async getById(): Promise<CompanyEntity> {
        const { data } = await this.get("companies");

        return data;
    }
    async update(dto: CompanyEntity) : Promise<CompanyEntity> {
        const { data } = await this.put("companies", dto);

        return data;
    }
    async remove() : Promise<void> {
        await this.delete("companies");
    }
}