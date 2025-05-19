import HttpClientWrapper from "../../../api/http-client-wrapper";
import { QualificationPayload } from "./qualification_payload";

class QualificationApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateQualification = async (payload: QualificationPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Qualification/CreateQualificationRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("QualificationApiService Qualification() error:", error);
            throw error;
        }
    };
    getQualification = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Qualification/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getQualifications = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Qualification');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveQualification = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Qualification/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateQualification= async (id: number, payload: QualificationPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Qualification/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("QualificationApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateQualification = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Qualification/deactive/${id}?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("QualificationApiService deActivateQualification() error:", error);
            throw error;
        }
    };
    

    unblockQualification = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Qualification/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("QualificationApiService deleteQualification() error:", error);
            throw error;
        }
    };

}

export default QualificationApiService;