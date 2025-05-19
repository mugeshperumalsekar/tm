import HttpClientWrapper from "../../../api/http-client-wrapper";
import {RelationPayload } from "./relation_payload";

class RelationApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateRelation= async (payload: RelationPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Relation/CreateRelationRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RelationApiService Relation() error:", error);
            throw error;
        }
    };
    getRelation= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Relation');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActiveRelation = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Relation/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveRelation= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Relation/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateRelation= async (id: number, payload: RelationPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Relation/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RelationApiService updateRelation() error:", error);
            throw error;
        }
    };

    blockRelation= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Relation/deactive/${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RelationApiService deleteRelation() error:", error);
            throw error;
        }
    };

    unblockRelation= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Relation/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RelationApiService deleteRelation() error:", error);
            throw error;
        }
    };

}

export default RelationApiService;