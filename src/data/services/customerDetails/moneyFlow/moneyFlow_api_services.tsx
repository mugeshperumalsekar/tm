// import internal from "stream";
// import HttpClientWrapper from "../../../api/http-client-wrapper";

// class MoneyFlowApiServices {

//     private httpClientWrapper: HttpClientWrapper;

//     constructor() {
//         this.httpClientWrapper = new HttpClientWrapper();
//     }

//     getMoneyFlow = async (customerId: number, frmDate: String, toDate: String, useLast12Months: number) => {
//         try {
//             const response = await this.httpClientWrapper.get(`/api/v1/MoneyFlow/moneyFlow?customerId=${customerId}&frmDate=${frmDate}&toDate=${toDate}&useLast12Months=${useLast12Months}`);
//             return response;
//         } catch (error) {
//             console.log('Error fetching the getMoneyFlow:', error);
//         }
//     };
// }

// export default MoneyFlowApiServices;

import HttpClientWrapper from "../../../api/http-client-wrapper";
import { Months } from "./moneyFlow_payload";

class MoneyFlowApiServices {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    // getMoneyFlow = async (accountId: number, frmDate: string | null, toDate: string | null, useLast12Months: number) => {
    //     try {
    //         let url = `/api/v1/MoneyFlow/moneyFlow?accountId=${accountId}&useLast12Months=${useLast12Months}`;
    //         if (frmDate && toDate) {
    //             url += `&frmDate=${frmDate}&toDate=${toDate}`;
    //         }
    //         const response = await this.httpClientWrapper.get(url);
    //         return response;
    //     } catch (error) {
    //         console.error('Error fetching the getMoneyFlow:', error);
    //     }
    // };

    getMoneyFlow = async (accountId: number, frmDate: string | null, toDate: string | null, useLast12Months: number) => {
        try {
            let url = `/api/v1/MoneyFlow/moneyFlow?accountId=${accountId}`;
            if (frmDate && toDate) {
                url += `&fromDate=${frmDate}&toDate=${toDate}`;
            }
            url += `&useLast12Months=${useLast12Months}`;
            const response = await this.httpClientWrapper.get(url);
            return response;
        } catch (error) {
            console.error('Error fetching the getMoneyFlow:', error);
        }
    };

    getMonth = async (accountId: number, month: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/MoneyFlow/monthData?accountId=${accountId}&month=${month}`);
            return response;
        } catch (error) {
            console.error('Error fetching the getMonth:', error);
        }
    };

}

export default MoneyFlowApiServices;