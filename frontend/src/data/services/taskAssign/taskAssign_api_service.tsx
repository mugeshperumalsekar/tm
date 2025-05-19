import HttpClientWrapper from "../../api/http-client-wrapper";
import { TaskAssignBulkPayload } from "./taskAssign_payload";

class TaskAssignApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getSearch = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/search/fetchAllSearch');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getAssignedData = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/BulkTaskAssign/{isTaskAssigned}/Active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getadminuser = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/users');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getSanBulkTaskAssign = async (searchId: number) => {
        try {
            const response = await this.httpClientWrapper.gets(`/api/v1/BulkTaskAssign/{searchId}?searchId=${searchId}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    CreateBulkTask = async (payload: TaskAssignBulkPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/BulkTaskAssign/createBulkTaskAssign', payload);
            return response;
        } catch (error) {
            console.error('Error in CreateBulkTask:', error);
            throw error;
        }
    };

    getAccountDetails = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/assignTask/fetchAllAssignView');
            return response;
        } catch (error) {
            throw error;
        }
    };

}

export default TaskAssignApiService;