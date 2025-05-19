import HttpClientWrapper from "../../../api/http-client-wrapper";
import { ProofOfIDSubmittedPayload } from "./proofOfIDSubmitted_payload";

class ProofOfIDSubmittedApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateProofOfIDSubmitted = async (payload: ProofOfIDSubmittedPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ProofOfIDSubmitted/CreateProofOfIDSubmittedRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ProofOfIDSubmittedApiService ProofOfIDSubmitted() error:", error);
            throw error;
        }
    };
    getProofOfIDSubmitted = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ProofOfIDSubmitted/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getProofOfIDSubmitteds = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ProofOfIDSubmitted');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveProofOfIDSubmitted = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ProofOfIDSubmitted/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateProofOfIDSubmitted= async (id: number, payload: ProofOfIDSubmittedPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ProofOfIDSubmitted/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ProofOfIDSubmittedApiService updateProofOfIDSubmitted() error:", error);
            throw error;
        }
    };

    
    blockProofOfIDSubmitted= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ProofOfIDSubmitted/deactive/${id}`);
            
            return response;
        } catch (error) {
            console.error("ProofOfIDSubmittedApiService deleteProofOfIDSubmitted() error:", error);
            throw error;
        }
    };

    unblockProofOfIDSubmitted = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ProofOfIDSubmitted/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ProofOfIDSubmittedApiService deleteProofOfIDSubmitted() error:", error);
            throw error;
        }
    };

}

export default ProofOfIDSubmittedApiService;