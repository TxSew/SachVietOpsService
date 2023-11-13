import axios, { AxiosInstance } from 'axios';
import { TProductResponse } from '../../models/ProductModel/Product';
import { AxiosConfig } from '../interface/axiosConfig';
import { Voucher } from 'src/submodules/models/voucherModel/Voucher';
class HttpStatisticalController {
    get(): TProductResponse | PromiseLike<TProductResponse> {
        throw new Error('Method not implemented.');
    }
    private axiosInstance: AxiosInstance;

    constructor(axiosConfig: AxiosConfig) {
        // Create an Axios instance with the provided configuration
        this.axiosInstance = axios.create(axiosConfig);
        const token: any = localStorage.getItem('token');
        const jwtToken = JSON.parse(token);
        if (jwtToken) {
            this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
        }
    }
    async getAllVoucherByUser(props: any) {
        try {
            const response = await this.axiosInstance.post('/voucher', {
                ...props,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async addVoucherUser(props: Voucher) {
        try {
            const response = await this.axiosInstance.post('/voucher/add-voucher', {
                ...props,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async deleteVoucherUser(id: number) {
        try {
            const deleteVoucher = await this.axiosInstance.post('/voucher/delete-voucher', id);
            return deleteVoucher.data;
        } catch (error) {
            throw error;
        }
    }
}
export default HttpStatisticalController;
