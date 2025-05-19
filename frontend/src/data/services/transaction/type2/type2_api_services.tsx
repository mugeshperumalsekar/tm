
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { Type2Payload } from "./type2_payload";


class Type2ApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateType2= async (payload: Type2Payload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Type2/CreateType2Request', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("Type2ApiService Type2() error:", error);
            throw error;
        }
    };
    getType2= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Type2');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActiveType2 = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Type2/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveType2= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Type2/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateType2= async (id: number, payload: Type2Payload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Type2/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("Type2ApiService updateType2() error:", error);
            throw error;
        }
    };

    blockType2= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Type2/${id}/deActivate`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("Type2ApiService deleteType2() error:", error);
            throw error;
        }
    };

    unblockType2= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Type2/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("Type2ApiService deleteType2() error:", error);
            throw error;
        }
    };

}

export default Type2ApiService;