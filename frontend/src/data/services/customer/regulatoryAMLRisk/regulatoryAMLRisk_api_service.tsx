import HttpClientWrapper from "../../../api/http-client-wrapper";
import { RegulatoryAMLRiskPayload } from "./regulatoryAMLRisk_payload";

class RegulatoryAMLRiskApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateRegulatoryAMLRisk = async (payload: RegulatoryAMLRiskPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/RegulatoryAMLRisk/CreateRegulatoryAMLRiskRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RegulatoryAMLRiskApiService RegulatoryAMLRisk() error:", error);
            throw error;
        }
    };
    getRegulatoryAMLRisk = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RegulatoryAMLRisk/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getRegulatoryAMLRisks = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RegulatoryAMLRisk');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveRegulatoryAMLRisk = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RegulatoryAMLRisk/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateRegulatoryAMLRisk= async (id: number, payload: RegulatoryAMLRiskPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/RegulatoryAMLRisk/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RegulatoryAMLRiskApiService updateRegulatoryAMLRisk() error:", error);
            throw error;
        }
    };

    
    blockRegulatoryAMLRisk= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/RegulatoryAMLRisk/deactive/${id}`);
            
            return response;
        } catch (error) {
            console.error("RegulatoryAMLRiskApiService deleteRegulatoryAMLRisk() error:", error);
            throw error;
        }
    };

    unblockRegulatoryAMLRisk = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/RegulatoryAMLRisk/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RegulatoryAMLRiskApiService deleteRegulatoryAMLRisk() error:", error);
            throw error;
        }
    };

}

export default RegulatoryAMLRiskApiService;