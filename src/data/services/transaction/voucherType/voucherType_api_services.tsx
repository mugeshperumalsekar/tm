
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { VoucherTypePayload } from "./voucherType_payload";


class VoucherTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateVoucherType= async (payload: VoucherTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/VoucherType/CreateVoucherTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("VoucherTypeApiService VoucherType() error:", error);
            throw error;
        }
    };
    getVoucherType= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/VoucherType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActiveVoucherType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/VoucherType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveVoucherType= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/VoucherType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateVoucherType= async (id: number, payload: VoucherTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/VoucherType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("VoucherTypeApiService updateVoucherType() error:", error);
            throw error;
        }
    };

    blockVoucherType= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/VoucherType/${id}/deActivate`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("VoucherTypeApiService deleteVoucherType() error:", error);
            throw error;
        }
    };

    unblockVoucherType= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/VoucherType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("VoucherTypeApiService deleteVoucherType() error:", error);
            throw error;
        }
    };

}

export default VoucherTypeApiService;