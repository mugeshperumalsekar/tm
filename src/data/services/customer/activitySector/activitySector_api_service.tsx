import HttpClientWrapper from "../../../api/http-client-wrapper";
import { ActivitySectorPayload } from "./activitySector_payload";

class ActivitySectorApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateActivitySector = async (payload: ActivitySectorPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ActivitySector/CreateActivitySectorRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ActivitySectorApiService ActivitySector() error:", error);
            throw error;
        }
    };

    getActivitySector = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ActivitySector/active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getActivitySectors = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ActivitySector');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getDeactiveActivitySector = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ActivitySector/DeActive');
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateActivitySector = async (id: number, payload: ActivitySectorPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ActivitySector/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ActivitySectorApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateActivitySector = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ActivitySector/${id}/deactive?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ActivitySectorApiService deActivateActivitySector() error:", error);
            throw error;
        }
    };

    unblockActivitySector = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ActivitySector/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ActivitySectorApiService deleteActivitySector() error:", error);
            throw error;
        }
    };

}

export default ActivitySectorApiService;