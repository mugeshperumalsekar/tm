import HttpClientWrapper from "../../../api/http-client-wrapper";
import { FamilyCodePayload } from "./familycode_payload";


class FamilyCodeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateFamilyCode = async (payload: FamilyCodePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/FamilyCode/CreateFamilyCode', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("FamilyCodeApiService FamilyCode() error:", error);
            throw error;
        }
    };
    getFamilyCode = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/FamilyCode/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getFamilysCode = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/FamilyCode');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveFamilyCode= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/FamilyCode/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateFamilyCode= async (id: number, payload: FamilyCodePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/FamilyCode/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("FamilyCodeApiService updateFamilyCode() error:", error);
            throw error;
        }
    };

    blockFamilyCode= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/FamilyCode/deactive${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("FamilyCodeApiService deleteFamilyCodel() error:", error);
            throw error;
        }
    };

    unblockFamilyCode = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/FamilyCode/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("FamilyCodeApiService deleteFamilyCode() error:", error);
            throw error;
        }
    };

}

export default FamilyCodeApiService;