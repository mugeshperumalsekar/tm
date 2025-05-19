import HttpClientWrapper from "../../../api/http-client-wrapper";
import { AttachmentPayload } from "./attachment_payload";

class AttachmentApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateAttachment = async (payload: AttachmentPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Attachment/CreateAttachmentRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AttachmentApiService Attachment() error:", error);
            throw error;
        }
    };

    getAttachment = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Attachment/active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getAttachments = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Attachment');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getDeactiveAttachment = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Attachment/DeActive');
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateAttachment = async (id: number, payload: AttachmentPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Attachment/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AttachmentApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateAttachment = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Attachment/deactive/${id}?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AttachmentApiService deActivateAttachment() error:", error);
            throw error;
        }
    };

    unblockAttachment = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Attachment/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AttachmentApiService deleteAttachment() error:", error);
            throw error;
        }
    };

}

export default AttachmentApiService;