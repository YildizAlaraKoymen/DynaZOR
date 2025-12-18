const BASE_URL = "http://localhost:5555";
const BASE_ENDPOINT = {
  USERS: "/api/user",
  SCHEDULES: "/api/schedule",
  AUTH: "/api/auth",
};

export const ENDPOINTS = {
  SCHEDULE_GET: `${BASE_URL}${BASE_ENDPOINT.SCHEDULES}`,
  SCHEDULE_CREATE: `${BASE_URL}${BASE_ENDPOINT.SCHEDULES}`,
  AUTH_LOGIN: `${BASE_URL}${BASE_ENDPOINT.AUTH}/login`,
  AUTH_REGISTER: `${BASE_URL}${BASE_ENDPOINT.AUTH}/register`,
};
