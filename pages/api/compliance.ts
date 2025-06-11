import { StoredFileDto } from "../../models/compiance/stored-file.dto";
import { DocumentEntity } from "../../models/documents/document.entity";
import { SendFileDto } from './../../models/compiance/send-file.dto';
import BaseApi from "./_baseApi";

export default class ComplianceApi extends BaseApi {
  baseUrl: string = "compliance";
  constructor() {
    super();
  }
  async filesList(): Promise<DocumentEntity[]> {
    const { data } = await this.get(`${this.baseUrl}/files`);
    return data;
  }
  async createFile(entity: StoredFileDto): Promise<DocumentEntity> {
    const { data } = await this.post(`${this.baseUrl}/files`, entity);

    return data;
  }
  async removeFile(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/files/${id}`);
  }
  async sendComplianceFile(dto: SendFileDto): Promise<void> {
    const { data } = await this.post(this.baseUrl + "/send-file", dto);

    return data;
  }
}