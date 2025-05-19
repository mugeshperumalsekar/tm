
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { ClientBankCodePayload } from "./clientBankCode_payload";


class ClientBankCodeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateClientBankCode= async (payload: ClientBankCodePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ClientBankCode/CreateClientBankCodeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ClientBankCodeApiService ClientBankCode() error:", error);
            throw error;
        }
    };
    getClientBankCode= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ClientBankCode');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActiveClientBankCode = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ClientBankCode/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveClientBankCode= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ClientBankCode/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateClientBankCode= async (id: number, payload: ClientBankCodePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ClientBankCode/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ClientBankCodeApiService updateClientBankCode() error:", error);
            throw error;
        }
    };

    blockClientBankCode= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ClientBankCode/${id}/deActivate`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ClientBankCodeApiService deleteClientBankCode() error:", error);
            throw error;
        }
    };

    unblockClientBankCode= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ClientBankCode/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ClientBankCodeApiService deleteClientBankCode() error:", error);
            throw error;
        }
    };

}

export default ClientBankCodeApiService;