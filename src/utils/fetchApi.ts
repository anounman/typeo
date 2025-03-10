import { apiConfig, HttpMethod } from "./config";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Create axios instance with the API configuration
const axiosInstance = axios.create(apiConfig);

export class FetchApi {

    request = async <T>(
        method: HttpMethod,
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T | null> => {

        try {
            let response: AxiosResponse<T>;

            switch (method) {
                case HttpMethod.GET:
                    response = await axiosInstance.get<T>(url, config);
                    break;
                case HttpMethod.POST:
                    response = await axiosInstance.post<T>(url, data, config);
                    break;
                case HttpMethod.PUT:
                    response = await axiosInstance.put<T>(url, data, config);
                    break;
                case HttpMethod.DELETE:
                    response = await axiosInstance.delete<T>(url, config);
                    break;
            }

            return response.data;
        } catch (err) {
        console.log(`Error: ${err}`);
            return null;
        }
    };

    // Convenience methods for different HTTP verbs
    get = <T>(url: string, config?: AxiosRequestConfig): Promise<T | null> => {
        return this.request<T>(HttpMethod.GET, url, undefined, config);
    };

    post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T | null> => {
        return this.request<T>(HttpMethod.POST, url, data, config);
    };

    put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T | null> => {
        return this.request<T>(HttpMethod.PUT, url, data, config);
    };

    del = <T>(url: string, config?: AxiosRequestConfig): Promise<T | null> => {
        return this.request<T>(HttpMethod.DELETE, url, undefined, config);
    };

}