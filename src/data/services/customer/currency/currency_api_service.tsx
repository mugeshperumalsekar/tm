import HttpClientWrapper from "../../../api/http-client-wrapper";
import {CurrencyPayload } from "./currency_payload";

class CurrencyApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateCurrency = async (payload: CurrencyPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Currency/CreateCurrencyRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CurrencyApiService Currency() error:", error);
            throw error;
        }
    };
    getCurrency = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Currency/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getCurrencys = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Currency');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveCurrency = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Currency/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateCurrency= async (id: number, payload: CurrencyPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Currency/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CurrencyApiService updateCurrency() error:", error);
            throw error;
        }
    };

    
    blockCurrency= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Currency/deactive/${id}`);
            
            return response;
        } catch (error) {
            console.error("CurrencyApiService deleteCurrency() error:", error);
            throw error;
        }
    };

    unblockCurrency = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Currency/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CurrencyApiService deleteCurrency() error:", error);
            throw error;
        }
    };

}

export default CurrencyApiService;