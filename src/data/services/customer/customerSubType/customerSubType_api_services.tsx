import HttpClientWrapper from "../../../api/http-client-wrapper";
import { CustomerSubTypePayload } from "./customerSubType_payload";

class CustomerSubTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateCustomerSubType = async (payload: CustomerSubTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/CustomerSubType/CreateCustomerSubTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CustomerSubTypeApiService CustomerSubType() error:", error);
            throw error;
        }
    };
    getCustomerSubType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CustomerSubType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getCustomerSubTypes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CustomerSubType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveCustomerSubType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CustomerSubType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateCustomerSubType= async (id: number, payload: CustomerSubTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CustomerSubType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CustomerSubTypeApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateCustomerSubType = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CustomerSubType/deactive/${id}?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CustomerSubTypeApiService deActivateCustomerSubType() error:", error);
            throw error;
        }
    };
    

    unblockCustomerSubType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CustomerSubType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CustomerSubTypeApiService deleteCustomerSubType() error:", error);
            throw error;
        }
    };

}

export default CustomerSubTypeApiService;