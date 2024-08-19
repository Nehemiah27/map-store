import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const post = async (url, data, config = {}) => {
  const authToken = localStorage.getItem("authToken"),
    api = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("authEmail");
      localStorage.removeItem("authID");
      if (window.location.pathname !== "/login")
        window.location.href = "/login";
    }
    console.error("POST request failed:", error);
    throw error;
  }
};
