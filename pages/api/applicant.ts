import { AxiosRequestConfig } from 'axios';
import { ApplicantDocumentType } from '../../enums/applicants/applicant-document-type.enum';
import { ApplicantFormStatus } from '../../enums/applicants/applicant-form-status.enum';
import { ApplicantOnBoardingChecklist } from '../../enums/applicants/applicant-onboarding-checklist.enum';
import {
  ApplicantEmployerEntity,
  ApplicantVoeEntity,
  SearchApplicantDto,
} from '../../models/applicant';
import { ApplicantDacEntity } from '../../models/applicant/applicant-dac.entity';
import { ApplicantJobEntity } from '../../models/applicant/applicant-job.entity';
import { ApplicantNoteEntity } from '../../models/applicant/applicant-note.entity';
import { ApplicantSuggestedJobEntity } from '../../models/applicant/applicant-suggested-job.entity';
import { ApplicantVehicleEntity } from '../../models/applicant/applicant-vehicle-entity';
import { ApplicantEntity } from '../../models/applicant/applicant.entity';
import { SendBackgroundRequestDto } from '../../models/applicant/send-background-request.dto';
import { DocumentEntity } from '../../models/documents/document.entity';
import { VerifyOTPDto } from '../../models/jot-form/OTP/verify-otp.dto';
import { UpsertApplicantJotformDto } from '../../models/jot-form/upsert-applicant-jotform.dto';
import { UpsertApplicantVoeformDto } from '../../models/jot-form/upsert-applicant-voe.dto';
import { Pagination } from '../../types/pagination.type';
import BaseApi from './_baseApi';

interface FetchByUuidTokenParams {
  withRelations?: string[];
}
export default class ApplicantApi extends BaseApi {
  baseUrl: string = 'applicants';
  constructor() {
    super();
  }

  async create(dto: ApplicantEntity): Promise<ApplicantEntity> {
    console.log('dto', { dto });

    const { data } = await this.post(this.baseUrl, dto);

    return data;
  }

  async createBulk(
    dtos: ApplicantEntity[],
    config?: AxiosRequestConfig
  ): Promise<{ data?: ApplicantEntity; error?: string }[]> {
    const { data } = await this.post(`${this.baseUrl}/bulk`, dtos, config);

    return data;
  }

  async update(id: number, dto: ApplicantEntity): Promise<ApplicantEntity> {
    const { data } = await this.put(this.baseUrl + '/' + id, dto);

    return data;
  }

  async sendVoeRequest(dto: SendBackgroundRequestDto): Promise<ApplicantEntity> {
    const { data } = await this.post(`${this.baseUrl}/send-background-request`, dto);

    return data;
  }

  async remove(id: number): Promise<ApplicantEntity | void> {
    const { data } = await this.delete(`${this.baseUrl}/${id}`);

    return data;
  }

  async assign(id: number) {
    const { data } = await this.post(this.baseUrl + '/' + id + '/assign', null);

    return data;
  }

  async unassign(id: number) {
    const { data } = await this.delete(this.baseUrl + '/' + id + '/assign');

    return data;
  }

  async search(params: ApplicantEntity, config?: AxiosRequestConfig): Promise<ApplicantEntity[]> {
    const { data } = await this.get(this.buildUrl(this.baseUrl + '/search', params), config);

    return data;
  }

  async searchByPublic(params: ApplicantEntity): Promise<any> {
    const { data } = await this.get(this.buildUrl(this.baseUrl + '/public-search', params));

    return data;
  }
  // new api to fetch applicant Profile
  async searchApplicantProfile(params: ApplicantEntity): Promise<ApplicantEntity> {
    const { data } = await this.get(this.buildUrl(this.baseUrl + '/search-applicant', params));

    return data;
  }

  async requestOTP(dto: ApplicantEntity): Promise<any> {
    const { data } = await this.post(this.baseUrl + '/request-otp', dto);

    return data;
  }
  async verifyOTP(dto: VerifyOTPDto): Promise<ApplicantEntity> {
    const { data } = await this.post(this.baseUrl + '/verify-otp', dto);

    return data;
  }

  async list(
    params?: SearchApplicantDto
  ): Promise<Pagination<ApplicantEntity> | ApplicantEntity[]> {
    const { data } = await this.get(this.buildUrl(this.baseUrl + '/list', params));

    return data;
  }
  async getById(id: number): Promise<ApplicantEntity> {
    const { data } = await this.get(this.buildUrl(this.baseUrl + `/${id}`));

    return data;
  }

  async getByUuidToken(uuid_token: string): Promise<ApplicantEntity> {
    const { data } = await this.get(this.buildUrl(this.baseUrl + `/fetch-applicant/${uuid_token}`));

    return data;
  }

  async fetchByUuidToken(
    uuid_token: string,
    params?: FetchByUuidTokenParams
  ): Promise<ApplicantEntity> {
    const { data } = await this.get(
      this.buildUrl(this.baseUrl + `/fetch-by-uuid/${uuid_token}`, params)
    );

    return data;
  }

  // user specific actions
  async getByUserId(userId: number): Promise<ApplicantEntity> {
    const { data } = await this.get(`${this.baseUrl}/user/${userId}`);

    return data;
  }

  me = {
    get: async (): Promise<ApplicantEntity> => {
      const { data } = await this.get(this.baseUrl);

      return data;
    },
    jobs: async (): Promise<ApplicantJobEntity[]> => {
      const { data } = await this.get(this.baseUrl + '/jobs');

      return data;
    },
    suggestedJobs: async (): Promise<ApplicantSuggestedJobEntity[]> => {
      const { data } = await this.get(this.baseUrl + '/suggested-jobs');

      return data;
    },
    update: async (dto: ApplicantEntity): Promise<ApplicantEntity> => {
      const { data } = await this.put(this.baseUrl, dto);

      return data;
    },
  };

  suggestedJobs = {
    get: async (applicantId: number): Promise<ApplicantSuggestedJobEntity[]> => {
      const { data } = await this.get(`${this.baseUrl}/${applicantId}/suggested-jobs`);

      return data;
    },
  };

  documents = {
    baseUrl: (applicantId: number) => `${this.baseUrl}/${applicantId}/documents`,
    create: async (applicantId: number, dto: DocumentEntity): Promise<DocumentEntity> => {
      const { data } = await this.post(this.documents.baseUrl(applicantId), dto);

      return data;
    },
    delete: async (
      applicantId: number,
      type: ApplicantDocumentType | ApplicantOnBoardingChecklist | string
    ): Promise<DocumentEntity> => {
      const { data } = await this.delete(`${this.documents.baseUrl(applicantId)}/${type}`);

      return data;
    },
  };

  jotform = {
    baseUrl: () => `${this.baseUrl}/applicant-jotform`,
    create: async (companyId: number, dto: UpsertApplicantJotformDto): Promise<ApplicantEntity> => {
      const { data } = await this.post(`${this.jotform.baseUrl()}?companyId=${companyId}`, dto);
      return data;
    },
    update: async (
      applicantId: number,
      dto: UpsertApplicantJotformDto
    ): Promise<ApplicantEntity> => {
      const { data } = await this.put(`${this.jotform.baseUrl()}/${applicantId}`, dto);
      return data;
    },
    mark: async (uuid_token: string, status: ApplicantFormStatus): Promise<void> => {
      const { data } = await this.patch(
        `${this.jotform.baseUrl()}/${uuid_token}/mark/${status}`,
        null
      );
      return data;
    },
    updateDocuments: async (
      applicantId: number,
      dto: DocumentEntity[]
    ): Promise<ApplicantEntity> => {
      const { data } = await this.put(`${this.jotform.baseUrl()}/${applicantId}/documents`, dto);
      return data;
    },
    suggestedJobs: async (applicantId: number): Promise<ApplicantSuggestedJobEntity[]> => {
      const { data } = await this.get(`${this.baseUrl}/${applicantId}/jotform-suggested-jobs`);

      return data;
    },
  };

  voeform = {
    baseUrl: () => `${this.baseUrl}/voe`,
    submitVoe: async (dto: UpsertApplicantVoeformDto): Promise<any> => {
      const { data } = await this.post(`${this.voeform.baseUrl()}/submit`, dto);
      return data;
    },
    fetch: async (applicant_uuid: string, employer_uuid: string): Promise<ApplicantVoeEntity> => {
      const { data } = await this.get(
        `${this.voeform.baseUrl()}/fetch/${applicant_uuid}/${employer_uuid}`
      );

      return data;
    },
  };

  employer = {
    baseUrl: (applicantId: number) => `${this.baseUrl}/${applicantId}/employer`,
    getByUuidToken: async (uuid_token: string): Promise<ApplicantEmployerEntity> => {
      const { data } = await this.get(
        this.buildUrl(`${this.baseUrl}/fetch-employer/${uuid_token}`)
      );

      return data;
    },
    list: async (applicantId: number): Promise<ApplicantEmployerEntity[]> => {
      const { data } = await this.get(`${this.employer.baseUrl(applicantId)}`);

      return data;
    },
    sendVoeRequest: async (
      applicantId: number,
      employerId: number
    ): Promise<ApplicantEmployerEntity> => {
      const { data } = await this.get(
        `${this.employer.baseUrl(applicantId)}/${employerId}/send-voe-request`
      );

      return data;
    },
    search: async (params: ApplicantEmployerEntity): Promise<ApplicantEmployerEntity[]> => {
      const { data } = await this.get(this.buildUrl(this.baseUrl + '/employer/search', params));

      return data;
    },
    documents: {
      baseUrl: (applicantId: number, employerId: number) =>
        `${this.employer.baseUrl(applicantId)}/${employerId}/documents`,
      create: async (
        applicantId: number,
        employerId: number,
        dto: DocumentEntity
      ): Promise<DocumentEntity> => {
        const { data } = await this.post(
          `${this.employer.documents.baseUrl(applicantId, employerId)}`,
          dto
        );

        return data;
      },
      delete: async (
        applicantId: number,
        employerId: number,
        type: ApplicantDocumentType | ApplicantOnBoardingChecklist | string
      ): Promise<void> => {
        const { data } = await this.delete(
          `${this.employer.documents.baseUrl(applicantId, employerId)}/${type}`
        );

        return data;
      },
    },
  };

  notes = {
    baseUrl: (applicantId: number, noteId?: number) =>
      `${this.baseUrl}/${applicantId}/notes/${noteId || ''}`,
    create: async (applicantId: number, dto: ApplicantNoteEntity): Promise<ApplicantNoteEntity> => {
      const { data } = await this.post(this.notes.baseUrl(applicantId), dto);

      return data;
    },
    update: async (
      applicantId: number,
      noteId: number,
      dto: ApplicantNoteEntity
    ): Promise<ApplicantNoteEntity> => {
      const { data } = await this.put(this.notes.baseUrl(applicantId, noteId), dto);

      return data;
    },
    remove: async (applicantId: number, noteId: number): Promise<any> => {
      const { data } = await this.delete(this.notes.baseUrl(applicantId, noteId));

      return data;
    },
  };

  dac = {
    baseUrl: (applicantId: number, dacId?: number) =>
      `${this.baseUrl}/${applicantId}/dac/${dacId || ''}`,
    create: async (applicantId: number, dto: ApplicantDacEntity): Promise<ApplicantDacEntity> => {
      const { data } = await this.post(this.dac.baseUrl(applicantId), dto);

      return data;
    },
    update: async (
      applicantId: number,
      dacId: number,
      dto: ApplicantDacEntity
    ): Promise<ApplicantDacEntity> => {
      const { data } = await this.put(this.dac.baseUrl(applicantId, dacId), dto);

      return data;
    },
    remove: async (applicantId: number, dacId: number): Promise<any> => {
      const { data } = await this.delete(this.dac.baseUrl(applicantId, dacId));

      return data;
    },
  };

  jobs = {
    baseUrl: (applicantId: number) => `${this.baseUrl}/${applicantId}/jobs`,
    list: async (applicantId: number) => {
      const { data } = await this.get(this.jobs.baseUrl(applicantId));

      return data;
    },
    remove: async (applicantId: number, jobId: number) => {
      await this.delete(this.jobs.baseUrl(applicantId) + `/${jobId}`);
    },
    create: async (
      applicantId: number,
      jobId: number,
      dto: ApplicantJobEntity
    ): Promise<ApplicantEntity> => {
      const { data } = await this.post(this.jobs.baseUrl(applicantId) + `/${jobId}`, dto);

      return data;
    },
    update: async (
      applicantId: number,
      jobId: number,
      dto: ApplicantJobEntity
    ): Promise<ApplicantEntity> => {
      const { data } = await this.put(this.jobs.baseUrl(applicantId) + `/${jobId}`, dto);

      return data;
    },
  };

  vehicle = {
    baseUrl: (applicantId: number, applicantVehicleId?: number) =>
      `${this.baseUrl}/${applicantId}/vehicle/${applicantVehicleId || ''}`,
    list: async (applicantId: number) => {
      const { data } = await this.get(this.vehicle.baseUrl(applicantId));

      return data;
    },
    create: async (
      applicantId: number,
      dto?: ApplicantVehicleEntity
    ): Promise<ApplicantVehicleEntity> => {
      const { data } = await this.post(this.vehicle.baseUrl(applicantId), dto);

      return data;
    },
    update: async (
      applicantVehicleId: number,
      applicantId: number,
      dto: ApplicantVehicleEntity
    ): Promise<ApplicantVehicleEntity> => {
      const { data } = await this.put(this.vehicle.baseUrl(applicantId, applicantVehicleId), dto);

      return data;
    },
    remove: async (applicantId: number, applicantVehicleId: number): Promise<any> => {
      const { data } = await this.delete(this.vehicle.baseUrl(applicantId, applicantVehicleId));

      return data;
    },
  };

  async searchLite(params?: { search?: string; limit?: number; offset?: number }): Promise<{
    applicants: Array<{
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      city: string;
      state: string;
      fullName: string;
    }>;
    total: number;
  }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());

    const { data } = await this.get(`${this.baseUrl}/search-lite?${query.toString()}`);
    return data;
  }
}
