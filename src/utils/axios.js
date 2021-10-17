import axios from "axios";
import { cloneDeep } from "lodash";
import {fetchFromStorage} from "./storage";

// const apiUrl = 'https://izsb5zbq3i.execute-api.ap-southeast-1.amazonaws.com'
const apiUrl = 'http://localhost:5001'
const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  axiosInstance.interceptors.request.use(async (config) => {
    const clonedConfig = cloneDeep(config);
    const token = fetchFromStorage("token");
  
    if (token) {
      clonedConfig.headers.common = {
        Authorization: `Bearer ${token}`,
      };
    }
  
    return clonedConfig;
  });
  
  export default axiosInstance;
  