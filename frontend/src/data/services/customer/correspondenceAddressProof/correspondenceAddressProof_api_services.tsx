import HttpClientWrapper from "../../../api/http-client-wrapper";
import { CorrespondenceAddressProofPayload } from "./correspondenceAddressProof_payload";

class CorrespondenceAddressProofApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateCorrespondenceAddressProof= async (payload: CorrespondenceAddressProofPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/CorresAddressProof/CreateCorresAddressProofRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CorrespondenceAddressProofApiService CorrespondenceAddressProof() error:", error);
            throw error;
        }
    };
    getCorrespondenceAddressProof= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CorresAddressProof');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActiveCorrespondenceAddressProof = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CorresAddressProof/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveCorrespondenceAddressProof= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CorresAddressProof/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateCorrespondenceAddressProof= async (id: number, payload: CorrespondenceAddressProofPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CorresAddressProof/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CorrespondenceAddressProofApiService updateCorrespondenceAddressProof() error:", error);
            throw error;
        }
    };

    blockCorrespondenceAddressProof= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CorresAddressProof/deactive/${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CorrespondenceAddressProofApiService deleteCorrespondenceAddressProof() error:", error);
            throw error;
        }
    };

    unblockCorrespondenceAddressProof= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CorresAddressProof/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CorrespondenceAddressProofApiService deleteCorrespondenceAddressProof() error:", error);
            throw error;
        }
    };

}

export default CorrespondenceAddressProofApiService;