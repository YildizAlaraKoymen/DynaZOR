import { getAxiosInstance } from "./Axios";
import { ENDPOINTS } from "./enpointConstants";

const axios = getAxiosInstance();

export const userApi = () => {

  const getUserList = async () => {
    const response = await axios.get(ENDPOINTS.USER_LIST);
    return response.data;
  };

  return { getUserList };
};
