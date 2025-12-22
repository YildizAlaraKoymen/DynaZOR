import axios from "axios";

let axiosInstance = null;

export const getAxiosInstance = () => {
  if (!axiosInstance) {
    console.warn("Axios instance not initialized, creating a new one");
    const fallbackBase = typeof window !== 'undefined' ? window.location.origin : '';
    const baseURL = import.meta.env.VITE_API_BASE_URL || fallbackBase;
    if (!import.meta.env.VITE_API_BASE_URL) {
      console.warn("VITE_API_BASE_URL not set; falling back to window.location.origin =>", baseURL);
    }
    axiosInstance = axios.create({
      baseURL,
    });
  }

  return axiosInstance;
};
