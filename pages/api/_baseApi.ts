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

    async delete(url, body, config?: AxiosRequestConfig) {
        config = this.mergeRequestConfig(config);
        if (body)
            config.data = body;

        return axios.delete(url, config);
    }
}
