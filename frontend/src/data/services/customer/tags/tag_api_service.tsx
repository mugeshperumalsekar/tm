import HttpClientWrapper from "../../../api/http-client-wrapper";
import {TagPayload } from "./tag_payload";

class TagApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateTag= async (payload: TagPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Tags/CreateTags', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("TagApiService Tag() error:", error);
            throw error;
        }
    };
    getTag= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Tags');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getTags = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Tags/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveTag= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Tags/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateTag= async (id: number, payload: TagPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Tags/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("TagApiService updateTag() error:", error);
            throw error;
        }
    };

    blockTag= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Tags/deactive/${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("TagApiService deleteTag() error:", error);
            throw error;
        }
    };

    unblockTag= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Tags/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("TagApiService deleteTag() error:", error);
            throw error;
        }
    };

}

export default TagApiService;