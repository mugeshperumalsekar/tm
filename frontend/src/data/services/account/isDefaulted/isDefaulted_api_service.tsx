import HttpClientWrapper from "../../../api/http-client-wrapper";
import { IsDefaultedPayload } from "./isDefaulted_payload";

class IsDefaultedApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateIsDefaulted = async (payload: IsDefaultedPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/IsDefaulted/CreateIsDefaultedRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IsDefaultedApiService IsDefaulted() error:", error);
            throw error;
        }
    };

    updateIsDefaulted= async (id: number, payload: IsDefaultedPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IsDefaulted/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IsDefaultedApiService updateIsDefaulted() error:", error);
            throw error;
        }
    };

    getIsDefaulteds = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IsDefaulted');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getIsDefaulted = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IsDefaulted/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
  
    getDeactiveIsDefaulted = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IsDefaulted/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    
    blockIsDefaulted= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IsDefaulted/${id}/deActivate`);
            
            return response;
        } catch (error) {
            console.error("IsDefaultedApiService deleteIsDefaulted() error:", error);
            throw error;
        }
    };

    unblockIsDefaulted = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IsDefaulted/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IsDefaultedApiService deleteIsDefaulted() error:", error);
            throw error;
        }
    };

}

export default IsDefaultedApiService;