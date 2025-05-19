import HttpClientWrapper from "../../../api/http-client-wrapper";
import { InsurancePurposePayload } from "./insurancePurpose_payload";

class InsurancePurposeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateInsurancePurpose = async (payload: InsurancePurposePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/InsurancePurpose/CreateInsurancePurposeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("InsurancePurposeApiService InsurancePurpose() error:", error);
            throw error;
        }
    };

    updateInsurancePurpose= async (id: number, payload: InsurancePurposePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/InsurancePurpose/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("InsurancePurposeApiService updateInsurancePurpose() error:", error);
            throw error;
        }
    };

    getInsurancePurposes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/InsurancePurpose');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getInsurancePurpose = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/InsurancePurpose/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
  
    getDeactiveInsurancePurpose = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/InsurancePurpose/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    
    blockInsurancePurpose= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/InsurancePurpose/${id}/deActivate`);
            
            return response;
        } catch (error) {
            console.error("InsurancePurposeApiService deleteInsurancePurpose() error:", error);
            throw error;
        }
    };

    unblockInsurancePurpose = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/InsurancePurpose/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("InsurancePurposeApiService deleteInsurancePurpose() error:", error);
            throw error;
        }
    };

}

export default InsurancePurposeApiService;