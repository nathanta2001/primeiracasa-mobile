import { ItemCard } from '@/src/components/ItemCard';
import { itemCasaService } from '@/src/services/itemCasaService';
import { ItemCasa } from '@/src/types/ItemCasa';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';

export default function ItensScreen() {

    const [itens, setItens] = useState<ItemCasa[]>([]);
    const [carregando, setCarregando] = useState(false);

    const carregarItens = async () => {
        try {

            setCarregando(true);
            const response = await itemCasaService.listarTodos();
            setItens(response);
        } catch (error) {
            console.error(error);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => { carregarItens(); }, []);

    const handleDeletar = async (id: string) => {
        try {
            await itemCasaService.deletar(id);
            carregarItens();
        } catch (error) {
            console.error("Erro ao deletar", error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={itens}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregarItens} />}
                renderItem={({ item }) => (
                    <ItemCard
                        item={item}
                        onEdit={(item) => router.push({ pathname: '/(tabs)/novoItem', params: { id: item.id } })}
                        onDelete={handleDeletar}
                    />
                )}
                contentContainerStyle={{ padding: 10 }}
            />
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => router.push('/(tabs)/novoItem')}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
