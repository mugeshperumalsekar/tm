import HttpClientWrapper from "../../../api/http-client-wrapper";
import { KYCAttesationPayload } from "./kycAttesation_payload";

class KYCAttesationApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateKYCAttesation = async (payload: KYCAttesationPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/KYCAttestation/CreateKYCAttestationRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("KYCAttesationApiService KYCAttesation() error:", error);
            throw error;
        }
    };
    getKYCAttesation = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/KYCAttestation/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    getKYCAttesations = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/KYCAttestation');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveKYCAttesation = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/KYCAttestation/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateKYCAttesation= async (id: number, payload: KYCAttesationPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/KYCAttestation/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("KYCAttesationApiService updateKYCAttesation() error:", error);
            throw error;
        }
    };

    
    blockKYCAttesation= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/KYCAttestation/deactive/${id}`);
            
            return response;
        } catch (error) {
            console.error("KYCAttesationApiService deleteKYCAttesation() error:", error);
            throw error;
        }
    };

    unblockKYCAttesation = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/KYCAttestation/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("KYCAttesationApiService deleteKYCAttesation() error:", error);
            throw error;
        }
    };

}

export default KYCAttesationApiService;