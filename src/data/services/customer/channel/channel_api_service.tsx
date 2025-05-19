import HttpClientWrapper from "../../../api/http-client-wrapper";
import {ChannelPayload } from "./channel_payload";

class ChannelApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateChannel = async (payload: ChannelPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Channel/CreateChannel', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ChannelApiService Channel() error:", error);
            throw error;
        }
    };
    getactiveChannel = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Channel/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getChannels = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Channel');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveChannel = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Channel/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateChannel= async (id: number, payload: ChannelPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Channel/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ChannelApiService updateCountry() error:", error);
            throw error;
        }
    };

    blockChannel= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Channel/deactive/${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ChannelApiService deleteChannel() error:", error);
            throw error;
        }
    };

    unblockChannel = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Channel/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ChannelApiService deleteChannel() error:", error);
            throw error;
        }
    };

}

export default ChannelApiService;