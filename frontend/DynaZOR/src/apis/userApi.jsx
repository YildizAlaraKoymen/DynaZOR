import { getAxiosInstance } from "./Axios";
import { ENDPOINTS } from "./enpointConstants";

const axios = getAxiosInstance();

export const userApi = () => {

  const getUserList = async () => {
    const response = await axios.get(ENDPOINTS.USER_LIST);
    return response.data;
  };

  const addUser = async (user) => {
    const response = await axios.post(ENDPOINTS.USER_ADD, user);
    return response.data;
  };

  return { getUserList, addUser };
};
