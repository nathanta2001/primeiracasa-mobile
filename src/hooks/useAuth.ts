import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";


export function useAuth() {

    const router = useRouter();

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        router.replace("/login");   
    };

    return {
        logout,
    };
}