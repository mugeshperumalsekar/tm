import HttpClientWrapper from "../../../api/http-client-wrapper";
import { ProductAccountStatusPayload } from "./productAccountStatus_payload";

class ProductAccountStatusApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateProductAccountStatus = async (payload: ProductAccountStatusPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ProductAccountStatus/CreateProductAccountStatusRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ProductAccountStatusApiService ProductAccountStatus() error:", error);
            throw error;
        }
    };

    updateProductAccountStatus = async (id: number, payload: ProductAccountStatusPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ProductAccountStatus/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ProductAccountStatusApiService updateProductAccountStatus() error:", error);
            throw error;
        }
    };

    getProductAccountStatuss = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ProductAccountStatus');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getProductAccountStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ProductAccountStatus/active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getDeactiveProductAccountStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ProductAccountStatus/DeActive');
            return response;
        } catch (error) {
            throw error;
        }
    };

    blockProductAccountStatus = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ProductAccountStatus/${id}/deActivate`);
            return response;
        } catch (error) {
            console.error("ProductAccountStatusApiService deleteProductAccountStatus() error:", error);
            throw error;
        }
    };

    unblockProductAccountStatus = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ProductAccountStatus/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ProductAccountStatusApiService deleteProductAccountStatus() error:", error);
            throw error;
        }
    };

}

export default ProductAccountStatusApiService;