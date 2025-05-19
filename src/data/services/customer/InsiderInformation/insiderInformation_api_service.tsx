import HttpClientWrapper from "../../../api/http-client-wrapper";
import { InsiderInformationPayload } from "./insiderInformation_payload";

class InsiderInformationApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateInsiderInformation = async (payload: InsiderInformationPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/InsiderInformation/CreateInsiderInformationRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("InsiderInformationApiService InsiderInformation() error:", error);
            throw error;
        }
    };
    getInsiderInformation = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/InsiderInformation/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getInsiderInformations = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/InsiderInformation');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveInsiderInformation = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/InsiderInformation/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateInsiderInformation= async (id: number, payload: InsiderInformationPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/InsiderInformation/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("InsiderInformationApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateInsiderInformation = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/InsiderInformation/${id}/deactive?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("InsiderInformationApiService deActivateInsiderInformation() error:", error);
            throw error;
        }
    };
    

    unblockInsiderInformation = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/InsiderInformation/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("InsiderInformationApiService deleteInsiderInformation() error:", error);
            throw error;
        }
    };

}

export default InsiderInformationApiService;