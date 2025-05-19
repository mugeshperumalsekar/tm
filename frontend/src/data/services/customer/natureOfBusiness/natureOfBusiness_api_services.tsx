import HttpClientWrapper from "../../../api/http-client-wrapper";
import { NatureOfBusinessPayload } from "./natureOfBusiness_payload";

class NatureOfBusinessApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateNatureOfBusiness = async (payload: NatureOfBusinessPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/NatureOfBussiness/CreateNatureOfBussinessRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("NatureOfBusinessApiService NatureOfBusiness() error:", error);
            throw error;
        }
    };
    getNatureOfBusiness = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/NatureOfBussiness/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getNatureOfBusinesss = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/NatureOfBussiness');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveNatureOfBusiness = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/NatureOfBussiness/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateNatureOfBusiness= async (id: number, payload: NatureOfBusinessPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/NatureOfBussiness/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("NatureOfBusinessApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateNatureOfBusiness = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/NatureOfBussiness/${id}/deactive?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("NatureOfBusinessApiService deActivateNatureOfBusiness() error:", error);
            throw error;
        }
    };
    

    unblockNatureOfBusiness = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/NatureOfBussiness/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("NatureOfBusinessApiService deleteNatureOfBusiness() error:", error);
            throw error;
        }
    };

}

export default NatureOfBusinessApiService;