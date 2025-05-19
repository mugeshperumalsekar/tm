export interface ScenariolistPayload {
  transactionType: string;
  scenarioListId: number;
  riskLevel: string;
  occupationType: string;
  segmentType: string;
  customerType: string;
  period: string;
  amount: number[];
  noOfTransaction: number[];
  percentageValue: number[];
  transaction_period_id: number;
}

// export interface ScenarioPayload {
//   id:number;
//   scenarioListId: number;
//   productTypeId: number;
//   transactionTypeId: number;
//   frequencyId: number;
//   lookbackId: number;
//   minAmt: number;
//   maxAmt: number;
//   minPercentage: number;
//   maxPercentage: number;
//   minTransCount: number;
//   maxTransCount: number;
//   customerTypeIds: number[];
//   customerSegmentIds: number[];
//   customerRiskIds: number[];
//   occupationTypeIds: number[];
//   countryIds: number[];
//   modeOfTransIds: number[];

// }
export interface ScenarioPayload {
  scenarioListId: number;
  productTypeId: number;
  transactionTypeId: number;
  frequencyIds: number[];
  lookbackIds: number[];
  minAmt: number;
  maxAmt: number;
  minPercentage: number;
  maxPercentage: number;
  minTransCount: number;
  maxTransCount: number;
  customerTypeIds: number[];
  customerSegmentIds: number[];
  customerRiskIds: number[];
  occupationTypeIds: number[];
  countryIds: number[];
  modeOfTransIds: number[];
  extra1Ids: number[];
  extra2Ids: number[];
}

export interface ScenarioMappingDetailData {
  id: number;
  uid: number;
  euid: number;
  customerTypeId: number;
  customerTypeName: string;
  customerSegmentId: number;
  customerSegmentName: string;
  occupationTypeId: number;
  occupationTypeName: string;
  customerRiskId: number;
  customerRiskName: string;
  scenarioMappingId: number;
  scenarioMappingName: string;
}

export interface FetchScenarioPayload {
  id: number;
  scenarioListId: number;
  scenarioConditionId: number;
  productTypeId: number;
  transTypeId: number;
  frequencyId: number;
  frequencyName: string;
  lookbackName: string;
  lookbackId: number;
  minAmt: number;
  maxAmt: number;
  minPercentage: number;
  maxPercentage: number;
  minTransCount: number;
  maxTransCount: number;
  productTransTypeName: String;
  productTypeName: String;
  scenarioListName: string;
  scenarioMappingDetailDataList: ScenarioMappingDetailData[];
}

export interface ScenarioSearch {
  id: number;
  scenario: string;
  productTypeName: string;
  frequencyName: string;
  lookbackName: string;
  sceCode: string;
  minAmt: number;
  maxAmt: number;
  minPercentage: number;
  maxPercentage: number;
  minTransCount: number;
  maxTransCount: number;
  scenarioCode:string;
}