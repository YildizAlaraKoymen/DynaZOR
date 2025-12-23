import { getAxiosInstance } from "./Axios";
import { ENDPOINTS } from "./enpointConstants";

const axios = getAxiosInstance();

export const adminApi = () => {

  const authenticate = async (password) => {
      const response = await axios.post(ENDPOINTS.ADMIN_AUTH, { password });
      return response.data;
    };

  const initDB = async (password) => {
      const response = await axios.post(ENDPOINTS.ADMIN_INIT, { password });
      return response.data;
    };

  const resetDB = async (password) => {
      const response = await axios.post(ENDPOINTS.ADMIN_RESET, { password });
      return response.data;
    };

  const viewDB = async (password) => {
      const response = await axios.post(ENDPOINTS.ADMIN_VIEW, { password });
      return response.data;
    };

  const backupDB = async (password) => {
      const response = await axios.post(ENDPOINTS.ADMIN_BACKUP, { password });
      return response.data;
    };

  const modifyDB = async (password, action, userID, name, username, email) => {
      const response = await axios.post(ENDPOINTS.ADMIN_MODIFY, { password, action, userID, name, username, email });
      return response.data;
    };

  return { authenticate, initDB, resetDB, viewDB, backupDB, modifyDB };
};