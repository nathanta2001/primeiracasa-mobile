import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform, Vibration } from 'react-native';
import api from '../services/api';

// Chave para armazenar o token, usando SecureStore no mobile e AsyncStorage na web
const TOKEN_KEY = 'token';

// Função para salvar o token usando SecureStore no mobile e AsyncStorage na web
const saveToken = async (token: string) => {
    if (Platform.OS === 'web') {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
};

// Função para remover o token usando SecureStore no mobile e AsyncStorage na web
const removeToken = async () => {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
};

// --- HOOK DE AUTENTICAÇÃO ---
export function useAuth() {

    // Navegação
    const router = useRouter();

    // React Query Client para manipular cache
    const queryClient = useQueryClient(); 

    //login
    const login = useMutation({
        mutationFn: async (credentials: any) => {
            const res = await api.post('/login', credentials);
            return res.data;
        },
        onSuccess: async (data) => {
            await saveToken(data.token);
            Vibration.vibrate(50);
            router.replace('/(tabs)/home');
        },
    });

    const logout = async () => {

        await removeToken();

        // Limpa todo o cache do React Query para não vazar dados de um user para outro
        queryClient.clear();
        Vibration.vibrate(50);
        router.replace('/login');
    };

    // mapeia erros do server
    const getErrorMessage = (error: any) => {
        if (!error) return '';
        const status = error?.response?.status;
        if (status === 401 || status === 403) return 'E-mail ou senha incorretos.';
        return 'Não foi possível conectar ao servidor.';
    };

    return {
        entrar: login.mutate,
        sair: logout,
        isLoggingIn: login.isPending,
        erroLogin: getErrorMessage(login.error),
        resetErro: login.reset // Função útil para limpar o erro ao digitar
    };
}