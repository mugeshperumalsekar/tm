export interface HitdatalifecyclePayload {
    searchId: string;
    hitId: string;
    accountId: string;
    caseId: string;
    levelId: string;
    statusId: string;
    uid: string;
    remark: string;
  }

  export interface HitcasePayload {
    display: string;
    searchId: string;
    hitId: string;
    accountId: string;
    levelId: string;
    statusNowId: string;
    cycleId: string;
    uid: string;
    remark: string;
  };

  // export interface HitrecordlifecyclePayload {
  //   search_id: number,
  //   hitdata_id: number,
  //   level_id: number,
  //   case_id: number,
  //   criminal_id: number,
  //   statusId: number,
  //   passingLevelId: number,
  //   isAlive: number,
  //   valid: number,
  //   remark: string,
  //   statusNowId:number
  // }
  
  export interface HitrecordlifecyclePayload {
   
    hitId: number,
    level_id: number,
    caseId: number,
    accountId: number,
    customerId: number,
    statusId: number,
    passingLevelId: number,
    isAlive: number,
    valid: number,
    remark: string,
    uid:string
  }
  // export interface RecordDTO {
  //   ids: number;
  //   searchId: string;
  //   hitId: string;
  //   accountId: string;
  //   name: string;
  //   address: string;
  //   entityType: string;
  //   program: string;
  //   list: string;
  //   score: number;
  //   fileType: number;
  //   fileList: string;
  //   nationality: string;
  //   citizenship: string;
  //   passport: string;
  //   Country: string;
  //   accountNumber: string;
  // };
  export interface RecordDTO {
    alertbranch_id:number;
    hitId: number,
    level_id: number,
    caseId: number,
    accountId: number,
    customerId: number,
    statusId: number,
    passingLevelId: number,
    isAlive: number,
    valid: number,
    remark: string,
    uid:string
  };

  export interface SearchDTO {
    name: string;
    matching_score: number;
    listID: number;
    partySubTypeID: number;
    countryId: number;
    uid: number;
    isBulkSearch: number;
    // accountNum:string;
  
  };
  export interface PindingcasesPayload {
    caseId: string;
    accountId: string;
    hitId: string;
    levelId: string;
    searchId: string;
    statusId: string;
    matchingScore: string;
    remark: string; // Include the remarks property
    uid:string;
    criminalName:string;
  }
  