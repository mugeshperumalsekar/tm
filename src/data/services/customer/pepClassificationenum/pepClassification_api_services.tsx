import HttpClientWrapper from "../../../api/http-client-wrapper";
import {PEPClassificationEnumPayload } from "./pepClassification-payload";

class PEPClassificationApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreatePEPClassification= async (payload: PEPClassificationEnumPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/PEPClassificationEnum/CreatePEPClassificationEnumRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PEPClassificationEnumApiService PEPClassificationEnum() error:", error);
            throw error;
        }
    };
    getPEPClassification= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PEPClassificationEnum');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActivePEPClassification = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PEPClassificationEnum/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactivePEPClassification= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PEPClassificationEnum/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updatePEPClassification= async (id: number, payload: PEPClassificationEnumPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PEPClassificationEnum/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PEPClassificationEnumApiService updatePEPClassificationEnum() error:", error);
            throw error;
        }
    };

    blockPEPClassification= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PEPClassificationEnum/${id}/deactive`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PEPClassificationEnumApiService deletePEPClassificationEnum() error:", error);
            throw error;
        }
    };

    unblockPEPClassification= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PEPClassificationEnum/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PEPClassificationEnumApiService deletePEPClassificationEnum() error:", error);
            throw error;
        }
    };

}

export default PEPClassificationApiService;