import { AxiosRequestConfig } from "axios";
import { ApplicantStatus } from "../../enums/applicants/applicant-status.enum";
import { ApplicantDacEntity } from "../../models/applicant/applicant-dac.entity";
import { ApplicantJobEntity } from "../../models/applicant/applicant-job.entity";
import { ApplicantNoteEntity } from "../../models/applicant/applicant-note.entity";
import { ApplicantSuggestedJobEntity } from "../../models/applicant/applicant-suggested-job.entity";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { DocumentEntity } from "../../models/documents/document.entity";
import { ApplicantJobsByStatusDto } from "../../models/job/applicant-jobs-by-status.dto";
import { UpsertApplicantJotformDto } from "../../models/jot-form/upsert-applicant-jotform.dto";
import { UpsertApplicantVoeformDto } from "../../models/jot-form/upsert-applicant-voe.dto";
import BaseApi from "./_baseApi";

class ApplicantApi extends BaseApi {
	baseUrl: string = "applicants";
	constructor() {
		super();
	}

	async create(dto: ApplicantEntity): Promise<ApplicantEntity> {
		const { data } = await this.post(this.baseUrl, dto);

		return data;
	}

	async update(id: number, dto: ApplicantEntity): Promise<ApplicantEntity> {
		const { data } = await this.put(this.baseUrl + "/" + id, dto);

		return data;
	}

	async assign(id: number) {
		const { data } = await this.post(this.baseUrl + "/" + id + "/assign", null);

		return data;
	}

	async unassign(id: number) {
		const { data } = await this.delete(this.baseUrl + "/" + id + "/assign");

		return data;
	}

	async search(
		params: ApplicantEntity,
		config?: AxiosRequestConfig
	): Promise<ApplicantEntity[]> {
		const { data } = await this.get(
			this.buildUrl(this.baseUrl + "/search", params),
			config
		);

		return data;
	}

	async list(params?: {
		jobId?: number;
		email?: string;
	}): Promise<ApplicantEntity[]> {
		const { data } = await this.get(
			this.buildUrl(this.baseUrl + "/list", params)
		);

		return data;
	}
	async getById(id: number): Promise<ApplicantEntity> {
		const { data } = await this.get(this.buildUrl(this.baseUrl + `/${id}`));

		return data;
	}

	async getByUuidToken(uuid_token: string): Promise<ApplicantEntity> {
		const { data } = await this.get(this.buildUrl(this.baseUrl + `/fetch/${uuid_token}`));

		return data;
	}

	// user specific actions
	async getByUserId(): Promise<ApplicantEntity> {
		const { data } = await this.get(this.baseUrl);

		return data;
	}

	me = {
		get: async (): Promise<ApplicantEntity> => {
			const { data } = await this.get(this.baseUrl);

			return data;
		},
		jobs: async (): Promise<ApplicantJobEntity[]> => {
			const { data } = await this.get(this.baseUrl + "/jobs");

			return data;
		},
		suggestedJobs: async (): Promise<ApplicantSuggestedJobEntity[]> => {
			const { data } = await this.get(this.baseUrl + "/suggested-jobs");

			return data;
		},
		update: async (dto: ApplicantEntity): Promise<ApplicantEntity> => {
			const { data } = await this.put(this.baseUrl, dto);

			return data;
		},
	};

	suggestedJobs = {
		get: async (
			applicantId: number
		): Promise<ApplicantSuggestedJobEntity[]> => {
			const { data } = await this.get(
				`${this.baseUrl}/${applicantId}/suggested-jobs`
			);

			return data;
		},
	};

	documents = {
		baseUrl: (applicantId: number) =>
			`${this.baseUrl}/${applicantId}/documents`,
		create: async (
			applicantId: number,
			dto: DocumentEntity
		): Promise<DocumentEntity> => {
			const { data } = await this.post(
				this.documents.baseUrl(applicantId),
				dto
			);

			return data;
		},
	};
	jotform = {
		baseUrl: () => `${this.baseUrl}/applicant-jotform`,
		create: async (
			dto: UpsertApplicantJotformDto
		): Promise<ApplicantEntity> => {
			const { data } = await this.post(`${this.jotform.baseUrl()}?companyId=${dto?.applicant?.company?.id}`, dto);
			return data;
		},
		update: async (
			applicantId: number,
			dto: UpsertApplicantJotformDto
		): Promise<ApplicantEntity> => {
			const { data } = await this.put(`${this.jotform.baseUrl()}/${applicantId}`, dto);
			return data;
		},
	};

	voeform = {
		baseUrl: () => `${this.baseUrl}/applicant-voeform`,
		create: async (dto: UpsertApplicantVoeformDto): Promise<any> => {
			const { data } = await this.post(this.voeform.baseUrl(), dto);
			return data;
		},
	};

	notes = {
		baseUrl: (applicantId: number, noteId?: number) =>
			`${this.baseUrl}/${applicantId}/notes/${noteId || ""}`,
		create: async (
			applicantId: number,
			dto: ApplicantNoteEntity
		): Promise<ApplicantNoteEntity> => {
			const { data } = await this.post(this.notes.baseUrl(applicantId), dto);

			return data;
		},
		update: async (
			applicantId: number,
			noteId: number,
			dto: ApplicantNoteEntity
		): Promise<ApplicantNoteEntity> => {
			const { data } = await this.put(
				this.notes.baseUrl(applicantId, noteId),
				dto
			);

			return data;
		},
		remove: async (applicantId: number, noteId: number): Promise<any> => {
			const { data } = await this.delete(
				this.notes.baseUrl(applicantId, noteId)
			);

			return data;
		},
	};

	dac = {
		baseUrl: (applicantId: number, dacId?: number) =>
			`${this.baseUrl}/${applicantId}/dac/${dacId || ""}`,
		create: async (
			applicantId: number,
			dto: ApplicantDacEntity
		): Promise<ApplicantDacEntity> => {
			const { data } = await this.post(this.dac.baseUrl(applicantId), dto);

			return data;
		},
		update: async (
			applicantId: number,
			dacId: number,
			dto: ApplicantDacEntity
		): Promise<ApplicantDacEntity> => {
			const { data } = await this.put(
				this.dac.baseUrl(applicantId, dacId),
				dto
			);

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
			const { data } = await this.post(
				this.jobs.baseUrl(applicantId) + `/${jobId}`,
				dto
			);

			return data;
		},
		update: async (
			applicantId: number,
			jobId: number,
			dto: ApplicantJobEntity
		): Promise<ApplicantEntity> => {
			const { data } = await this.put(
				this.jobs.baseUrl(applicantId) + `/${jobId}`,
				dto
			);

			return data;
		},
	};
}

export default ApplicantApi;
export { ApplicantApi };
