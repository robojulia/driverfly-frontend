import { EmployeeEmployerEntity } from './../../models/employee/employee-employer.entity';
import { EmployeeDocumentType } from './../../enums/employee/employee-document-types.enum';
import BaseApi from "./_baseApi";
import { EmployeeEntity } from "../../models/employee/employee.entity";
import { HireApplicantDto } from "../../models/applicant/hire-applicant.dto";
import { DocumentEntity } from "../../models/documents/document.entity";

export default class EmployeeApi extends BaseApi {
	baseUrl: string = "employee";
	constructor() {
		super();
	}

	async list(): Promise<EmployeeEntity[]> {
		const { data } = await this.get(`${this.baseUrl}`);

		return data;
	}

	async getById(id: number): Promise<EmployeeEntity> {
		const { data } = await this.get(this.buildUrl(`${this.baseUrl}/${id}`));

		return data;
	}

	async hire(dto: HireApplicantDto): Promise<EmployeeEntity> {
		const { data } = await this.post(`${this.baseUrl}`, dto);

		return data;
	}

	async update(id: number, dto: EmployeeEntity): Promise<EmployeeEntity> {
		const { data } = await this.put(`${this.baseUrl}/${id}`, dto);

		return data;
	}

	async remove(id: number): Promise<EmployeeEntity | void> {
		const { data } = await this.delete(`${this.baseUrl}/${id}`);

		return data;
	}

	documents = {
		baseUrl: (employeeId: number) =>
			`${this.baseUrl}/${employeeId}/documents`,
		create: async (
			employeeId: number,
			dto: DocumentEntity
		): Promise<DocumentEntity> => {
			const { data } = await this.post(this.documents.baseUrl(employeeId), dto);

			return data;
		},
		delete: async (
			employeeId: number,
			type: EmployeeDocumentType | string
		): Promise<DocumentEntity> => {
			const { data } = await this.delete(`${this.documents.baseUrl(employeeId)}/${type}`);

			return data;
		},
	};

	employer = {
		baseUrl: (employeeId: number) => `${this.baseUrl}/${employeeId}/employer`,
		getByUuidToken: async (uuid_token: string): Promise<EmployeeEmployerEntity> => {
			const { data } = await this.get(this.buildUrl(`${this.baseUrl}/fetch-employer/${uuid_token}`));

			return data;
		},
		list: async (employeeId: number): Promise<EmployeeEmployerEntity[]> => {
			const { data } = await this.get(`${this.employer.baseUrl(employeeId)}`);

			return data;
		},
		sendVoeRequest: async (employeeId: number, employerId: number): Promise<EmployeeEmployerEntity> => {
			const { data } = await this.get(`${this.employer.baseUrl(employeeId)}/${employerId}/send-voew-request`);

			return data;
		},
		documents: {
			baseUrl: (employeeId: number, employerId: number) =>
				`${this.employer.baseUrl(employeeId)}/${employerId}/documents`,
			create: async (
				employeeId: number,
				employerId: number,
				dto: DocumentEntity
			): Promise<DocumentEntity> => {
				const { data } = await this.post(
					`${this.employer.documents.baseUrl(employeeId, employerId)}`,
					dto
				);

				return data;
			},
			delete: async (
				employeeId: number,
				employerId: number,
				type: EmployeeDocumentType | string
			): Promise<void> => {
				const { data } = await this.delete(
					`${this.employer.documents.baseUrl(employeeId, employerId)}/${type}`
				);

				return data;
			},
		},
	};

}