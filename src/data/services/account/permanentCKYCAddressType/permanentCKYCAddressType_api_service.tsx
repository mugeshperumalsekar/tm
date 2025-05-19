import HttpClientWrapper from "../../../api/http-client-wrapper";
import { PermanentCKYCAddressTypePayload } from "./permanentCKYCAddressType_payload";

class PermanentCKYCAddressTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreatePermanentCKYCAddressType = async (payload: PermanentCKYCAddressTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/PermanentCKYCAddressType/CreateAccAddressTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PermanentCKYCAddressTypeApiService PermanentCKYCAddressType() error:", error);
            throw error;
        }
    };

    updatePermanentCKYCAddressType= async (id: number, payload: PermanentCKYCAddressTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PermanentCKYCAddressType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PermanentCKYCAddressTypeApiService updatePermanentCKYCAddressType() error:", error);
            throw error;
        }
    };

    getPermanentCKYCAddressTypes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PermanentCKYCAddressType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getPermanentCKYCAddressType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PermanentCKYCAddressType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
  
    getDeactivePermanentCKYCAddressType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/PermanentCKYCAddressType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    
    blockPermanentCKYCAddressType= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PermanentCKYCAddressType/deactive/${id}`);
            
            return response;
        } catch (error) {
            console.error("PermanentCKYCAddressTypeApiService deletePermanentCKYCAddressType() error:", error);
            throw error;
        }
    };

    unblockPermanentCKYCAddressType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/PermanentCKYCAddressType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("PermanentCKYCAddressTypeApiService deletePermanentCKYCAddressType() error:", error);
            throw error;
        }
    };

}

export default PermanentCKYCAddressTypeApiService;