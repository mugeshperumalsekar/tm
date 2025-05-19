import HttpClientWrapper from "../../../api/http-client-wrapper";
import { CountryPayload } from "./country_payload";

class CountryApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateCountry = async (payload: CountryPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/TmConfigCountry/CreateTmConfigCountryRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CountryApiService Country() error:", error);
            throw error;
        }
    };
    getCountry = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/TmConfigCountry/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getCountrys = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/TmConfigCountry');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveCountry = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/TmConfigCountry/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateCountry= async (id: number, payload: CountryPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/TmConfigCountry/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CountryApiService updateCountry() error:", error);
            throw error;
        }
    };

    deActivateCountry = async (id: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/TmConfigCountry/deactive/${id}?euid=${euid}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CountryApiService deActivateCountry() error:", error);
            throw error;
        }
    };
    

    unblockCountry = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/TmConfigCountry/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CountryApiService deleteCountry() error:", error);
            throw error;
        }
    };

}

export default CountryApiService;