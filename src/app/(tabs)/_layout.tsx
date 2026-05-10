// src/app/(tabs)/_layout.tsx
import { OfflineBanner } from '@/src/components/OfflineBanner';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function TabLayout() {


    return (
        <View style={{ flex: 1 }}>
            <OfflineBanner />

            <Tabs screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: '#1f2028', borderTopColor: '#2e303a' },
                tabBarActiveTintColor: '#c084fc',
            }}>

                {/* Abas que vão aparecer no menu inferior */}
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <IconButton icon="home" iconColor={color} size={20} />
                    }}
                />
                <Tabs.Screen
                    name="itens"
                    options={{
                        title: 'Minha Casa',
                        tabBarIcon: ({ color }) => <IconButton icon="store" iconColor={color} size={20} />
                    }}
                />
                <Tabs.Screen
                    name="listas"
                    options={{
                        title: 'Listas',
                        tabBarIcon: ({ color }) => <IconButton icon="format-list-bulleted" iconColor={color} size={20} />
                    }}
                />

                {/* Abas que não aparecem no menu inferior, mas são acessíveis via navegação */}

                <Tabs.Screen
                    name="itens-detalhe"
                    options={{
                        href: null, // esconde a aba!
                    }}
                />

                <Tabs.Screen
                    name="lista-detalhe"
                    options={{
                        href: null, // esconde a aba!
                        title: 'Detalhes da Lista',
                    }}
                />
            </Tabs >
        </View>
    );
}