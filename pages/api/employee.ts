import { EmployeeEntity } from "../../models/applicant/employee.entity";
import BaseApi from "./_baseApi";

class EmployeeApi extends BaseApi {
	baseUrl = (applicantId) => (`applicant/${applicantId}/employee`)

	constructor() {
		super();
	}

	async create(applicantId: number, jobId: number, dto: EmployeeEntity): Promise<EmployeeEntity> {
		const { data } = await this.post(`${this.baseUrl(applicantId)}/jobs/${jobId}`, dto);

		return data;
	}

	async update(id: number, dto: EmployeeEntity): Promise<EmployeeEntity> {
		const { data } = await this.put(this.baseUrl + "/" + id, dto);

		return data;
	}

	async remove(id: number): Promise<EmployeeEntity | void> {
		const { data } = await this.delete(`${this.baseUrl}/${id}`);

		return data;
	}

}

export default EmployeeApi;