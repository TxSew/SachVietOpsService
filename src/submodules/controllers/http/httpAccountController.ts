import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { User } from 'src/submodules/models/UserModel/User';
import { AxiosConfig } from '../interface/axiosConfig';
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

async login<T>( account:User) {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(
        'auth/login',
        account,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async register<T>( account:User): Promise<User> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(
        'auth/register',
        account,
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
