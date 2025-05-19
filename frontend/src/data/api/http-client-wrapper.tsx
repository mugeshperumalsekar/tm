import ApiConfig from "./api-config";
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from 'react-toastify';
import StorageService from "../storage/storage-service";
import { buffer } from "stream/consumers";

class HttpClientWrapper {

  private axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = new ApiConfig().getAxiosInstance();
  }

  public post = async (path: string, payload: any) => {
    console.log("HttpClientWrapper post() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient.post(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper post() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper post() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper post() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public get = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public getId = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public gets = async (path: string, config?: AxiosRequestConfig) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      const mergedConfig = { ...this.getJsonHeaderConfig(), ...config };
      let response: any = await this.axiosClient.get(path, mergedConfig);
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public put = async (path: string, payload?: any) => {
    console.log("HttpClientWrapper put() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient.put(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper put() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper put() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper put() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public delete = async (path: string, payload?: any) => {
    console.log("HttpClientWrapper put() start path = '" + path + "");
    try {
      let response: any = await this.axiosClient.delete(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper delete() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper delete() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper delete() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  postFormData = async (url: string, data: FormData) => {
    try {
      const response = await this.axiosClient.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error in postFormData:", error);
      if (error.response) {
        console.error("Error Response:", error.response);
        throw error.response.data;
      } else if (error.request) {
        console.error("No response from server:", error.request);
        throw new Error('No response from server.');
      } else {
        console.error("Request failed:", error.message);
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  };

  public putFormData = async (path: string, formData: FormData) => {
    console.log("HttpClientWrapper post() start path = '" + path + "'");
    try {
      let response: any = await this.axiosClient.put(path, formData, this.getFormDataHeaderConfig());
      console.log("HttpClientWrapper post() end path = '" + path + "'");
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper post() error=== " + JSON.stringify(err));
      toast.error(err.response.data.message, { containerId: 'TR' });
      throw err;
    }
  };

  public pute = async (url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return await this.axiosClient.put(url, data, config);
  };

  async gete(url: string, config: any): Promise<any> {
    try {
      const response = await this.axiosClient.get(url, config);
      return response;
    } catch (error) {
      throw new Error('Request failed');
    }
  };

  getFormDataHeaderConfig = () => {
    return this.getHeaderConfig('multipart/form-data');
  };

  getHeaderConfig = (contentType: string) => {
    let headers: any = {};
    headers['Content-Type'] = contentType;
    let token = StorageService.getToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }
    return { headers: headers }
  };

  getJsonHeaderConfig = () => {
    return this.getHeaderConfig('application/json');
  };

  public getLocalImage = async (url: string, config = {}): Promise<ArrayBuffer> => {
    const response = await this.axiosClient.get(url, {
      ...config,
      responseType: 'arraybuffer',
    });
    return response.data;
  };

  getLocalPDF = async (path: string) => {
    console.log("HttpClientWrapper getLocalPDF() start path =", path);
    try {
      const response: any = await this.axiosClient.get(path, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
      if (response && response.data) {
        const base64Pdf = this.arrayBufferToBase64(response.data);
        console.log("PDF Data:", base64Pdf);
        return base64Pdf;
      } else {
        console.error("PDF Data is empty.");
        throw new Error("Empty PDF Data");
      }
    } catch (err: any) {
      console.error("HttpClientWrapper getLocalPDF() error:", err);
      throw err;
    }
  };

  arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const binary = new Uint8Array(buffer);
    const bytes = new Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = String.fromCharCode(binary[i]);
    }
    return btoa(bytes.join(''));
  };

}

export default HttpClientWrapper;