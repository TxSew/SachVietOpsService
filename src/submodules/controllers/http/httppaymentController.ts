import axios, { AxiosInstance, AxiosResponse } from "axios";
import { User } from "../../models/UserModel/User";
class HttpCategoryController {
  private axiosInstance: AxiosInstance;

  constructor(axiosConfig: any) {
    // Create an Axios instance with the provided configuration
    this.axiosInstance = axios.create(axiosConfig);
    const token: any = localStorage.getItem("token");
    const jwtToken = JSON.parse(token);
    if (jwtToken) {
      this.axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${jwtToken}`;
    }

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          return (window.location.href = "/auth");
        }
        return Promise.reject(error);
      }
    );
  }
  async getPayment(paymentMethod: string, data: any): Promise<any> {
    try {
      const response = await this.axiosInstance.post(`/payment/payment-url`, {
        paymentMethod: paymentMethod,
        data: data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default HttpCategoryController;
