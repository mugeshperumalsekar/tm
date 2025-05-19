import HttpClientWrapper from "../../../api/http-client-wrapper";
import { FundedTypePayload } from "./fundedType_payload";

class FundedTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateFundedType = async (payload: FundedTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/FundedType/CreateFundedTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("FundedTypeApiService FundedType() error:", error);
            throw error;
        }
    };

    updateFundedType= async (id: number, payload: FundedTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/FundedType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("FundedTypeApiService updateFundedType() error:", error);
            throw error;
        }
    };

    getFundedTypes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/FundedType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getFundedType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/FundedType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
  
    getDeactiveFundedType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/FundedType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    
    blockFundedType= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/FundedType/${id}/deActivate`);
            
            return response;
        } catch (error) {
            console.error("FundedTypeApiService deleteFundedType() error:", error);
            throw error;
        }
    };

    unblockFundedType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/FundedType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("FundedTypeApiService deleteFundedType() error:", error);
            throw error;
        }
    };

}

export default FundedTypeApiService;