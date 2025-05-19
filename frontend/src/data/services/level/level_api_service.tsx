import HttpClientWrapper from "../../api/http-client-wrapper";
import { HitcasePayload, HitdatalifecyclePayload, HitrecordlifecyclePayload, PindingcasesPayload, RecordDTO, SearchDTO } from "./level_payload";

class LevelApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Status');
            return response;
        } catch (error) {
            throw error;
        }
    };

    CreateHitdatalifecycle = async (payload: HitdatalifecyclePayload) => {
        const statusIds = payload.statusId;
        if (parseInt(statusIds) == 1) {
            try {
                const response = await this.httpClientWrapper.post('/api/hitrecordlifecycle/createhitrecordlifecycle', payload);
                return response;
            } catch (error) {
                console.error("HitdatalifecycleApiService CreateHitdatalifecycle() error:", error);
                throw error;
            }
        }
    };

    CreateHitCaseInsert = async (payload: HitcasePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/insert/CreateHitCase', payload);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    getRecordsCount = async (searchDTO: SearchDTO): Promise<RecordDTO[]> => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/Count/RecordsCount?name=${searchDTO.name}&matching_score=${searchDTO.matching_score}&listId=${searchDTO.listID}&listId=${searchDTO.partySubTypeID}&listId=${searchDTO.countryId}&isBulkSearch=${searchDTO.isBulkSearch}&uid=${searchDTO.uid}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getLevelOneData = async (loginDetails: any) => {
        try {
            const levelId = loginDetails?.accessLevel;
            if (!levelId) {
                throw new Error("accessLevel not found in loginDetails");
            }
            const response = await this.httpClientWrapper.get(`/api/v1/LevelOne/levelId?levelId=${levelId}`);
            return response;
        } catch (error) {
            console.error('Error fetching level data:', error);
            throw error;
        }
    };

    getLevel = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Level');
            return response;
        } catch (error) {
            throw error;
        }
    };

    CreatLevelFlowcycle = async (payload: HitrecordlifecyclePayload) => {
        {
            try {
                const response = await this.httpClientWrapper.post('/api/v1/LevelFlowApiService/CreateLevelRequest', payload);
                return response;
            } catch (error) {
                console.error("HitdatalifecycleApiService CreateHitdatalifecycle() error:", error);
                throw error;
            }
        }
    };

    getpendingalertdetails = async () => {
        try {
            const levelId = 1;
            const response = await this.httpClientWrapper.get(`/api/v1/pendingalert?levelId=${levelId}`);
            return response;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    getRemarkDetails = async (hitdataId: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/RemarksDetails?hitdataId=${hitdataId}`);
            return response;
        } catch (error) {
            console.log("Error fetching the getRemarkDetails:", error);
        }
    };

    getPendingAlertDetails = async (loginDetails: any, statusId: any) => {
        try {
            const levelId = loginDetails?.accessLevel;
            if (!levelId) {
                throw new Error("accessLevel not found in loginDetails");
            }
            const response = await this.httpClientWrapper.get(`/api/v1/LevelFlowApiService?levelId=${levelId}&statusId=${statusId}`);
            return response;
        } catch (error) {
            console.error("Error fetching pending alert details:", error);
            throw error;
        }
    };

    getsanRemarkending = async (hitId: any) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/RemarksDetails?hitdataId=${hitId}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getPendingcases = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/pendingcase/l3PendingCase');
            return response;
        } catch (error) {
            throw error;
        }
    };

    CreateCaseLifeCycleImplInsert = async (payload: PindingcasesPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/insert/CaseLifeCycleImpl', payload);
            return response;
        } catch (error) {
            console.error("HitcaseApiService CreateCaseLifeCycleImplInsert() error:", error);
            throw error;
        }
    };

    getRIF = async () => {
        try {
            const levelId = 3;
            const levelIds = 4;
            const response = await this.httpClientWrapper.get(`/api/v1/levelFour?levelId=${levelId}&levelIds=${levelIds}`);
            return response;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    getPendingcaseRIF = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/pendingcase/l4PendingCase');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getpendingRIF = async () => {
        try {
            const levelId = 0;
            const response = await this.httpClientWrapper.get(`/api/v1/levelFour?levelId=${levelId}`);
            return response;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

}

export default LevelApiService;