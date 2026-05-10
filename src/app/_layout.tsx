// src/app/_layout.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 1 minuto
            staleTime: 1000 * 60 * 1,
            // Mantém dados inativos no cache por 10 minutos
            gcTime: 1000 * 60 * 10,
            // refaz a busca ao focar na janela
            refetchOnWindowFocus: false,
        },
    },
});

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: 'PRIMEIRA_CASA_OFFLINE_CACHE',
});

onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
        setOnline(!!state.isConnected);
    });
});

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

        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
            onSuccess={() => {
                console.log("Persistência offline carregada");
            }}
        >
            <PaperProvider theme={theme}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="login" />
                    <Stack.Screen name="(tabs)" />
                </Stack>
            </PaperProvider>
        </PersistQueryClientProvider>
    );
}