import HttpClientWrapper from "../../../api/http-client-wrapper";
import { RMTypePayload } from "./rmType_payload";

class RMTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateRMType = async (payload: RMTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/RMType/CreateRMTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RMTypeApiService RMType() error:", error);
            throw error;
        }
    };
    getRMType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RMType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getRMTypes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RMType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveRMType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RMType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateRMType= async (id: number, payload: RMTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/RMType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RMTypeApiService updateRMType() error:", error);
            throw error;
        }
    };

    
    blockRMType= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/RMType/deactive/${id}`);
            
            return response;
        } catch (error) {
            console.error("RMTypeApiService deleteRMType() error:", error);
            throw error;
        }
    };

    unblockRMType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/RMType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RMTypeApiService deleteRMType() error:", error);
            throw error;
        }
    };

}

export default RMTypeApiService;