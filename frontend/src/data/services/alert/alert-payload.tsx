export interface AlertPayload {
    alert: string;
    scenario: string;
    amount: number;
    trans_count: number;
    acc_number: string;
    risk: string;
    remark: string;
}

export interface LevelFlowPayload {
    hitId: number;
    level_id: number;
    caseId: number;
    accountId: number;
    customerId: number;
    statusId: number;
    passingLevelId: number;
    isAlive: number;
    valid: number;
    remark: string;
    uid: string;
}