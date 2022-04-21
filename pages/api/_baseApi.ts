import axios, { AxiosRequestConfig } from 'axios';

import useAuth from '../../hooks/useAuth';

export default class BaseApi {
    private mergeRequestConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
        if (!config) config = {};

        config.baseURL = process.env.BASE_URL_API;

        const { authCheck } = useAuth();
        const user = authCheck();

        if (user) {
            if (!config.headers)
                config.headers = {};

            config.headers.Authorization = `Bearer ${user.token}`;
        }

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
        if (body)
            config.data = body;

        return axios.delete(url, config);
    }

    buildUrl(url: string, params?: any): string {
        return `${url}${this.buildQueryString(params)}`;
    }

    buildQueryString(params: any): string {
        let qs = "";

        const seperator = "&";

        if (params) {
            qs = Object
                .entries(params)
                .map((v) => {
                    let [ key, value ] = v;
                    switch (typeof value) {
                        case "undefined": value = null;
                        case "object":
                            if (value instanceof Date) {
                                value = value.toISOString();
                            }
                            else if (value instanceof Array) {
                                return value.map(v => `${key}[]=${encodeURIComponent(v as string)}`).join(seperator);
                            }
                            else {
                                throw new Error("Object is unsupported by this parser");
                            }
                            break;
                    }

                    return `${key}=${encodeURIComponent(value as string)}`;
                }).join(seperator);
        }

        return qs ? "?" + qs : qs;

    }
}
