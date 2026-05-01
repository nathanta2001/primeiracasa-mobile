import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

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
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                setHasToken(!!token);
            } catch (e) {
                setHasToken(false);
            } finally {
                setIsReady(true);
            }
        };
        checkAuth();
    }, []);

    // roda quando o estado muda, para redirecionar o usuário.
    useEffect(() => {
        // se a verificação ainda não está pronta, não faz nada.
        if (!isReady) return;

        // verifica se o usuário está tentando acessar uma rota protegida.
        const inAuthGroup = segments[0] === '(tabs)';
        

        if (!hasToken && inAuthGroup) {
            // Se não tem token e tentou entrar no app, vai para o login
            router.replace('/login');
        } else if (hasToken && segments[0] === 'login') {
            // Se já tem token e está na tela de login, vai para o app
            router.replace('/(tabs)/itens');
        }
    }, [hasToken, isReady, segments]);

    // carregamento.
    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // renderiza as telas de login ou home.
    return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* tela de login fora das Tabs */}
        <Stack.Screen name="login" options={{ title: 'Entrar' }} />
        
        {/* (tabs) com as telas principais */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* telas de forms ou detalhes */}
        <Stack.Screen 
          name="listas/[id]" 
          options={{ headerShown: true, title: 'Detalhes da Lista' }} 
        />
      </Stack>
    </PaperProvider>
  );
}