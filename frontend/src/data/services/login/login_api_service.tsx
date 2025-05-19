import HttpClientWrapper from "../../api/http-client-wrapper";

class LoginApiService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  // async login(userCredentials: { email: string; password: string }): Promise<{ userId: string } | string> {
  //   try {
  //     const response = await this.httpClientWrapper.get("/api/v1/users");
  //     const users = response;
  //     const user = users.find((u: any) => u.email === userCredentials.email);
  //     if (user) {
  //       if (user.password === userCredentials.password) {
  //         return { userId: user.id };
  //       } else {
  //         return "Incorrect password!";
  //       }
  //     } else {
  //       return "Invalid emailId!";
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return "An error occurred during login";
  //   }
  // };

  // async accessPermission(uid: string): Promise<any> {
  //   try {
  //     const response = await this.httpClientWrapper.get(`/api/v1/accessPermission?uid=${uid}`);
  //     console.log("assess per:",response)
  //     return response;
   
  //   } catch (error) {
  //     console.error("Error fetching accessPermission:", error);
  //     throw error;
  //   }
  // };
  async login(userCredentials: { email: string; password: string }): Promise<{ userId: string; fullName: string, accessLevel: string } | string> {
    try {
      const response = await this.httpClientWrapper.get("/api/v1/users");
      const users = response;
      const user = users.find((u: any) => u.email === userCredentials.email);
      console.log('User found:', user); // Log user object
      if (user) {
        if (user.password === userCredentials.password) {
          console.log('Access Level:', user.accessLevel); // Log access level
          return { userId: user.id, fullName: user.fullName, accessLevel: user.accessLevel };
        } else {
          return "Incorrect password!";
        }
      } else {
        return "Invalid emailId!";
      }
    } catch (error) {
      console.error("Error:", error);
      return "An error occurred during login";
    }
  };

  async accessPermission(uid: any): Promise<any> { 
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/accessPermission?uid=${uid}`);
      console.log(" permissions:", response);  // Access response data
      return response;  // Return only the data
    } catch (error) {
      
      throw error;  // Ensure the error is propagated
    }
  }
 

}

export default LoginApiService;
