import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

// layout responsável por verificar se o usuário tem um token de autenticação
// e redirecionar para as telas apropriadas (login ou home).
export default function RootLayout() {

    // estados que controlam a verificação do token, se esta pronta e se o token existe.
    const [isReady, setIsReady] = useState(false);
    // estado para armazenar se o token existe ou não.
    const [hasToken, setHasToken] = useState(false);
    // hooks do expo-router para acessar os segmentos da rota e o roteador.
    const segments = useSegments();
    // hook para acessar o roteador e realizar redirecionamentos.
    const router = useRouter();

    // verifica o token no AsyncStorage quando o componente é montado.
    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            setHasToken(!!token);
            setIsReady(true);
        };
        checkToken();
    }, []);

    // roda quando o estado muda, para redirecionar o usuário.
    useEffect(() => {
        if (!isReady) return;

        const inAuthGroup = segments[0] === 'login';

        if (!hasToken && !inAuthGroup) {
            // Se não tem token e não está nas telas de login, vai para o login
            router.replace('/login');
        } else if (hasToken && inAuthGroup) {
            // Se tem token e está no login, vai para a Home
            router.replace('./(tabs)');
        }
    }, [hasToken, isReady, segments]);

    // indicador de carregamento.
    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // renderiza as telas de login ou home.
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ title: 'Entrar' }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}