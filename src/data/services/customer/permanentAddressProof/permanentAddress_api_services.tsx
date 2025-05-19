import HttpClientWrapper from "../../../api/http-client-wrapper";
import {PermanentAddressPayload } from "./permanentAddress_payload";

class PermanentAddressApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreatePermanentAddress= async (payload: PermanentAddressPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/PermanentAddressProof/CreatePermanentAddressProof', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PermanentAddressApiService PermanentAddress() error:", error);
            throw error;
        }
    };
    getPermanentAddress= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PermanentAddressProof');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getPermanentAddresss = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PermanentAddressProof/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactivePermanentAddress= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PermanentAddressProof/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updatePermanentAddress= async (id: number, payload: PermanentAddressPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PermanentAddressProof/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PermanentAddressApiService updatePermanentAddress() error:", error);
            throw error;
        }
    };

    blockPermanentAddress= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PermanentAddressProof/${id}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PermanentAddressApiService deletePermanentAddress() error:", error);
            throw error;
        }
    };

    unblockPermanentAddress= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PermanentAddressProof/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PermanentAddressApiService deletePermanentAddress() error:", error);
            throw error;
        }
    };

}

export default PermanentAddressApiService;