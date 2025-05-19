import HttpClientWrapper from "../../../api/http-client-wrapper";
import { ReputationClassificationPayload } from "./repuatationClassification_payload";

class ReputationClassificationApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateReputationClassification = async (payload: ReputationClassificationPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ReputationClassification/CreateReputationClassificationRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ReputationClassificationApiService ReputationClassification() error:", error);
            throw error;
        }
    };
    getReputationClassification = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ReputationClassification/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getReputationClassifications = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ReputationClassification');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveReputationClassification = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ReputationClassification/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateReputationClassification= async (id: number, payload: ReputationClassificationPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ReputationClassification/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ReputationClassificationApiService updateReputationClassification() error:", error);
            throw error;
        }
    };

    
    blockReputationClassification= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ReputationClassification/deactive/${id}`);
            
            return response;
        } catch (error) {
            console.error("ReputationClassificationApiService deleteReputationClassification() error:", error);
            throw error;
        }
    };

    unblockReputationClassification = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ReputationClassification/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ReputationClassificationApiService deleteReputationClassification() error:", error);
            throw error;
        }
    };

}

export default ReputationClassificationApiService;