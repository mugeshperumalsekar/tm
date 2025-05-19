import HttpClientWrapper from "../../../api/http-client-wrapper";
import { CustomerRelatedPartyStatusPayload } from "./customerRelatedPartyStatus_payload";


class CustomerRelatedPartyStatusApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateCustomerRelatedPartyStatus = async (payload: CustomerRelatedPartyStatusPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/CustomerRelatedPartyStatus/CreateCustomerRelatedPartyStatusRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CustomerRelatedPartyStatusApiService CustomerRelatedPartyStatus() error:", error);
            throw error;
        }
    };
    getCustomerRelatedPartyStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CustomerRelatedPartyStatus/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getCustomerRelatedPartyStatuss = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CustomerRelatedPartyStatus');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveCustomerRelatedPartyStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CustomerRelatedPartyStatus/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateCustomerRelatedPartyStatus= async (id: number, payload: CustomerRelatedPartyStatusPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CustomerRelatedPartyStatus/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CustomerRelatedPartyStatusApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateCustomerRelatedPartyStatus = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CustomerRelatedPartyStatus/${id}/deactive?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CustomerRelatedPartyStatusApiService deActivateCustomerRelatedPartyStatus() error:", error);
            throw error;
        }
    };
    

    unblockCustomerRelatedPartyStatus = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/CustomerRelatedPartyStatus/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CustomerRelatedPartyStatusApiService deleteCustomerRelatedPartyStatus() error:", error);
            throw error;
        }
    };

}

export default CustomerRelatedPartyStatusApiService;