import { CompanyEntity } from "../../models/company/company.entity";
import BaseApi from "./_baseApi";
import { FindManyOptions } from "../../models/general/find-many-options.dto";
import { CompanyPreferenceCategory } from "../../enums/company/company-preference-category.enum";
import { CompanyPreferenceEntity } from "../../models/company/company-preferences.entity";
import { CompanyManagerEntity } from "../../models/company/company-manager.entity";
import { LocationEntity } from "../../models/company/location.entity";

export default class CompanyApi extends BaseApi {
  baseUrl: string = "companies"
  async list(params?: { withPhoto?: boolean }): Promise<CompanyEntity[]> {
    const { data } = await this.get(this.buildUrl(this.baseUrl + "/list", params));

    return data;
  }
  async findById(id: number, params?: { withPhoto?: boolean }): Promise<CompanyEntity> {
    const { data } = await this.get(this.buildUrl(`${this.baseUrl}/${id}`, params));

    return data;
  }
  async create(dto: CompanyEntity): Promise<CompanyEntity> {
    const { data } = await this.post(this.baseUrl, dto);

    return data;
  }
  async update(id: number, dto: CompanyEntity): Promise<CompanyEntity> {
    const { data } = await this.put(`${this.baseUrl}/${id}`, dto);

    return data;
  }
  async remove(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${id}`);
  }

  async keywordSearchQuery(params?: string): Promise<Partial<CompanyEntity>[]> {
    const { data } = await this.get(`${this.baseUrl}/keyword-search-query`, { params });
    return data;
  }

  me = {
    get: async (): Promise<CompanyEntity> => {
      const { data } = await this.get(this.baseUrl);

      return data;
    },
    update: async (dto: CompanyEntity): Promise<CompanyEntity> => {
      const { data } = await this.put(this.baseUrl, dto);

      return data;
    },
    remove: async (): Promise<void> => {
      await this.delete(this.baseUrl);
    },

  };

  employer = {
    baseUrl: "employer",
    getById: async (id: number, withJobs?: boolean): Promise<CompanyEntity> => {
      const { data } = await this.get(`${this.employer.baseUrl}/${id}?withJobs=${Boolean(withJobs)}`);

      return data;
    },
    // getByUUId: async (company_uuid: string, withJobs?: boolean): Promise<CompanyEntity> => {
    //   const { data } = await this.get(`${this.employer.baseUrl}/fetch/${company_uuid}?withJobs=${Boolean(withJobs)}`);

    //   return data;
    // },
    getBySlug: async (slug: string, withPhotoPath?: boolean): Promise<CompanyEntity> => {
      const { data } = await this.get(`${this.employer.baseUrl}/fetch/${slug}?withPhotoPath=${Boolean(withPhotoPath)}`);

      return data;
    },
    getTerminals: async (companyId: number): Promise<LocationEntity[]> => {
      const { data } = await this.get(`${this.employer.baseUrl}/${companyId}/terminals`);

      return data;
    },
    getJobCount: async (id: number): Promise<number> => {
      const { data } = await this.get(`${this.employer.baseUrl}/${id}/jobs-count`);

      return data;
    },
    list: async (params: FindManyOptions): Promise<CompanyEntity[]> => {
      const { data } = await this.get(`${this.employer.baseUrl}`, { params });

      return data;
    },
  }

  preferences = {
    baseUrl: (companyId: number) => `company/${companyId}/preferences`,
    list: async (companyId: number, query?: { category?: CompanyPreferenceCategory, label?: string }): Promise<CompanyPreferenceEntity[]> => {
      const { data } = await this.get(this.buildUrl(this.preferences.baseUrl(companyId), query));

      return data;
    },
    create: async (companyId: number, dto: CompanyPreferenceEntity): Promise<CompanyPreferenceEntity> => {
      const { data } = await this.post(this.preferences.baseUrl(companyId), dto);

      return data;
    },
    update: async (companyId: number, id: number, dto: CompanyPreferenceEntity): Promise<CompanyPreferenceEntity> => {
      const { data } = await this.put(`${this.preferences.baseUrl(companyId)}/${id}`, dto);

      return data;
    },
    remove: async (companyId: number, id: number): Promise<void> => {
      await this.delete(`${this.preferences.baseUrl(companyId)}/${id}`);
    }
  }

  manager = {
    baseUrl: (id?: number) => `company/manager/${id ?? ''}`,
    findById: async (id: number): Promise<CompanyManagerEntity> => {
      const { data } = await this.get(`${this.manager.baseUrl(id)}`);

      return data;
    },
    list: async (params?: FindManyOptions): Promise<CompanyManagerEntity[]> => {
      const { data } = await this.get(`${this.manager.baseUrl()}`, { params });

      return data;
    },
    create: async (dto: CompanyManagerEntity): Promise<CompanyManagerEntity> => {
      const { data } = await this.post(this.manager.baseUrl(), dto);

      return data;
    },
    update: async (id: number, dto: CompanyManagerEntity): Promise<CompanyManagerEntity> => {
      const { data } = await this.put(`${this.manager.baseUrl(id)}`, dto);

      return data;
    },
    remove: async (companyId: number, id: number): Promise<void> => {
      await this.delete(`${this.manager.baseUrl(companyId)}/${id}`);
    }
  }


}