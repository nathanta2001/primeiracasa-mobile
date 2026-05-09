// src/app/_layout.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';

const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#c084fc',
        background: '#16171d',
        surface: '#1f2028',
        outline: '#2e303a',
    },
};

// Configura o QueryClient para React Query
const queryClient = new QueryClient();

export default function RootLayout() {

    // Verifica autenticação e redireciona conforme necessário
    const segments = useSegments();
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const inTabsGroup = segments[0] === '(tabs)';

                if (!token && inTabsGroup) {
                    router.replace('/login');
                } else if (token && segments[0] === 'login') {
                    router.replace('/(tabs)/home');
                }
            } catch (error) {
                console.error("Erro ao verificar autenticação:", error);
            } finally {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
    }, [segments]);

    // Enquanto verifica o token, não renderiza nada
    if (isCheckingAuth) return null;


    return (
        
        <QueryClientProvider client={queryClient}>
            <PaperProvider theme={theme}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />     
                    <Stack.Screen name="login" />
                    <Stack.Screen name="(tabs)" />
                </Stack>
            </PaperProvider>
        </QueryClientProvider>
    );
}