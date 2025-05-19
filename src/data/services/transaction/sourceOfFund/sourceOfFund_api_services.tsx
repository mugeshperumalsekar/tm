
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { SourceOfFundPayload } from "./sourceOfFund_payload";


class SourceOfFundApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateSourceOfFund= async (payload: SourceOfFundPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/SourceOfFund/CreateSourceOfFundRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("SourceOfFundApiService SourceOfFund() error:", error);
            throw error;
        }
    };
    getSourceOfFund= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/SourceOfFund');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getActiveSourceOfFund = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/SourceOfFund/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveSourceOfFund= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/SourceOfFund/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateSourceOfFund= async (id: number, payload: SourceOfFundPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/SourceOfFund/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("SourceOfFundApiService updateSourceOfFund() error:", error);
            throw error;
        }
    };

    blockSourceOfFund= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/SourceOfFund/${id}/deActivate`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("SourceOfFundApiService deleteSourceOfFund() error:", error);
            throw error;
        }
    };

    unblockSourceOfFund= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/SourceOfFund/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("SourceOfFundApiService deleteSourceOfFund() error:", error);
            throw error;
        }
    };

}

export default SourceOfFundApiService;