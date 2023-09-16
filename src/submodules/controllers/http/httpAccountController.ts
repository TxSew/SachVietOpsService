import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { AxiosConfig } from '../interface/axiosConfig';
import { Product } from 'src/submodules/models/ProductModel/Product';
class HttpAccountController {
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

  async post<T>( products:Product): Promise<Product> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(
        'store',
        products,
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
// Usage of the HttpController

export default HttpAccountController;
