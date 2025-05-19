import HttpClientWrapper from "../../../api/http-client-wrapper";
import {CKYCAddressTypePayload } from "./ckycAddressType_payload";

class CKYCAddressTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateCKYCAddressType= async (payload: CKYCAddressTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/CKYCAddressType/CreateCKYCAddressTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CKYCAddressTypeApiService CKYCAddressType() error:", error);
            throw error;
        }
    };
    getCKYCAddressType= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CKYCAddressType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActiveCKYCAddressType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CKYCAddressType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveCKYCAddressType= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CKYCAddressType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateCKYCAddressType= async (id: number, payload: CKYCAddressTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CKYCAddressType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CKYCAddressTypeApiService updateCKYCAddressType() error:", error);
            throw error;
        }
    };

    blockCKYCAddressType= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CKYCAddressType/${id}/deactive`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CKYCAddressTypeApiService deleteCKYCAddressType() error:", error);
            throw error;
        }
    };

    unblockCKYCAddressType= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CKYCAddressType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CKYCAddressTypeApiService deleteCKYCAddressType() error:", error);
            throw error;
        }
    };

}

export default CKYCAddressTypeApiService;