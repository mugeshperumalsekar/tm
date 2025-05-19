import HttpClientWrapper from "../../../api/http-client-wrapper";
import { AccountSegmentPayload } from "./accountSegment_payload";

class AccountSegmentApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateAccountSegment = async (payload: AccountSegmentPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/AccountSegment/CreateAccountSegmentRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AccountSegmentApiService AccountSegment() error:", error);
            throw error;
        }
    };

    updateAccountSegment = async (id: number, payload: AccountSegmentPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/AccountSegment/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AccountSegmentApiService updateAccountSegment() error:", error);
            throw error;
        }
    };

    getAccountSegments = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/AccountSegment');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getAccountSegment = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/AccountSegment/active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getDeactiveAccountSegment = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/AccountSegment/DeActive');
            return response;
        } catch (error) {
            throw error;
        }
    };

    blockAccountSegment = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/AccountSegment/deactive/${id}`);
            return response;
        } catch (error) {
            console.error("AccountSegmentApiService deleteAccountSegment() error:", error);
            throw error;
        }
    };

    unblockAccountSegment = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/AccountSegment/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AccountSegmentApiService deleteAccountSegment() error:", error);
            throw error;
        }
    };

}

export default AccountSegmentApiService;