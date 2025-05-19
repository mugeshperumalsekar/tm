import HttpClientWrapper from "../../../api/http-client-wrapper";
import { AdmingroupPayload, AdminPayload, ClientPayload } from "./admingroup_payload";

class AdmingroupApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    doMasterAdmingroup = async (payload: AdmingroupPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/admingroup/createAdmingroup', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdmingroupApiService doMasterRelativeType() error:", error);
            throw error;
        }
    };

    getAdmingroup = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/admingroup');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getGroupOptions = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Group/active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getCategories = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Category');
            return response;
        } catch (error) {
            console.error("CategoryApiService getCategories() error:", error);
            throw error;
        }
    };

    getAdmins = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/AdminSubscription/active');
            return response;
        } catch (error) {
            console.error("AdminApiService getAdmins() error:", error);
            throw error;
        }
    };

    blockAdmin = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/AdminSubscription/${id}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdminApiService blockAdmin() error:", error);
            throw error;
        }
    };

    createAdmin = async (payload: AdminPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/AdminSubscription/CreateAdminSubscriptionRequest', payload);
            return response;
        } catch (error) {
            console.error("AdminApiService createAdmin() error:", error);
            throw error;
        }
    };

    getClientsAdmin = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/AdminSubscription/client');
            return response;
        } catch (error) {
            console.error("AdminApiService getAdmins() error:", error);
            throw error;
        }
    };

    createClient = async (payload: ClientPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ClientSubscription/CreateClientSubscriptionRequest', payload);
            return response;
        } catch (error) {
            console.error("ClientApiService createClient() error:", error);
            throw error;
        }
    };

    getUserName = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/users/ClientId');
            return response
        } catch (error) {
            throw error;
        }
    };
}

export default AdmingroupApiService;