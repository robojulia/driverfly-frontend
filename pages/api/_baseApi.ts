import axios, { AxiosRequestConfig } from 'axios';

import { isBrowser } from '../../utils/common';
import * as https from 'https';

// Utility function to get token from storage without React hooks
function getTokenFromStorage(): string | null {
  if (!isBrowser()) return null;

  try {
    const storageKey = 'user';
    const json = localStorage.getItem(storageKey);

    if (json) {
      const user = JSON.parse(json);
      if (user && user.token && user.jwt) {
        // Check if JWT is expired
        const now = new Date();
        const expMsSinceEpoc = user.jwt.exp * 1000;
        const refreshBufferWindow = 10 * 1000; // 10 seconds
        const msToExpiry = Math.max(0, expMsSinceEpoc - now.getTime() - refreshBufferWindow);

        if (msToExpiry > 0) {
          return user.token;
        }
      }
    }
  } catch (error) {
    console.error('Error getting token from storage:', error);
  }

  return null;
}

export default class BaseApi {
  private mergeRequestConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
    if (!config) config = {};

    if (!config.baseURL) {
      // Prefer public var first so client bundles work reliably
      const injectedBase = process.env.NEXT_PUBLIC_BASE_URL_API || process.env.BASE_URL_API;
      config.baseURL = injectedBase;

      // If environment variable is not set, provide a fallback
      if (!config.baseURL) {
        // In development, default to localhost:4000/api
        // In production, this should be set via environment variables 
        if (isBrowser() && typeof window !== 'undefined') {
          const hostname = window.location.hostname;
          const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';

          if (isDevelopment) {
            config.baseURL = 'http://localhost:4000/api';
          } else {
            // For production, construct from current domain
            const protocol = window.location.protocol;
            config.baseURL = `${protocol}//${hostname}/api`;
          }
        } else {
          // Server-side fallback
          config.baseURL = 'http://localhost:4000/api';
        }
      }
    }

    const token = getTokenFromStorage();

    /**
     * DRIVOPS-30
     * This block modifies the AxiosRequestConfig to
     * lower the SSL security settings for backend API requests
     * to allow an incomplete SSL certificate chain to be used
     *
     * This method is being retained in the event it needs to be
     * re-implemented in the future
     */
    if (false && !isBrowser()) {
      config.httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
    }

    // console.log("BaseApi: ", token); 

    if (!config.headers) config.headers = {};

    if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;

    return config;
  }

  async post(url, body, config?: AxiosRequestConfig) {
    config = this.mergeRequestConfig(config);

    return axios.post(url, body, config);
  }

  async get(url, config?: AxiosRequestConfig) {
    config = this.mergeRequestConfig(config);

    return axios.get(url, config);
  }

  async patch(url, body, config?: AxiosRequestConfig) {
    config = this.mergeRequestConfig(config);

    return axios.patch(url, body, config);
  }

  async put(url, body, config?: AxiosRequestConfig) {
    config = this.mergeRequestConfig(config);

    return axios.put(url, body, config);
  }

  async delete(url, body?: any, config?: AxiosRequestConfig) {
    config = this.mergeRequestConfig(config);
    if (body) config.data = body;

    return axios.delete(url, config);
  }

  buildUrl(url: string, params?: any): string {
    return `${url}${this.buildQueryString(params)}`;
  }

  buildQueryString(params: any): string {
    let qs = '';

    const seperator = '&';

    if (params) {
      qs = Object.entries(params)
        .filter(([key, value]) => value != null)
        .map((v) => {
          let [key, value] = v;
          switch (typeof value) {
            case 'undefined':
              value = null;
            case 'object':
              if (value instanceof Date) {
                value = value.toISOString();
              } else if (value instanceof Array) {
                return value
                  .map((v) => `${key}[]=${encodeURIComponent(v as string)}`)
                  .join(seperator);
              } else {
                throw new Error('Object is unsupported by this parser');
              }
              break;
          }

          return `${key}=${encodeURIComponent(value as string)}`;
        })
        .join(seperator);
    }

    return qs ? '?' + qs : qs;
  }
}
