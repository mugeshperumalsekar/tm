import HttpClientWrapper from "../../../api/http-client-wrapper";
import {UserCodePayload } from "./userCode_payload";

class UserCodeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateUserCode= async (payload: UserCodePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/UserCode/CreateUserCode', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("UserCodeApiService UserCode() error:", error);
            throw error;
        }
    };
    getUserCode= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/UserCode');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getUserCodes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/UserCode/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveUserCode= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/UserCode/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateUserCode= async (id: number, payload: UserCodePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/UserCode/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("UserCodeApiService updateUserCode() error:", error);
            throw error;
        }
    };

    blockUserCode= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/UserCode/deactive/${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("UserCodeApiService deleteUserCode() error:", error);
            throw error;
        }
    };

    unblockUserCode= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/UserCode/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("UserCodeApiService deleteUserCode() error:", error);
            throw error;
        }
    };

}

export default UserCodeApiService;