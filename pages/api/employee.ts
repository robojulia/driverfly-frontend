import BaseApi from "./_baseApi";
import { EmployeeEntity } from "../../models/applicant/employee.entity";
import { HireApplicantDto } from "../../models/applicant/hire-applicant.dto";

export default class EmployeeApi extends BaseApi {
	baseUrl: string = "employee";
	constructor() {
		super();
	}

	async list(): Promise<EmployeeEntity[]> {
		const { data } = await this.get(`${this.baseUrl}`);

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
}