import HttpClientWrapper from "../../api/http-client-wrapper";

class CaseStatusApiService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  getCaseStatus = async () => {
    try {
      const response = await this.httpClientWrapper.get('/api/v1/CaseStatus');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getuser = async () => {
    try {
      const response = await this.httpClientWrapper.get('/api/v1/users');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getNotification = async () => {
    try {
      const response = await this.httpClientWrapper.get('/api/v1/search/fetchAllSearch');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getCountry = async () => {
    try {
      const response = await this.httpClientWrapper.get('/api/v1/Country');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getLevelpending = async (id: any) => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/FirstlevelPending?id=${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getBulkTaskAssignView = async (uid: any) => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/BulkTaskAssignView/BulkTaskAssignView/{uid}?uid=${uid}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getLevelOneData = async (loginDetails: any) => {
    try {
      const levelId = loginDetails?.accessLevel;
      if (!levelId) {
        throw new Error("accessLevel not found in loginDetails");
      }
      const response = await this.httpClientWrapper.get(`/api/v1/LevelOne/levelId?levelId=${levelId}`);
      return response;
    } catch (error) {
      console.error('Error fetching level data:', error);
      throw error;
    }
  };

  getAssignedTask = async () => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/BulkTaskAssign/{isTaskAssigned}/Active`);
      return response;
    } catch (error) {
      throw error;
    }
  };

}

export default CaseStatusApiService;