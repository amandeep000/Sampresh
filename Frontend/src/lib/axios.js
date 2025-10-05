import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api/v1"
      : "https://sampresh.onrender.com/api/v1",
  withCredentials: true,
});

export default axiosInstance;
