import { getAxiosInstance } from "./Axios";
import { ENDPOINTS } from "./enpointConstants";

const axios = getAxiosInstance();

export const scheduleApi = () => {

  const getScheduleList = async () => {
    const response = await axios.get(ENDPOINTS.SCHEDULE_LIST);
    return response.data;
  };

  const addSchedule = async (user) => {
    const response = await axios.post(ENDPOINTS.SCHEDULE_ADD, user);
    return response.data;
  };

  return { getScheduleList, addSchedule };
};
