import HttpClientWrapper from "../../api/http-client-wrapper";
import { Configparamenter ,Configparamentertype} from "./configparameter_payload";

class ConfigparamenterApiService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  getScenarioList = async () => {
    try {
      const response = await this.httpClientWrapper.get('/api/v1/scenario-lists/active');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getScenarioParamMapping = async () => {
    try {
      const response = await this.httpClientWrapper.get('/api/v1/ScenarioParamMapping/fetchAllScenarioParamMapping');
      return response;
    } catch (error) {
      throw error;
    }
  };
  getType= async () => {
    try {
      const response = await this.httpClientWrapper.get('/api/v1/Type2');
      return response;
    } catch (error) {
      throw error;
    }
  };


  CreateScenaParamMapping = async (payload: Configparamentertype[]) => {
    try {
      const response = await this.httpClientWrapper.post('/api/v1/ScenarioParamMapping/CreateScenarioParamMapping', payload);
      return response;
    } catch (error) {
      console.error(`Error fetching the createScenarioParamMapping:`, error);
      throw error;
    }
  };
  getExistingMapping = async (scenarioListId: any, transtypeIds: any[]) => { 
    try {
      // Use URLSearchParams to correctly build the query string for transtypeIds
      const queryParams = new URLSearchParams();
      transtypeIds.forEach((id: number) => {
        queryParams.append('transtypeIds', id.toString());
      });
  
      const response = await this.httpClientWrapper.get(`/api/v1/ScenarioParamMapping/${scenarioListId}/transtypeIds?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching the getExistingMapping:', error);
      throw error;
    }
  };
  
   CreateandUpdateScenarioParamMapping = async (setScenarioListId: number, setTranstypeId: number[], payload: Configparamentertype[]) => {
    try {
        const formattedPayload = payload.map(item => ({
            ...item,
            scenario_list_id: setScenarioListId,
            transtypeIds: setTranstypeId
        }));

        // Assuming this.httpClientWrapper is a wrapper around axios or fetch
        const response = await this.httpClientWrapper.put(
            '/api/v1/ScenarioParamMapping', 
            formattedPayload
        );

        return response.data;  // Or adjust as per the actual response structure
    } catch (error) {
        console.error('Error updating ScenarioParamMapping:', error);
        throw error;
    }
};




  
  CreateScenarioParamMapping = async (payload: Configparamenter[]) => {
    try {
      const response = await this.httpClientWrapper.post('/api/v1/ScenarioParamMapping/CreateScenarioParamMapping', payload);
      return response;
    } catch (error) {
      console.error(`Error fetching the createScenarioParamMapping:`, error);
      throw error;
    }
  };

}

export default ConfigparamenterApiService;