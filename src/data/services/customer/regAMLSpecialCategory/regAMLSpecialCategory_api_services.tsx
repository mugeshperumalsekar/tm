import HttpClientWrapper from "../../../api/http-client-wrapper";
import {RegAMLSpecialCategoryPayload } from "./regAMLSpecialCategory_payload";

class RegAMLSpecialCategoryApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateRegAMLSpecialCategory= async (payload: RegAMLSpecialCategoryPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/RegAMLSpecialCategory/CreateRegAMLSpecialCategoryRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RegAMLSpecialCategoryApiService RegAMLSpecialCategory() error:", error);
            throw error;
        }
    };
    getRegAMLSpecialCategory= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RegAMLSpecialCategory');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActiveRegAMLSpecialCategory = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RegAMLSpecialCategory/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveRegAMLSpecialCategory= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RegAMLSpecialCategory/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateRegAMLSpecialCategory= async (id: number, payload: RegAMLSpecialCategoryPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/RegAMLSpecialCategory/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RegAMLSpecialCategoryApiService updateRegAMLSpecialCategory() error:", error);
            throw error;
        }
    };

    blockRegAMLSpecialCategory= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/RegAMLSpecialCategory/deactive/${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RegAMLSpecialCategoryApiService deleteRegAMLSpecialCategory() error:", error);
            throw error;
        }
    };

    unblockRegAMLSpecialCategory= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/RegAMLSpecialCategory/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RegAMLSpecialCategoryApiService deleteRegAMLSpecialCategory() error:", error);
            throw error;
        }
    };

}

export default RegAMLSpecialCategoryApiService;