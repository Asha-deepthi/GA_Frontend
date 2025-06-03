/*frontend/src/Test_creation/services/api.js*/
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/",  // Your backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
