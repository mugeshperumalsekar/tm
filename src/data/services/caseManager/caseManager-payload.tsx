export interface AllPayload {
    accHolderName: string;
    accnumber: string;
    risk: string;
    amt: number;
    transCount: number;
    scenario: string;
    accountId: number;
    customerId: number;
    hitId: number;
    remark: string;
}

export interface UnAssignedPayload {
    hitId: number;
    riskId: number;
    scenarioId: number;
    accHolderName: string;
    accnumber: number;
    risk: string;
    amt: number;
    transCount: number;
    scenario: string;
    isTaskAssigned: number;
    remark: string;
}

export interface AssignedToMePayload {
    uid: number;
    userName: string;
    created_at: string;
    accHolderName: string;
    accnumber: string;
    amt: number;
    transCount: number;
    risk: string;
    scenario: string;
}

export interface CaseSearchPayload {
    sourceSystem: string;
    caseId: number;
    customerName: string;
    caseRisk: string;
    caseAlert: number;
    caseStatus: string;
}

export interface AssigneePayload {
    userName: string;
    assignerRole: string;
    accHolderName: string;
    accnumber: string;
    amt: number;
    transCount: number;
    uid: number;
    risk: string;
    scenario: string;
}

export interface PendingCasesPayload {
    id: number;
    name: string;
    display: number;
    remark: string;
    accNumber: string;
    accountId: number;
    customerId: number;
    riskId: number;
    amount: number;
    transCount: number;
    cycleId: number;
    statusNowId: number;
    valid: boolean;
    uid: number;
    scenarioDetailId: number;
    isTaskAssigned: number;
}

export interface ReportedAlertPayload {
    accHolderName: string;
    accnumber: string;
    risk: string;
    amt: number;
    transCount: number;
    scenario: string;
    customerId: number;
    accountId: number;
    hitId: number;
}

export interface CasesPayload{
    accHolderName: string;
    accnumber: string;
    risk: string;
    amt: number;
    transCount: number;
    scenario: string;
    customerId: number;
    accountId: number;
    hitId: number;
}