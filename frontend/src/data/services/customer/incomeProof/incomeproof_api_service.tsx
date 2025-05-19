import HttpClientWrapper from "../../../api/http-client-wrapper";
import {IncomeProofPayload } from "./incomeproof_payload";

class IncomeProofApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateIncomeProof = async (payload: IncomeProofPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/IncomeProof/CreateIncomeProofRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IncomeProofApiService IncomeProof() error:", error);
            throw error;
        }
    };
    getIncomeProof = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IncomeProof/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getIncomeProofs = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IncomeProof');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveIncomeProof = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IncomeProof/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateIncomeProof= async (id: number, payload: IncomeProofPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IncomeProof/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IncomeProofApiService updateCountry() error:", error);
            throw error;
        }
    };

    blockIncomeProof= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IncomeProof/deactive/${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IncomeProofApiService deleteIncomeProof() error:", error);
            throw error;
        }
    };

    unblockIncomeProof = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IncomeProof/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IncomeProofApiService deleteIncomeProof() error:", error);
            throw error;
        }
    };

}

export default IncomeProofApiService;
