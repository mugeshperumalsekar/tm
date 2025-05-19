import HttpClientWrapper from "../../../api/http-client-wrapper";
import {ProductSegmentPayload } from "./productSegment_payload";

class ProductSegmentApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateProductSegment= async (payload: ProductSegmentPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ProductSegment/CreateProductSegmentRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ProductSegmentApiService ProductSegment() error:", error);
            throw error;
        }
    };
    getProductSegment= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ProductSegment');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getProductSegments = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ProductSegment/active');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };
    getDeactiveProductSegment= async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ProductSegment/DeActive');
            console.log("re:",response)
            return response;
          
        } catch (error) {
            throw error;
        }
    };

    updateProductSegment= async (id: number, payload: ProductSegmentPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ProductSegment/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ProductSegmentApiService updateProductSegment() error:", error);
            throw error;
        }
    };

    blockProductSegment= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ProductSegment/deactive/${id}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ProductSegmentApiService deleteProductSegment() error:", error);
            throw error;
        }
    };

    unblockProductSegment= async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ProductSegment/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ProductSegmentApiService deleteProductSegment() error:", error);
            throw error;
        }
    };

}

export default ProductSegmentApiService;