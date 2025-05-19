import HttpClientWrapper from "../../../api/http-client-wrapper";
import {IndustryPayload } from "./industry_payload";

class IndustryApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateIndustry= async (payload: IndustryPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Industry/CreateIndustryRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IndustryApiService Industry() error:", error);
            throw error;
        }
    };
    getIndustry = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Industry');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getIndustrys = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Industry/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveIndustry = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Industry/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateIndustry= async (id: number, payload: IndustryPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Industry/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IndustryApiService updateIndustry() error:", error);
            throw error;
        }
    };

    blockIndustry= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Industry/deactive/${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IndustryApiService deleteIndustry() error:", error);
            throw error;
        }
    };

    unblockIndustry = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Industry/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IndustryApiService deleteIndustry() error:", error);
            throw error;
        }
    };

}

export default IndustryApiService;