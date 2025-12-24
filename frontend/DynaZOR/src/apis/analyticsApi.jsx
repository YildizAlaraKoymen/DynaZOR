import { getAxiosInstance } from "./Axios";
import { ENDPOINTS } from "./enpointConstants";

const axios = getAxiosInstance();

export const analyticsApi = () => {

  const getAnalytics = async (userID) => {
      const response = await axios.get(`${ENDPOINTS.ANALYTICS}/${userID}`);
      return response.data;
    };

  return { getAnalytics };
};