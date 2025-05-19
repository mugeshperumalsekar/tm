import HttpClientWrapper from "../../../api/http-client-wrapper";
import { ModuleApplicablePayload } from "./moduleApplicable_payload";

class ModuleApplicableApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateModuleApplicable = async (payload: ModuleApplicablePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ModuleApplicable/CreateModuleApplicableRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ModuleApplicableApiService ModuleApplicable() error:", error);
            throw error;
        }
    };
    getModuleApplicable = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ModuleApplicable/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getModuleApplicables = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ModuleApplicable');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveModuleApplicable = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ModuleApplicable/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateModuleApplicable= async (id: number, payload: ModuleApplicablePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ModuleApplicable/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ModuleApplicableApiService updateModuleApplicable() error:", error);
            throw error;
        }
    };

    
    blockModuleApplicable= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ModuleApplicable/deactive/${id}`);
            
            return response;
        } catch (error) {
            console.error("ModuleApplicableApiService deleteModuleApplicable() error:", error);
            throw error;
        }
    };

    unblockModuleApplicable = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ModuleApplicable/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ModuleApplicableApiService deleteModuleApplicable() error:", error);
            throw error;
        }
    };

}

export default ModuleApplicableApiService;