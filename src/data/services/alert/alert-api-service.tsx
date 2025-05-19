import HttpClientWrapper from "../../api/http-client-wrapper";
import { LevelFlowPayload } from "./alert-payload";

class AlertViewApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAlertDetails = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/CaseDetailsAlert/getCaseDetailsAlert?id=${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getLevelOneData = async (levelId: any) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/LevelOne/levelId?levelId=${levelId}`);
            return response;
        } catch (error) {
            console.error('Error fetching level data:', error);
            throw error;
        }
    };

    saveDocument = async (files: File[], alertId: number, customerId: number, accountId: number, imgName: string) => {
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append('files', file));
            const params = new URLSearchParams({
                alertId: String(alertId),
                customerId: String(customerId),
                accountId: String(accountId),
                imgName,
            }).toString();
            const response = await this.httpClientWrapper.postFormData(`/api/v1/Document/files/upload?${params}`, formData);
            return response;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    };

    createStatus = async (payload: LevelFlowPayload) => {
        try {
            const response = await this.httpClientWrapper.post(`/api/v1/LevelFlowApiService/CreateLevelRequest`, payload);
            return response;
        } catch (error) {
            console.log('Error inserting the createStatus:', error);
            throw error;
        }
    };

    getImage = async (customerId: number, accountId: number, alertId: number) => {
        try {
            const response = await this.httpClientWrapper.getLocalImage(`/api/v1/Document/downloadDocument/${customerId}?accountId=${accountId}&alertId=${alertId}`);
            return response;
        } catch (error) {
            console.error("AddressApiService getLocalImage() error:", error);
            throw error;
        }
    };

    getPDF = async (customerId: number, accountId: number, alertId: number) => {
        try {
            const response: any = await this.httpClientWrapper.getLocalPDF(`/api/v1/Document/downloadDocument/${customerId}?accountId=${accountId}&alertId=${alertId}`);
            const filename = typeof response === 'object' && response.headers
                ? (response.headers['content-disposition'] || '').split('filename=')[1]
                : 'default_filename.pdf';
            return { data: response, filename };
        } catch (error) {
            console.error("AddressApiService getPDF() error:", error);
            throw error;
        }
    };

    getDocumentView = async (customerId: number, accountId: number, alertId: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/Document/downloadDocument/${customerId}?accountId=${accountId}&alertId=${alertId}`);
            console.log('getDocumentView response:', response);
            return response;
        } catch (error) {
            console.log('Error fetching the getDocumentView:', error);
            throw error;
        }
    };

}

export default AlertViewApiService;