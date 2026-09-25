// import axios from "axios";

// const API = axios.create({
//   baseURL: "/api",
//   withCredentials: true,
// });

// export const loginUser = (data) => {
//   return API.post("/auth/login/", data);
// };

// export const registerUser = (data) => {
//   return API.post("/auth/register/", data);
// };

// export const logoutUser = () => {
//   return API.post("/auth/logout/");
// };

// export const getCurrentUser = () => {
//   return API.get("/auth/me/");
// };

import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,

  // Django CSRF configuration
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

export const loginUser = (data) => {
  return API.post("/auth/login/", data);
};

export const registerUser = (data) => {
  return API.post("/auth/register/", data);
};

export const logoutUser = () => {
  return API.post("/auth/logout/");
};

export const getCurrentUser = () => {
  return API.get("/auth/me/");
};