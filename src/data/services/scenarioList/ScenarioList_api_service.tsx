import HttpClientWrapper from "../../api/http-client-wrapper";
import { ScenariolistPayload, ScenarioPayload } from "./Scenariolist_payload";

class ScenarioListApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    //Get Method
    private getData = async (endpoint: string) => {
        try {
            const response = await this.httpClientWrapper.get(endpoint);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getScenarioList = () => this.getData('/api/v1/scenario-lists/active');
    getTransactionType = () => this.getData('/api/v1/TransactionType');
    getProductType = () => this.getData(`/api/v1/ProductTransType`);
    getTransactionPeriod = () => this.getData(
        // '/api/v1/TransactionFrequency/active'
        '/api/v1/transactionPeriods/active'
    );
    getProductTransCategory = () => this.getData(
        // '/api/v1/TransactionFrequency/active'
        '/api/v1/ProductTransCategory'
    );
 
    getCustomerType = () => this.getData('/api/v1/CustomerType');
    getRiskLevel = () => this.getData('/api/v1/RegulatoryAMLRisk/active');
    getSegment = () => this.getData('/api/v1/Segment/active');
    getOccupationType = () => this.getData('/api/v1/OccupationType/active');
    getScenario = () => this.getData('/api/v1/ScenarioMapping1/search'
        
    );
    getCountry = () => this.getData('/api/v1/TmConfigCountry/active');
    getModeofAccount = () => this.getData('/api/v1/ModeOfAccount/active');

    getScenarioData = async (
        includeCustomerType: boolean,
        includeCustomerRisk: boolean,
        includeCustomerSegment: boolean,
        includeOccupationType: boolean,
        transactionTypeId: number | null
    ) => {
        const transactionTypeMapping: { [key: number]: string } = {
            1: "CASH",
            2: "NONCASH"
        };
        const transactionTypeName = transactionTypeId ? transactionTypeMapping[transactionTypeId] || '' : '';
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/ThresholdMappingApiService?includeCustomerType=${includeCustomerType}&includeCustomerRisk=${includeCustomerRisk}&includeCustomerSegment=${includeCustomerSegment}&includeOccupationType=${includeOccupationType}&transactionType=${transactionTypeName}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    CreateScenarioList = async (payload: ScenariolistPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ThresholdMappingApiService/saveThresholdMapping', payload);
            return response;
        } catch (error) {
            console.error("ScenarioListApiService CreateScenarioList() error:", error);
            throw error;
        }
    };

    // CreateScenario = async (payload: ScenarioPayload) => {
    //     try {
    //         const response = await this.httpClientWrapper.post('/api/v1/ScenarioMapping1/generate-all-scenario', payload);
    //         console.log("saveresponse", response)
    //         return response;
    //     } catch (error) {
    //         console.error("ScenarioListApiService CreateScenario() error:", error);
    //         throw error;
    //     }
    // };

    CreateScenario = async (payload: ScenarioPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ScenarioMapping1/create-and-update', payload);
            return response;
        } catch (error) {
            console.error("ScenarioListApiService CreateScenario() error:", error);
            throw error;
        }
    };

    scenarioDetails = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/ScenarioMapping1/fetch/${id}`,);
            return response;
        } catch (error) {
            console.error("ScenarioListApiService ScenarioDetails() error:", error);
            throw error;
        }
    };

    getValidation = async (scenarioListId: number, frequencyId: number, lookbackId: number, customerRiskId: number, customerSegmentId: number, customerTypeId: number, occupationTypeId: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/validationGet/fetchAll?scenarioListId=${scenarioListId}&frequencyId=${frequencyId}&lookbackId=${lookbackId}&customerRiskId=${customerRiskId}&customerSegmentId=${customerSegmentId}&customerTypeId=${customerTypeId}&occupationTypeId=${occupationTypeId}`);
            return response;
        } catch (error) {
            console.error('Error fetching level data:', error);
            throw error;
        }
    };

}

export default ScenarioListApiService;