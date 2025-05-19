import HttpClientWrapper from "../../api/http-client-wrapper";

class ExcelFileUploadApiService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  saveExcelFile = async (files: File[], pathId: number[], date: string) => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('files', file);
        if (pathId[index]) {
          formData.append('pathId', String(pathId[index]));
        }
      });
      formData.append('date', date);
      const response = await this.httpClientWrapper.postFormData('/api/v1/FileUpload/upload', formData);
      return response;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  fetchExcelFile = async (pathId: number) => {
    try {
      const response = await this.httpClientWrapper.getId(`/api/v1/FileUpload/getDocument/${pathId}`);
      return response;
    } catch (error) {
      console.error("AddressApiService getLocalImage() error:", error);
      throw error;
    }
  };

  getDocumentType = async (imgId: number, pathId: number): Promise<ArrayBuffer> => {
    try {
      const response = await this.httpClientWrapper.getLocalImage(`/api/v1/FileUpload/downloadFile/${imgId}/${pathId}`, {
        responseType: 'arraybuffer',
      });
      return response;
    } catch (error) {
      console.error("AddressApiService getDocumentType() error:", error);
      throw error;
    }
  };

}

export default ExcelFileUploadApiService;