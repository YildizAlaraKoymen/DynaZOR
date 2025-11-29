import axios from "axios";

let axiosInstance = null;

export const getAxiosInstance = () => {
  if (!axiosInstance) {
    console.warn("Axios instance not initialized, creating a new one");
    axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
    });
  }

  return axiosInstance;
};
