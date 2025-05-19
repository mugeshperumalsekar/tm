import HttpClientWrapper from "../../../api/http-client-wrapper";
import {StatePayload } from "./state_payload";

class StateApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateState= async (payload: StatePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/State/CreateState', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService State() error:", error);
            throw error;
        }
    };
    getState= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/State');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getStates = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/State/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveState= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/State/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateState= async (id: number, payload: StatePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/State/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService updateState() error:", error);
            throw error;
        }
    };

    blockState= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/State/deactive/${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService deleteState() error:", error);
            throw error;
        }
    };

    unblockState= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/State/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService deleteState() error:", error);
            throw error;
        }
    };

}

export default StateApiService;