import HttpClientWrapper from "../../api/http-client-wrapper";

class CaseManagerApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAll = async () => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/search/fetchAllSearch`);
            return response;
        } catch (error) {
            console.error('Error fetching the getAll:', error);
        }
    };

    getUnassigned = async () => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/assignTask/fetchAllAssignView`);
            return response;
        } catch (error) {
            console.error(`Error fetching the getUnassigned:`, error);
        }
    };

    getAssignedToMe = async () => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/BulkTaskAssignView/{AssignToMe}/ActiveAssign`);
            return response;
        } catch (error) {
            console.error(`Error fetching the getAssignedToMe:`, error);
        }
    };

    getCaseDetailsSearch = async (caseId: number, productAccountNumber: string) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/CaseDetailsSearch/CaseDetailsSearch?caseId=${caseId}&productAccountNumber=${productAccountNumber}`);
            return response;
        } catch (error) {
            console.error(`Error fetching the getCaseDetailsSearch:`, error);
        }
    };

    getAssignee = async () => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/selectAssignee/fetchAllSelectAssignee`);
            return response;
        } catch (error) {
            console.error(`Error fetching the getAssignee:`, error);
        }
    };

    getPendingCases = async () => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/HitRecord/fetchAllData`);
            return response;
        } catch (error) {
            console.error(`Error fetching the getPendingCases:`, error);
        }
    };

    getReported = async (levelId: any, statusId: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/LevelFlowApiService?levelId=${levelId}&statusId=${statusId}`);
            return response;
        } catch (error) {
            console.error("Error fetching pending alert details:", error);
            throw error;
        }
    };

}

export default CaseManagerApiService;