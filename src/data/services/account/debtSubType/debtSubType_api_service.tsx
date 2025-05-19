import HttpClientWrapper from "../../../api/http-client-wrapper";
import { DebtSubTypePayload } from "./debtSubType_payload";

class DebtSubTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateDebtSubType = async (payload: DebtSubTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/DebtSubType/CreateDebtSubTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("DebtSubTypeApiService DebtSubType() error:", error);
            throw error;
        }
    };

    updateDebtSubType= async (id: number, payload: DebtSubTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/DebtSubType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("DebtSubTypeApiService updateDebtSubType() error:", error);
            throw error;
        }
    };

    getDebtSubTypes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/DebtSubType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDebtSubType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/DebtSubType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
  
    getDeactiveDebtSubType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/DebtSubType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    
    blockDebtSubType= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/DebtSubType/${id}/deActivate`);
            
            return response;
        } catch (error) {
            console.error("DebtSubTypeApiService deleteDebtSubType() error:", error);
            throw error;
        }
    };

    unblockDebtSubType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/DebtSubType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("DebtSubTypeApiService deleteDebtSubType() error:", error);
            throw error;
        }
    };

}

export default DebtSubTypeApiService;