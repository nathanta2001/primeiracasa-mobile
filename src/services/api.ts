import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// instância do Axios com a URL base
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
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