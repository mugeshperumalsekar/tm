import HttpClientWrapper from "../../api/http-client-wrapper";

class PieChartApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getMonthData = async (accountId: number, fromDate?: string, toDate?: string, periodType?: number) => {
        try {
            let response;

            if (fromDate && toDate && periodType !== undefined) {
                response = await this.httpClientWrapper.get(
                    `/api/v1/GraphicalPieChartApiResources/data?accountId=${accountId}&fromDate=${fromDate}&toDate=${toDate}&periodType=${periodType}`
                );
            } else if (fromDate && toDate) {
                response = await this.httpClientWrapper.get(
                    `/api/v1/GraphicalPieChartApiResources/data?accountId=${accountId}&fromDate=${fromDate}&toDate=${toDate}`
                );
            } else if (periodType !== undefined) {
                response = await this.httpClientWrapper.get(
                    `/api/v1/GraphicalPieChartApiResources/data?accountId=${accountId}&periodType=${periodType}`
                );
            } else {
                throw new Error("Invalid parameters passed to getMonthData.");
            }
            return response;
        } catch (error) {
            console.error("Error fetching the data:", error);
            throw error;
        }
    };

    getInstrument = async () => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/InstrumentType`);
            return response;
        } catch (error) {
            console.error('Error fetching the getSegment:', error);
            throw error;
        }
    };

    getTransactionDetails = async (accountId: number, month: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/GraphicalPieChartApiResources/transTypeData?accountId=${accountId}&month=${month}`);
            return response;
        } catch (error) {
            console.error('Error fetching the getTransactionDetails', error);
            throw error;
        }
    };

    getInOutAmtTransfer = async (customerId: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/InOutAmtTransfer/customerId?customerId=${customerId}`);
            console.log('GetInOutAmtTransfer response:', response);
            return response;
        } catch (error) {
            console.error(`Error fetching the getInOutAmtTransfer:`, error);
            throw error;
        }
    };
}

export default PieChartApiService;