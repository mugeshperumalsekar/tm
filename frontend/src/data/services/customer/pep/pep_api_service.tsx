import HttpClientWrapper from "../../../api/http-client-wrapper";
import {PEPPayload } from "./pep_payload";

class PEPApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreatePEP = async (payload: PEPPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/PEP/CreatePEPRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PEPApiService PEP() error:", error);
            throw error;
        }
    };
    getPEP = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PEP/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getPEPs = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PEP');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactivePEP = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PEP/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updatePEP= async (id: number, payload: PEPPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PEP/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PEPApiService updatePEP() error:", error);
            throw error;
        }
    };

    
    blockPEP= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PEP/deactive/${id}`);
            
            return response;
        } catch (error) {
            console.error("PEPApiService deletePEP() error:", error);
            throw error;
        }
    };

    unblockPEP = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PEP/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PEPApiService deletePEP() error:", error);
            throw error;
        }
    };

}

export default PEPApiService;