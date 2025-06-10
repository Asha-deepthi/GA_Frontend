import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Update this URL if your backend runs on a different port or path
});

export const createTest = (testData) => API.post("/tests", testData);
