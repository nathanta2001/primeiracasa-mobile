import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

// instância do Axios com a URL base
const getBaseURL = () => {
  if (Platform.OS === "android") return "http://10.0.2.2:8080/api";
  if (Platform.OS === "ios") return "http://192.168.1.5:8080/api";
  return "http://localhost:8080/api"; // web (desktop)
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// para adicionar o Token
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  catch (error) {
    console.error('Error ao recuperar token:', error);
  }
  return config;
});

// para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      await AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;