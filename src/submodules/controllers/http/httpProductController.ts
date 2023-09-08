import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { AxiosConfig } from '../interface/axiosConfig';
class HttpProductController {
  private axiosInstance: AxiosInstance;

  constructor(axiosConfig: AxiosConfig) {
    // Create an Axios instance with the provided configuration
    this.axiosInstance = axios.create(axiosConfig);
  }

  async get<T>(url: string, params: { [key: string]: any } = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(url, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(url: string, data: T): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(
        url,
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
export default HttpProductController;
