import HttpClientWrapper from "../../../api/http-client-wrapper";
import { RegAMLRiskPayload } from "./regAMLRisk_payload";

class RegAMLRiskApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateRegAMLRisk = async (payload: RegAMLRiskPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/RegAMLRisk/CreateRegAMLRiskRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RegAMLRiskApiService RegAMLRisk() error:", error);
            throw error;
        }
    };

    updateRegAMLRisk= async (id: number, payload: RegAMLRiskPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/RegAMLRisk/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RegAMLRiskApiService updateRegAMLRisk() error:", error);
            throw error;
        }
    };

    getRegAMLRisks = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RegAMLRisk');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getRegAMLRisk = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RegAMLRisk/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
  
    getDeactiveRegAMLRisk = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RegAMLRisk/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    
    blockRegAMLRisk= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/RegAMLRisk/${id}/deActivate`);
            
            return response;
        } catch (error) {
            console.error("RegAMLRiskApiService deleteRegAMLRisk() error:", error);
            throw error;
        }
    };

    unblockRegAMLRisk = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/RegAMLRisk/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RegAMLRiskApiService deleteRegAMLRisk() error:", error);
            throw error;
        }
    };

}

export default RegAMLRiskApiService;