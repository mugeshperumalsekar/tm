
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { CardTypePayload } from "./cardType_payload";


class CardTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateCardType= async (payload: CardTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/CardType/CreateCardTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CardTypeApiService CardType() error:", error);
            throw error;
        }
    };
    getCardType= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CardType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActiveCardType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CardType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveCardType= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CardType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateCardType= async (id: number, payload: CardTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CardType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CardTypeApiService updateCardType() error:", error);
            throw error;
        }
    };

    blockCardType= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CardType/${id}/deActivate`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CardTypeApiService deleteCardType() error:", error);
            throw error;
        }
    };

    unblockCardType= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CardType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CardTypeApiService deleteCardType() error:", error);
            throw error;
        }
    };

}

export default CardTypeApiService;