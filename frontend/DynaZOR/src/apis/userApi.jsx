import { getAxiosInstance } from "./Axios";
import { ENDPOINTS } from "./enpointConstants";

const axios = getAxiosInstance();

export const userApi = () => {

  const getSchedule = async (userID) => {
      const response = await axios.get(`${ENDPOINTS.SCHEDULE_GET}/${userID}`);
      return response.data;
    };
  
  const createSchedule = async ({ userID, scheduleDate }) => {
      const date = scheduleDate || new Date().toISOString().split('T')[0];
      const response = await axios.post(`${ENDPOINTS.SCHEDULE_CREATE}/${userID}`, { scheduleDate: date });
      return response.data;
    }

  const getUserByUsername = async (username) => {
      const response = await axios.get(`${ENDPOINTS.USER_ID_BY_USERNAME_GET}/${username}`);
      return response.data;
    };

  const toggleTimeslot = async (userID, date, hour, minute) => {
      const response = await axios.post(`${ENDPOINTS.TIMESLOT_TOGGLE}/${userID}`, { date, hour, minute });
      return response.data;
    };

  const submitAppointment = async (userID, payload) => {
      const response = await axios.post(`${ENDPOINTS.APPOINTMENT_SUBMIT}/${userID}`, payload);
      return response.data;
    };
  
  const getUser = async (userID) => {
      const response = await axios.get(`${ENDPOINTS.USER_GET}/${userID}`);
      return response.data;
  }

  return { getSchedule, createSchedule, getUserByUsername, toggleTimeslot, submitAppointment, getUser };
};
