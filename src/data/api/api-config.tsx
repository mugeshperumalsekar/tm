import axios, { AxiosInstance } from "axios";

class ApiConfig {

    // private baseURL = 'http://61.2.136.192:8090';
    private baseURL = 'http://192.168.0.171:9001';
    // private baseURL = 'http://localhost:9002';
    //  private baseURL = 'http://192.168.0.110:9002';
    // private baseURL = 'http://61.2.136.192:9001';
    // private baseURL = 'http://192.168.0.126:9001'; 
    // private baseURL = 'http://192.168.0.171:9001';
    // private baseURL = 'http://192.168.1.35:9001';

    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = this.baseURL;
    }

    private getApiBaseURL = () => {
        return this.apiBaseUrl;
    }

    public getAxiosInstance = () => {
        return axios.create({
            baseURL: this.getApiBaseURL()
        });
    }

}

export default ApiConfig;