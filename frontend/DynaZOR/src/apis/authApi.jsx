import { getAxiosInstance } from "./Axios";
import { ENDPOINTS } from "./enpointConstants";

const axios = getAxiosInstance();

export const authApi = () => {

  // LOGIN
  const login = async (credentials) => {
    // credentials = { email, password } 
    const response = await axios.post(ENDPOINTS.AUTH_LOGIN, credentials);
    return response.data; // return token + user data
  };

  return { login };
};
