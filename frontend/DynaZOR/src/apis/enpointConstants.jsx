const BASE_ENDPOINT = {
  USERS: "/api/user",
  SCHEDULES: "/api/schedule",
  AUTH: "/api/auth"
  // Add other endpoints here
};

export const ENDPOINTS = {
  USER_LIST: `${BASE_ENDPOINT.USERS}/list`,
  USER_ADD: `${BASE_ENDPOINT.USERS}/add`,
  SCHEDULE_LIST: `${BASE_ENDPOINT.SCHEDULES}/list`,
  SCHEDULE_ADD: `${BASE_ENDPOINT.SCHEDULES}/add`,
  AUTH_LOGIN: `${BASE_ENDPOINT.AUTH}/login`,
  // Add other specific endpoints here
};
