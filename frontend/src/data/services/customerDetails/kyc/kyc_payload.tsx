export interface KycPayload {
    basicDetailsData: BasicDetailsData;
    occupationDetailsData: OccupationDetailsData;
    riskAndOtherDetailsData: RiskAndOtherDetailsData;
}

export interface BasicDetailsData {
    customer_id: number;
    commencementDate: string | null;
    companyRegistrationCountry: string | null;
    industry: string;
    countryOfOperation: string | null;
    exactIncome: string;
    aadhaar: number;
    countryOfBirth: string;
    exactNetworth: string;
    companyRegistrationNumber: string | null;
    listed: boolean | null;
    incomeRange: string;
}

export interface OccupationDetailsData {
    customer_id: number;
    occupationType: string;
    employerName: string;
    currentEmploymentInYears: number;
    educationalQualification: string | null;
}

export interface RiskAndOtherDetailsData {
    customer_id: number | null;
    adverseMedia: number;
    regAmlSpecialCategory: string;
    customerStatus: string;
    adverseMediaClassification: number;
    regulatoryAmlRisk: string;
    pep: string;
}