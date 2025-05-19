import HttpClientWrapper from "../../../api/http-client-wrapper";
import { LendingArrangementPayload } from "./lendingArrangement_payload";

class LendingArrangementApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateLendingArrangement = async (payload: LendingArrangementPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/LendingArrangement/CreateLendingArrangementRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("LendingArrangementApiService LendingArrangement() error:", error);
            throw error;
        }
    };

    updateLendingArrangement= async (id: number, payload: LendingArrangementPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/LendingArrangement/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("LendingArrangementApiService updateLendingArrangement() error:", error);
            throw error;
        }
    };

    getLendingArrangements = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/LendingArrangement');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getLendingArrangement = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/LendingArrangement/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
  
    getDeactiveLendingArrangement = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/LendingArrangement/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    
    blockLendingArrangement= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/LendingArrangement/${id}/deActivate`);
            
            return response;
        } catch (error) {
            console.error("LendingArrangementApiService deleteLendingArrangement() error:", error);
            throw error;
        }
    };

    unblockLendingArrangement = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/LendingArrangement/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("LendingArrangementApiService deleteLendingArrangement() error:", error);
            throw error;
        }
    };

}

export default LendingArrangementApiService;