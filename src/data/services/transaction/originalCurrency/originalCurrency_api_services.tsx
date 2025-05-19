
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { OriginalCurrencyPayload } from "./originalCurrency_payload";


class OriginalCurrencyApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateOriginalCurrency= async (payload: OriginalCurrencyPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/OriginalCurrency/CreateOriginalCurrencyRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("OriginalCurrencyApiService OriginalCurrency() error:", error);
            throw error;
        }
    };
    getOriginalCurrency= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/OriginalCurrency');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActiveOriginalCurrency = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/OriginalCurrency/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveOriginalCurrency= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/OriginalCurrency/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateOriginalCurrency= async (id: number, payload: OriginalCurrencyPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/OriginalCurrency/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("OriginalCurrencyApiService updateOriginalCurrency() error:", error);
            throw error;
        }
    };

    blockOriginalCurrency= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/OriginalCurrency/${id}/deActivate`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("OriginalCurrencyApiService deleteOriginalCurrency() error:", error);
            throw error;
        }
    };

    unblockOriginalCurrency= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/OriginalCurrency/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("OriginalCurrencyApiService deleteOriginalCurrency() error:", error);
            throw error;
        }
    };

}

export default OriginalCurrencyApiService;