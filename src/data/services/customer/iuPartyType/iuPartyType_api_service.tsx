import HttpClientWrapper from "../../../api/http-client-wrapper";
import {IUPartyTypePayload } from "./iuPartyType_payload";

class IUPartyTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateIUPartyType = async (payload: IUPartyTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/IUPartyType/CreateIUPartyTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IUPartyTypeApiService IUPartyType() error:", error);
            throw error;
        }
    };
    getIUPartyType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IUPartyType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getIUPartyTypes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IUPartyType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveIUPartyType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/IUPartyType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateIUPartyType= async (id: number, payload: IUPartyTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IUPartyType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IUPartyTypeApiService updateIUPartyType() error:", error);
            throw error;
        }
    };

    
    blockIUPartyType= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IUPartyType/deactive/${id}`);
            
            return response;
        } catch (error) {
            console.error("IUPartyTypeApiService deleteIUPartyType() error:", error);
            throw error;
        }
    };

    unblockIUPartyType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/IUPartyType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("IUPartyTypeApiService deleteIUPartyType() error:", error);
            throw error;
        }
    };

}

export default IUPartyTypeApiService;