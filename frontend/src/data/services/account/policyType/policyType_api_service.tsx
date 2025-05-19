import HttpClientWrapper from "../../../api/http-client-wrapper";
import { PolicyTypePayload } from "./policyType_payload";

class PolicyTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreatePolicyType = async (payload: PolicyTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/PolicyType/CreatePolicyTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PolicyTypeApiService PolicyType() error:", error);
            throw error;
        }
    };

    updatePolicyType = async (id: number, payload: PolicyTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PolicyType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PolicyTypeApiService updatePolicyType() error:", error);
            throw error;
        }
    };

    getPolicyTypes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PolicyType');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getPolicyType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PolicyType/active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getDeactivePolicyType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PolicyType/DeActive');
            return response;
        } catch (error) {
            throw error;
        }
    };

    blockPolicyType = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PolicyType/${id}/deActivate`);
            return response;
        } catch (error) {
            console.error("PolicyTypeApiService deletePolicyType() error:", error);
            throw error;
        }
    };

    unblockPolicyType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PolicyType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PolicyTypeApiService deletePolicyType() error:", error);
            throw error;
        }
    };

}

export default PolicyTypeApiService;