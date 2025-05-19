import HttpClientWrapper from "../../../api/http-client-wrapper";
import { CustomerTypePayload } from "./customerType_payload";

class CustomerTypeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateCustomerType = async (payload: CustomerTypePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/CustomerType/CreateCustomerTypeRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CustomerTypeApiService CustomerType() error:", error);
            throw error;
        }
    };
    getCustomerType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CustomerType/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getCustomerTypes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CustomerType');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveCustomerType = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CustomerType/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateCustomerType= async (id: number, payload: CustomerTypePayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CustomerType/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CustomerTypeApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateCustomerType = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CustomerType/deactive/${id}?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CustomerTypeApiService deActivateCustomerType() error:", error);
            throw error;
        }
    };
    

    unblockCustomerType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CustomerType/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CustomerTypeApiService deleteCustomerType() error:", error);
            throw error;
        }
    };

}

export default CustomerTypeApiService;