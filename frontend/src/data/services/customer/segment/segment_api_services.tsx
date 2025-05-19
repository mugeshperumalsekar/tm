import HttpClientWrapper from "../../../api/http-client-wrapper";
import { SegmentPayload } from "./segment_payload";

class SegmentApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateSegment = async (payload: SegmentPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Segment/CreateSegmentRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("SegmentApiService Segment() error:", error);
            throw error;
        }
    };
    getSegment = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Segment/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getSegments = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Segment');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveSegment = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Segment/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateSegment= async (id: number, payload: SegmentPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Segment/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("SegmentApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateSegment = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Segment/${id}/deactive?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("SegmentApiService deActivateSegment() error:", error);
            throw error;
        }
    };
    

    unblockSegment = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Segment/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("SegmentApiService deleteSegment() error:", error);
            throw error;
        }
    };

}

export default SegmentApiService;