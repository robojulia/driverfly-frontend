import { SavedJobEntity } from "../../models/saved-jobs/saved-job.entity";
import BaseApi from "./_baseApi";

export default class SavedJobApi extends BaseApi {
  baseUrl: string = "saved-jobs";
  constructor() {
    super();
  }
  async list(): Promise<SavedJobEntity[]> {
    const { data } = await this.get(this.baseUrl);
    return data;
  }
  async getByJobId(jobId: number): Promise<SavedJobEntity> {
    const { data } = await this.get(`${this.baseUrl}/job/${jobId}`);
    return data;
  }
  async saveJob(jobId: number): Promise<SavedJobEntity> {
    const { data } = await this.post(`${this.baseUrl}/job/${jobId}`, {});

    return data;
  }
  async remove(jobId: number): Promise<void> {
    await this.delete(`${this.baseUrl}/job/${jobId}`);
  }
}