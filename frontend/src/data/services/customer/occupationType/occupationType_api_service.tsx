import HttpClientWrapper from "../../../api/http-client-wrapper";
import {OccupationTypePayload } from "./occupationType_payload";

class OccupationTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateOccupationType= async (payload: OccupationTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/OccupationType/CreateOccupationType', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("OccupationTypeApiService OccupationType() error:", error);
            throw error;
        }
    };
    getOccupationType= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/OccupationType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getOccupationTypes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/OccupationType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveOccupationType= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/OccupationType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateOccupationType= async (id: number, payload: OccupationTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/OccupationType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("OccupationTypeApiService updateOccupationType() error:", error);
            throw error;
        }
    };

    blockOccupationType= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/OccupationType/deactive/${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("OccupationTypeApiService deleteOccupationType() error:", error);
            throw error;
        }
    };

    unblockOccupationType= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/OccupationType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("OccupationTypeApiService deleteOccupationType() error:", error);
            throw error;
        }
    };

}

export default OccupationTypeApiService;