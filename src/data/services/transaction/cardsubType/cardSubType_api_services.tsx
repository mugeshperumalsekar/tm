import HttpClientWrapper from "../../../api/http-client-wrapper";
import { CardSubTypePayload } from "./cardSubType_payload";

class CardSubTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateCardSubType = async (payload: CardSubTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/CardSubType/CreateCardSubTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CardSubTypeApiService CardSubType() error:", error);
            throw error;
        }
    };

    getCardSubType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CardSubType');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getActiveCardSubType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CardSubType/active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getDeactiveCardSubType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CardSubType/DeActive');
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateCardSubType = async (id: number, payload: CardSubTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CardSubType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CardSubTypeApiService updateCardSubType() error:", error);
            throw error;
        }
    };

    blockCardSubType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CardSubType/${id}/deActivate`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CardSubTypeApiService deleteCardSubType() error:", error);
            throw error;
        }
    };

    unblockCardSubType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CardSubType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CardSubTypeApiService deleteCardSubType() error:", error);
            throw error;
        }
    };

}

export default CardSubTypeApiService;