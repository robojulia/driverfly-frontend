import { AxiosRequestConfig } from 'axios';
import { HireApplicantDto } from '../../models/applicant/hire-applicant.dto';
import { DocumentEntity } from '../../models/documents/document.entity';
import { EmployeeEntity } from '../../models/employee/employee.entity';
import { EmployeeNoteEntity } from '../../models/employee/employee-note.entity';
import { SearchEmployeeDto } from '../../models/employee/search-employee.dto';
import { EmployeeDqf } from '../../enums/employee/employee-dqf.enum';
import { EmployeeEmployerEntity } from './../../models/employee/employee-employer.entity';
import BaseApi from './_baseApi';
import { Pagination } from '../../types/pagination.type';

export default class EmployeeApi extends BaseApi {
  baseUrl: string = 'employee';
  constructor() {
    super();
  }

  async list(dto?: SearchEmployeeDto): Promise<Pagination<EmployeeEntity> | EmployeeEntity[]> {
    const { data } = await this.get(`${this.buildUrl(this.baseUrl, dto)}`);

    return data;
  }

  async search(params: EmployeeEntity, config?: AxiosRequestConfig): Promise<EmployeeEntity[]> {
    const { data } = await this.get(this.buildUrl(this.baseUrl + '/search', params), config);

    return data;
  }

  async getById(id: number, relations?: string[]): Promise<EmployeeEntity> {
    const params = relations ? { relations: relations.join(',') } : {};
    const { data } = await this.get(this.buildUrl(`${this.baseUrl}/${id}`, params));

    return data;
  }

  async create(dto: EmployeeEntity): Promise<EmployeeEntity> {
    const { data } = await this.post(this.baseUrl, dto);

    return data;
  }

  async hire(dto: HireApplicantDto): Promise<EmployeeEntity> {
    const { data } = await this.post(`${this.baseUrl}/hire`, dto);

    return data;
  }

  async update(id: number, dto: EmployeeEntity): Promise<EmployeeEntity> {
    const { data } = await this.put(`${this.baseUrl}/${id}`, dto);

    return data;
  }

  async mark(id: number, dto: EmployeeEntity): Promise<EmployeeEntity> {
    const { data } = await this.patch(`${this.baseUrl}/${id}`, dto);

    return data;
  }

  async remove(id: number): Promise<EmployeeEntity | void> {
    const { data } = await this.delete(`${this.baseUrl}/${id}`);

    return data;
  }

  notes = {
    baseUrl: (employeeId: number) => `${this.baseUrl}/${employeeId}/notes`,
    create: async (employeeId: number, dto: EmployeeNoteEntity): Promise<EmployeeNoteEntity> => {
      const { data } = await this.post(this.notes.baseUrl(employeeId), dto);
      return data;
    },
    update: async (employeeId: number, noteId: number, dto: EmployeeNoteEntity): Promise<EmployeeNoteEntity> => {
      const { data } = await this.put(`${this.notes.baseUrl(employeeId)}/${noteId}`, dto);
      return data;
    },
    remove: async (employeeId: number, noteId: number): Promise<any> => {
      const { data } = await this.delete(`${this.notes.baseUrl(employeeId)}/${noteId}`);
      return data;
    },
  };

  documents = {
    baseUrl: (employeeId: number) => `${this.baseUrl}/${employeeId}/documents`,
    create: async (employeeId: number, dto: DocumentEntity): Promise<DocumentEntity> => {
      const { data } = await this.post(this.documents.baseUrl(employeeId), dto);

      return data;
    },
    delete: async (employeeId: number, type: EmployeeDqf | string): Promise<DocumentEntity> => {
      const { data } = await this.delete(`${this.documents.baseUrl(employeeId)}/${type}`);

      return data;
    },
  };

  employer = {
    baseUrl: (employeeId: number) => `${this.baseUrl}/${employeeId}/employer`,
    getByUuidToken: async (uuid_token: string): Promise<EmployeeEmployerEntity> => {
      const { data } = await this.get(
        this.buildUrl(`${this.baseUrl}/fetch-employer/${uuid_token}`)
      );

      return data;
    },
    list: async (employeeId: number): Promise<EmployeeEmployerEntity[]> => {
      const { data } = await this.get(`${this.employer.baseUrl(employeeId)}`);

      return data;
    },
    sendVoeRequest: async (
      employeeId: number,
      employerId: number
    ): Promise<EmployeeEmployerEntity> => {
      const { data } = await this.get(
        `${this.employer.baseUrl(employeeId)}/${employerId}/send-voe-request`
      );

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
        type: EmployeeDqf | string
      ): Promise<void> => {
        const { data } = await this.delete(
          `${this.employer.documents.baseUrl(employeeId, employerId)}/${type}`
        );

        return data;
      },
    },
  };
}
