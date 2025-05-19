import HttpClientWrapper from "../../../api/http-client-wrapper";
import { ReasonCodePayload } from "./reasonCode_payload";

class ReasonCodeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateReasonCode = async (payload: ReasonCodePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ReasonCode/CreateReasonCodeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ReasonCodeApiService ReasonCode() error:", error);
            throw error;
        }
    };

    updateReasonCode= async (id: number, payload: ReasonCodePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ReasonCode/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ReasonCodeApiService updateReasonCode() error:", error);
            throw error;
        }
    };

    getReasonCodes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ReasonCode');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getReasonCode = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ReasonCode/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
  
    getDeactiveReasonCode = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ReasonCode/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    
    blockReasonCode= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ReasonCode/${id}/deActivate`);
            
            return response;
        } catch (error) {
            console.error("ReasonCodeApiService deleteReasonCode() error:", error);
            throw error;
        }
    };

    unblockReasonCode = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ReasonCode/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ReasonCodeApiService deleteReasonCode() error:", error);
            throw error;
        }
    };

}

export default ReasonCodeApiService;