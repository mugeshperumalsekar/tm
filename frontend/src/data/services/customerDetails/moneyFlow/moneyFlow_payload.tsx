export interface MoneyFlowPayload {
    customerId: number;
    period: String;
    moneyIn: number;
    moneyOut: number;
    netMoneyFlow: number;
    frmDate: String;
    toDate: String;
}

export interface Months {
    customerId: number;
    period: String;
    moneyIn: number;
    moneyOut: number;
    netMoneyFlow: number;
    fromDate: String;
    toDate: String;
}