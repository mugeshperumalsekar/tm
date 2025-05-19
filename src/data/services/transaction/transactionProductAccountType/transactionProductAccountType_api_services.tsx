
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { TransactionProductAccountTypePayload } from "./transactionProductAccountType_payload";


class TransactionProductAccountTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateTransactionProductAccountType= async (payload: TransactionProductAccountTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/TransactionProductAccountType/CreateTransactionProductAccountTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("TransactionProductAccountTypeApiService TransactionProductAccountType() error:", error);
            throw error;
        }
    };
    getTransactionProductAccountType= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/TransactionProductAccountType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActiveTransactionProductAccountType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/TransactionProductAccountType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveTransactionProductAccountType= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/TransactionProductAccountType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateTransactionProductAccountType= async (id: number, payload: TransactionProductAccountTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/TransactionProductAccountType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("TransactionProductAccountTypeApiService updateTransactionProductAccountType() error:", error);
            throw error;
        }
    };

    blockTransactionProductAccountType= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/TransactionProductAccountType/${id}/deActivate`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("TransactionProductAccountTypeApiService deleteTransactionProductAccountType() error:", error);
            throw error;
        }
    };

    unblockTransactionProductAccountType= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/TransactionProductAccountType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("TransactionProductAccountTypeApiService deleteTransactionProductAccountType() error:", error);
            throw error;
        }
    };

}

export default TransactionProductAccountTypeApiService;