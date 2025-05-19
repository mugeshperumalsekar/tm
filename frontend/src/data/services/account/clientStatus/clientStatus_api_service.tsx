import HttpClientWrapper from "../../../api/http-client-wrapper";
import { ClientStatusPayload } from "./clientStatus_payload";

class ClientStatusApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateClientStatus = async (payload: ClientStatusPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ClientStatus/CreateClientStatusRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ClientStatusApiService ClientStatus() error:", error);
            throw error;
        }
    };

    updateClientStatus= async (id: number, payload: ClientStatusPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ClientStatus/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ClientStatusApiService updateClientStatus() error:", error);
            throw error;
        }
    };

    getClientStatuss = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ClientStatus');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getClientStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ClientStatus/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
  
    getDeactiveClientStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ClientStatus/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    
    blockClientStatus= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ClientStatus/${id}/deActivate`);
            
            return response;
        } catch (error) {
            console.error("ClientStatusApiService deleteClientStatus() error:", error);
            throw error;
        }
    };

    unblockClientStatus = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ClientStatus/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ClientStatusApiService deleteClientStatus() error:", error);
            throw error;
        }
    };

}

export default ClientStatusApiService;