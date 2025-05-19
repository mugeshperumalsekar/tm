export interface TaskAssignBulkPayload {
  assignTo: number;
  assignBy: number;
  riskId: number;
  transCount: number;
  accHolderName: string;
  accountNumber: string;
  amount: number;
  hitId: number;
  isTaskAssigned: number;
  euid: number;
  uid: number;
  scenarioId: number;
};