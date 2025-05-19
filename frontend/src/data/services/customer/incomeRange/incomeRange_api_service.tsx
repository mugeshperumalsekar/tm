import HttpClientWrapper from "../../../api/http-client-wrapper";
import { IncomeRangePayload } from "./incomeRange_payload";

class IncomeRangeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateIncomeRange = async (payload: IncomeRangePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/IncomeRange/CreateIncomeRangeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IncomeRangeApiService IncomeRange() error:", error);
            throw error;
        }
    };
    getIncomeRange = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IncomeRange/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getIncomeRanges = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IncomeRange');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveIncomeRange = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IncomeRange/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateIncomeRange= async (id: number, payload: IncomeRangePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IncomeRange/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IncomeRangeApiService updateIncomeRange() error:", error);
            throw error;
        }
    };

    
    blockIncomeRange= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IncomeRange/deactive/${id}`);
            
            return response;
        } catch (error) {
            console.error("IncomeRangeApiService deleteIncomeRange() error:", error);
            throw error;
        }
    };

    unblockIncomeRange = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IncomeRange/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IncomeRangeApiService deleteIncomeRange() error:", error);
            throw error;
        }
    };

}

export default IncomeRangeApiService;