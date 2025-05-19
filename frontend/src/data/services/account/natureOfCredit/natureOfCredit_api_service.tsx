import HttpClientWrapper from "../../../api/http-client-wrapper";
import { NatureOfCreditPayload } from "./natureOfCredit_payload";

class NatureOfCreditApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateNatureOfCredit = async (payload: NatureOfCreditPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/NatureOfCredit/CreateNatureOfCreditRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("NatureOfCreditApiService NatureOfCredit() error:", error);
            throw error;
        }
    };

    updateNatureOfCredit= async (id: number, payload: NatureOfCreditPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/NatureOfCredit/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("NatureOfCreditApiService updateNatureOfCredit() error:", error);
            throw error;
        }
    };

    getNatureOfCredits = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/NatureOfCredit');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getNatureOfCredit = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/NatureOfCredit/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
  
    getDeactiveNatureOfCredit = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/NatureOfCredit/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    
    blockNatureOfCredit= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/NatureOfCredit/${id}/deActivate`);
            
            return response;
        } catch (error) {
            console.error("NatureOfCreditApiService deleteNatureOfCredit() error:", error);
            throw error;
        }
    };

    unblockNatureOfCredit = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/NatureOfCredit/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("NatureOfCreditApiService deleteNatureOfCredit() error:", error);
            throw error;
        }
    };

}

export default NatureOfCreditApiService;