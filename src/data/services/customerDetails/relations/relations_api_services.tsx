import HttpClientWrapper from "../../../api/http-client-wrapper";

class RelationsApiService {

    private httpClientWrapper = new HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getRelations = async (customerId: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/RelativeDetails/getRelativeDetails?customerId=${customerId}`);
            return response;
        } catch (error) {
            console.error('Error fetching the getRelations:', error);
        }
    };

}

export default RelationsApiService;