import HttpClientWrapper from "../../../api/http-client-wrapper";

class KycApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getCashManager = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/cashManager/getAllDetails?id=${id}`);
            return response;
        } catch (error) {
            console.error('Error fetching the getCashManager:', error);
        }
    };
}

export default KycApiService;