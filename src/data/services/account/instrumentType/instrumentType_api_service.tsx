import HttpClientWrapper from "../../../api/http-client-wrapper";
import { InstrumentTypePayload } from "./instrumentType_payload";

class InstrumentTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateInstrumentType = async (payload: InstrumentTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/InstrumentType/CreateInstrumentTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("InstrumentTypeApiService InstrumentType() error:", error);
            throw error;
        }
    };

    updateInstrumentType= async (id: number, payload: InstrumentTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/InstrumentType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("InstrumentTypeApiService updateInstrumentType() error:", error);
            throw error;
        }
    };

    getInstrumentTypes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/InstrumentType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getInstrumentType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/InstrumentType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
  
    getDeactiveInstrumentType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/InstrumentType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    
    blockInstrumentType= async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/InstrumentType/deactive/${id}`);
            
            return response;
        } catch (error) {
            console.error("InstrumentTypeApiService deleteInstrumentType() error:", error);
            throw error;
        }
    };

    unblockInstrumentType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/InstrumentType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("InstrumentTypeApiService deleteInstrumentType() error:", error);
            throw error;
        }
    };

}

export default InstrumentTypeApiService;