import HttpClientWrapper from "../../../api/http-client-wrapper";

class CaseDetailsApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getCaseDetails = async (accountId: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/CaseDetails/getAllCaseDetails?accountId=${accountId}`);
            return response;
        } catch (error) {
            console.error('Error fetching the getCaseDetails:', error);
        }
    };
}

export default CaseDetailsApiService;