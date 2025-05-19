import HttpClientWrapper from "../../../api/http-client-wrapper";
import {NetworthPayload } from "./networth_payload";

class NetworthApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateNetworth= async (payload: NetworthPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/NetworthProof/CreateNetworthProofRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("NetworthApiService Networth() error:", error);
            throw error;
        }
    };
    getNetworth= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/NetworthProof');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActiveNetworth = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/NetworthProof/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveNetworth= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/NetworthProof/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateNetworth= async (id: number, payload: NetworthPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/NetworthProof/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("NetworthApiService updateNetworth() error:", error);
            throw error;
        }
    };

    blockNetworth= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/NetworthProof/${id}/deactive`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("NetworthApiService deleteNetworth() error:", error);
            throw error;
        }
    };

    unblockNetworth= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/NetworthProof/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("NetworthApiService deleteNetworth() error:", error);
            throw error;
        }
    };

}

export default NetworthApiService;