import { VehicleUploadTokenEntity } from '../../models/company/vehicle-upload-token.entity';
import BaseApi from './_baseApi';
import axios, { AxiosRequestConfig } from 'axios';
import { isBrowser } from '../../utils/common';

export default class VehicleUploadTokenApi extends BaseApi {
  baseUrl: string = 'vehicle-upload-tokens';

  /**
   * Generate a new upload token for a vehicle
   */
  async generateToken(
    vehicleId: number,
    documentType: string,
    driverInfo?: {
      name?: string;
      email?: string;
      phone?: string;
    }
  ): Promise<VehicleUploadTokenEntity> {
    const { data } = await this.post(this.baseUrl, {
      vehicle_id: vehicleId,
      document_type: documentType,
      driver_name: driverInfo?.name,
      driver_email: driverInfo?.email,
      driver_phone: driverInfo?.phone,
    });

    return data;
  }

  /**
   * Validate a token and get its details (public endpoint, no auth required)
   */
  async validateToken(token: string): Promise<VehicleUploadTokenEntity> {
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

    const { data } = await axios.get(`${config.baseURL}/${this.baseUrl}/validate/${token}`, config);

    return data;
  }

  /**
   * Upload documents using a token (public endpoint, no auth required)
   */
  async uploadWithToken(token: string, files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

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
      `${config.baseURL}/${this.baseUrl}/${token}/upload`,
      formData,
      config
    );

    return data;
  }

  /**
   * Get all tokens for a specific vehicle
   */
  async getTokensByVehicle(vehicleId: number): Promise<VehicleUploadTokenEntity[]> {
    const { data } = await this.get(`${this.baseUrl}?vehicle_id=${vehicleId}`);

    return data;
  }

  /**
   * Revoke/invalidate a token
   */
  async revokeToken(tokenId: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${tokenId}`);
  }
}
