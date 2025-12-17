import { getAxiosInstance } from "./Axios";
import { ENDPOINTS } from "./enpointConstants";

const axios = getAxiosInstance();

export const authApi = () => {

  // LOGIN
  const login = async (credentials) => {
    const response = await axios.post(ENDPOINTS.AUTH_LOGIN, credentials);
    return response.data; 
  };

  // REGISTER
  const register = async (credentials) => {
    const response = await axios.post(ENDPOINTS.AUTH_REGISTER, credentials);
    return response.data; 
  };


  return { login, register };
};
