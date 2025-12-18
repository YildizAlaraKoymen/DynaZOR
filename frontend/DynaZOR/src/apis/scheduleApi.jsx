import { getAxiosInstance } from "./Axios";
import { ENDPOINTS } from "./enpointConstants";

const axios = getAxiosInstance();

export const scheduleApi = () => {

  const getSchedule = async (userID) => {
    const response = await axios.get(`${ENDPOINTS.SCHEDULE_GET}/${userID}`);
    return response.data;
  };

  const createSchedule = async ({ userID, scheduleDate }) => {
    const date = scheduleDate || new Date().toISOString().split('T')[0];
    const response = await axios.post(`${ENDPOINTS.SCHEDULE_CREATE}/${userID}`, { scheduleDate: date });
    return response.data;
  }

  return { getSchedule, createSchedule };
};
