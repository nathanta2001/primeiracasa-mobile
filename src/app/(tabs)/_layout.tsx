import { Tabs } from 'expo-router';
import { Home, List, Package } from 'lucide-react-native';

// layout para as abas, usa o componente Tabs do Expo Router
export default function TabLayout() {
    return (
        // configura as opções das abas, como título e ícone.
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#7C3AED', // Roxo do seu front web
            headerStyle: { backgroundColor: '#7C3AED' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
        }}>
            // define a aba "home" com o ícone de casa.
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Minha Primeira Casa',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            // define a aba "itens" com o ícone de pacote.
            <Tabs.Screen
                name="itens"
                options={{
                    title: 'Itens',
                    tabBarIcon: ({ color }) => <Package size={24} color={color} />,
                }}
            />
            // define a aba "listas" com o ícone de lista.
            <Tabs.Screen
                name="listas"
                options={{
                    title: 'Minhas Listas',
                    tabBarIcon: ({ color }) => <List size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}