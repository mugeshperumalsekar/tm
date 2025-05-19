export interface PieChartPayload {
    month: string;
    totalAmount: number;
    IncomingPaymentPayload: IncomingPaymentPayload;
    OutgoingPaymentPayload: OutgoingPaymentPayload;
};

export interface IncomingPaymentPayload {
    IncomingFundTransfer: number;
    CashDeposit: number;
};

export interface OutgoingPaymentPayload {
    OutgoingFundTransfer: number;
    CashWithdraw: number;
};

export interface TransactionType {
    id: number;
    name: string;
};

export interface TransTypePayload {
    accountId: number;
    month: string;
    period: string;
    cashAmount: string;
    nonCashAmount: string;
    totalAmount: number;
    instrumentTypeName: string;
};

export interface InOutAmtTransferPayload {
    accountId: number;
    cashIncomingTransfer: number;
    cashOutgoingTransfer: number;
    nonCashIncomingTransfer: number;
    nonCashOutgoingTransfer: number;
    totalAmount: number;
    instrumentTypeName: string;
    customerId: number;
};