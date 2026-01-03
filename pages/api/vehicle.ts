import { VehicleEntity } from '../../models/company/vehicle.entity';
import BaseApi from './_baseApi';
import { VehicleWithDueInspectionsDto } from '../../models/company/vehicle-with-due-inspections.dto';
import axios, { AxiosRequestConfig } from 'axios';
import { isBrowser } from '../../utils/common';

export default class VehicleApi extends BaseApi {
  baseUrl: string = 'vehicles';
  async list(params?: { withDocuments?: boolean }): Promise<VehicleEntity[]> {
    const { data } = await this.get(
      this.baseUrl + (params && params.withDocuments ? '?withDocuments=true' : '')
    );
    return data;
  }
  async getById(id: number, params?: { withDocuments?: boolean }): Promise<VehicleEntity> {
    const { data } = await this.get(
      `${this.baseUrl}/${id}` + (params && params.withDocuments ? '?withDocuments=true' : '')
    );

    return data;
  }
  async findById(id: number, params?: { withDocuments?: boolean }): Promise<VehicleEntity> {
    const { data } = await this.get(
      `${this.baseUrl}/${id}` + (params && params.withDocuments ? '?withDocuments=true' : '')
    );

    return data;
  }
  async create(entity: VehicleEntity): Promise<VehicleEntity> {
    const { data } = await this.post(this.baseUrl, entity);

    return data;
  }
  async update(id: number, entity: VehicleEntity): Promise<VehicleEntity> {
    const { data } = await this.put(`${this.baseUrl}/${id}`, entity);

    return data;
  }
  async remove(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${id}`);
  }
  async getDueInspections(
    startDate?: Date,
    endDate?: Date
  ): Promise<VehicleWithDueInspectionsDto[]> {
    // If no dates provided, default to next 30 days
    if (!startDate) {
      startDate = new Date();
    }
    if (!endDate) {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
    }

    const { data } = await this.get(
      `${
        this.baseUrl
      }/due-inspections?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`
    );

    return data;
  }

  /**
   * Get public vehicle by token (public endpoint, no auth required)
   */
  async getPublicVehicle(token: string): Promise<VehicleEntity> {
    const config: AxiosRequestConfig = {
      headers: {},
    };

    // Remove authorization header for public endpoint
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL_API || process.env.BASE_URL_API;

    if (!baseURL) {
      if (isBrowser() && typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
        config.baseURL = isDevelopment
          ? 'http://localhost:4000/api'
          : `${window.location.protocol}//${hostname}/api`;
      } else {
        config.baseURL = 'http://localhost:4000/api';
      }
    } else {
      config.baseURL = baseURL;
    }

    const { data } = await axios.get(`${config.baseURL}/${this.baseUrl}/public/${token}`, config);

    return data;
  }

  /**
   * Upload documents to a public vehicle (public endpoint, no auth required)
   */
  async uploadDocumentToPublicVehicle(
    token: string,
    documentType: string,
    files: File[]
  ): Promise<any> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('document_type', documentType);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    // Remove authorization header for public endpoint
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL_API || process.env.BASE_URL_API;

    if (!baseURL) {
      if (isBrowser() && typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
        config.baseURL = isDevelopment
          ? 'http://localhost:4000/api'
          : `${window.location.protocol}//${hostname}/api`;
      } else {
        config.baseURL = 'http://localhost:4000/api';
      }
    } else {
      config.baseURL = baseURL;
    }

    const { data } = await axios.post(
      `${config.baseURL}/${this.baseUrl}/public/${token}/upload`,
      formData,
      config
    );

    return data;
  }

  /**
   * Regenerate public token for a vehicle (authenticated endpoint)
   */
  async regeneratePublicToken(vehicleId: number): Promise<VehicleEntity> {
    const { data } = await this.post(`${this.baseUrl}/${vehicleId}/regenerate-public-token`, {});

    return data;
  }
}
