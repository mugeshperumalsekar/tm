import HttpClientWrapper from "../../../api/http-client-wrapper";
import { GroundPayload } from "./ground_payload";

class GroundApiService {

    private httpClientWrapper = new HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    createGroundOfSuspicion = async (payload: GroundPayload) => {
        try {
            const response = await this.httpClientWrapper.post(`/api/v1/GroundsOfSuspicion/CreateGroundSuspicionRequest`, payload);
            return response;
        } catch (error) {
            console.error('Error inserting the groundOfSuspicion:', error);
        }
    };
}

export default GroundApiService;