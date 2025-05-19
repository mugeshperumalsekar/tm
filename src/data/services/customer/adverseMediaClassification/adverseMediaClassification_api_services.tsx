import HttpClientWrapper from "../../../api/http-client-wrapper";
import { AdverseMediaClassificationPayload } from "./adversemedia_payload";

class AdverseMediaClassificationApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateAdverseMediaClassification = async (payload: AdverseMediaClassificationPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/AdverseMediaClassification/CreateAdverseMediaClassificationRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdverseMediaClassificationApiService AdverseMediaClassification() error:", error);
            throw error;
        }
    };

    getAdverseMediaClassification = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/AdverseMediaClassification/active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getAdverseMediaClassifications = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/AdverseMediaClassification');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getDeactiveAdverseMediaClassification = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/AdverseMediaClassification/DeActive');
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateAdverseMediaClassification = async (id: number, payload: AdverseMediaClassificationPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/AdverseMediaClassification/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdverseMediaClassificationApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateAdverseMediaClassification = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/AdverseMediaClassification/${id}/deactive?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdverseMediaClassificationApiService deActivateAdverseMediaClassification() error:", error);
            throw error;
        }
    };

    unblockAdverseMediaClassification = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/AdverseMediaClassification/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdverseMediaClassificationApiService deleteAdverseMediaClassification() error:", error);
            throw error;
        }
    };

}

export default AdverseMediaClassificationApiService;