import { apiConfig, HttpMethod } from "./config";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Create axios instance with the API configuration
const axiosInstance = axios.create(apiConfig);

export class FetchApi {

    request = async <T>(
        {
            method,
            url = import.meta.env.VITE_API_URL,
            path,
            data,
            config,
        }: {
            method: HttpMethod;
            url?: string;
            path: string;
            data?: unknown;
            config?: AxiosRequestConfig;
        }
    ): Promise<T | null> => {

        try {
            let response: AxiosResponse<T>;
            console.log(`Requesting ${method} ${url}`);
            const finalUrl = `${url}/${path}`;
            switch (method) {
                case HttpMethod.GET:
                    response = await axiosInstance.get<T>(finalUrl, config);
                    break;
                case HttpMethod.POST:
                    response = await axiosInstance.post<T>(finalUrl, data, config);
                    break;
                case HttpMethod.PUT:
                    response = await axiosInstance.put<T>(finalUrl, data, config);
                    break;
                case HttpMethod.DELETE:
                    response = await axiosInstance.delete<T>(finalUrl, config);
                    break;
            }

            return response.data;
        } catch (err) {
            console.log(`Error: ${err}`);
            return null;
        }
    };

    // Convenience methods for different HTTP verbs
    get = <T>(path: string, config?: AxiosRequestConfig): Promise<T | null> => {
        return this.request<T>({
            method: HttpMethod.GET,
            path,
            config
        });
    };

    post = <T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T | null> => {
        return this.request<T>({
            method: HttpMethod.POST,
            path,
            data,
            config
        });
    };

    put = <T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T | null> => {
        return this.request<T>({
            method: HttpMethod.PUT,
            path,
            data,
            config,
        });
    };

    del = <T>(path: string, config?: AxiosRequestConfig): Promise<T | null> => {
        return this.request<T>({
            method: HttpMethod.DELETE,
            path,
            config,
        });
    };

}