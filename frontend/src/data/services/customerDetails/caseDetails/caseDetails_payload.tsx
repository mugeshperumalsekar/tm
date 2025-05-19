export interface CaseDetailsPayload {
    riskReviewCases: RiskReviewCase[];
    transactionMonitoringCases: TransactionMonitoringCases[];
    screeningCases: ScreeningCases[];
}

export interface RiskReviewCase {
    caseId: string;
    risk: string;
    stepCategory: string;
    reviewType: string;
    finalDecision: string;
    reviewDate: string;
}

export interface TransactionMonitoringCases {
    alert: number;
    statusNw: string;
    editedOn: string;
    caseId: number;
    stepCategory: string;
}

export interface ScreeningCases {
    alert: number;
    statusNw: string;
    editedOn: string;
    caseId: number;
    stepCategory: string;
    caseType: string;
}