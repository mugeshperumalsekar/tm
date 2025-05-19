import HttpClientWrapper from "../../../api/http-client-wrapper";
import { GenderPayload } from "./gender_payload";

class GenderApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateGender = async (payload: GenderPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Gender/CreateGenderRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("GenderApiService Gender() error:", error);
            throw error;
        }
    };
    getGender = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Gender/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getGenders = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Gender');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveGender = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Gender/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateGender= async (id: number, payload: GenderPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Gender/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("GenderApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateGender = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Gender/${id}/deactive?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("GenderApiService deActivateGender() error:", error);
            throw error;
        }
    };
    

    unblockGender = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Gender/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("GenderApiService deleteGender() error:", error);
            throw error;
        }
    };

}

export default GenderApiService;