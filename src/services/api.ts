import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Função para determinar a URL base da API dependendo do ambiente (web, Android, iOS)
const getBaseURL = () => {

  // Para web: localhost diretamente
  if (Platform.OS === "web") return "http://localhost:8080/api";

  // Expo Go no dispositivo físico expõe o IP da máquina em Constants
  const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];

  // Para Android e iOS: diferencia entre emulador/simulador e dispositivo físico
  if (Platform.OS === "android") {
    return expoHost
      ? `http://${expoHost}:8080/api`   // dispositivo físico
      : "http://10.0.2.2:8080/api";     // emulador Android
  }

  if (Platform.OS === "ios") {
    return expoHost
      ? `http://${expoHost}:8080/api`   // dispositivo físico
      : "http://localhost:8080/api";    // simulador iOS
  }

  return "http://localhost:8080/api";
};

const api = axios.create({ baseURL: getBaseURL() });

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.error("Erro ao recuperar token:", error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      await AsyncStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;