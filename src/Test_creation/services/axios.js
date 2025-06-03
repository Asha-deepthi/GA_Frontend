/*frontend/src/Test_creation/services/axios.js*/
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' });

axiosInstance.interceptors.request.use(async (config) => {
  let tokens = JSON.parse(localStorage.getItem('authTokens'));
  if (!tokens) return config;

  const user = jwtDecode(tokens.access);
  const now = Math.floor(Date.now() / 1000);

  if (user.exp < now) {
    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: tokens.refresh
      });
      tokens = {
        access: response.data.access,
        refresh: tokens.refresh
      };
      localStorage.setItem("authTokens", JSON.stringify(tokens));
    } catch (err) {
      localStorage.removeItem("authTokens");
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }

  config.headers.Authorization = `Bearer ${tokens.access}`;
  return config;
});

export default axiosInstance;
