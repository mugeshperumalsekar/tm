import HttpClientWrapper from "../../../api/http-client-wrapper";
import { MaritalStatusPayload } from "./maritalStatus_payload";

class MaritalStatusApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateMaritalStatus = async (payload: MaritalStatusPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/MaritalStatus/CreateMaritalStatusRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("MaritalStatusApiService MaritalStatus() error:", error);
            throw error;
        }
    };
    getMaritalStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/MaritalStatus/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getMaritalStatuss = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/MaritalStatus');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveMaritalStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/MaritalStatus/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateMaritalStatus= async (id: number, payload: MaritalStatusPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/MaritalStatus/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("MaritalStatusApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateMaritalStatus = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/MaritalStatus/${id}/deactive?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("MaritalStatusApiService deActivateMaritalStatus() error:", error);
            throw error;
        }
    };
    

    unblockMaritalStatus = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/MaritalStatus/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("MaritalStatusApiService deleteMaritalStatus() error:", error);
            throw error;
        }
    };

}

export default MaritalStatusApiService;