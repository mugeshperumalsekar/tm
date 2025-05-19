import HttpClientWrapper from "../../../api/http-client-wrapper";
import {IntermediaryPayload } from "./intermediary_payload";

class IntermediaryApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateIntermediary= async (payload: IntermediaryPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/IntermediaryCode/CreateIntermediaryCode', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IntermediaryApiService Intermediary() error:", error);
            throw error;
        }
    };
    getIntermediary= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IntermediaryCode');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getIntermediarys = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IntermediaryCode/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveIntermediary= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IntermediaryCode/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateIntermediary= async (id: number, payload: IntermediaryPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IntermediaryCode/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IntermediaryApiService updateIntermediary() error:", error);
            throw error;
        }
    };

    blockIntermediary= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IntermediaryCode/deactive/${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IntermediaryApiService deleteIntermediary() error:", error);
            throw error;
        }
    };

    unblockIntermediary= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IntermediaryCode/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IntermediaryApiService deleteIntermediary() error:", error);
            throw error;
        }
    };

}

export default IntermediaryApiService;