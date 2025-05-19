import HttpClientWrapper from "../../../api/http-client-wrapper";
import { AccountRelationPayload } from "./accountRelation_payload";

class AccountRelationApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateAccountRelation = async (payload: AccountRelationPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/AccountRelation/CreateAccountRelationRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AccountRelationApiService AccountRelation() error:", error);
            throw error;
        }
    };

    updateAccountRelation = async (id: number, payload: AccountRelationPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/AccountRelation/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AccountRelationApiService updateAccountRelation() error:", error);
            throw error;
        }
    };

    getAccountRelations = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/AccountRelation');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getAccountRelation = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/AccountRelation/active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getDeactiveAccountRelation = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/AccountRelation/DeActive');
            return response;
        } catch (error) {
            throw error;
        }
    };

    blockAccountRelation = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/AccountRelation/${id}/deActivate`);
            return response;
        } catch (error) {
            console.error("AccountRelationApiService deleteAccountRelation() error:", error);
            throw error;
        }
    };

    unblockAccountRelation = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/AccountRelation/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AccountRelationApiService deleteAccountRelation() error:", error);
            throw error;
        }
    };

}

export default AccountRelationApiService;