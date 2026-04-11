import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ItemCard } from '../../components/ItemCard';
import { itemCasaService } from '../../services/itemCasaService';
import { ItemCasa } from '../../types/ItemCasa';

// Lista os itens cadastrados
export default function ItensScreen() {

    // Estado para armazenar os itens
    const [itens, setItens] = useState<ItemCasa[]>([]);
    // Estado para controle de carregamento
    const [loading, setLoading] = useState(true);
    // Estado para controle de refresh
    const [refreshing, setRefreshing] = useState(false);

    // busca os itens do serviço
    const fetchItens = async () => {
        try {
            // Chama o serviço para listar os itens
            const data = await itemCasaService.listarTodos();
            setItens(data);
        } catch (error) {
            console.error("Erro ao carregar itens", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Carrega os itens ao montar o componente
    useEffect(() => {
        fetchItens();
    }, []);

    // atualiza a lista de itens
    const onRefresh = () => {
        setRefreshing(true);
        fetchItens();
    };

    // indicador de carregamento.
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        // Lista os itens usando FlatList
        <View style={styles.container}>
            <FlatList
                data={itens}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ItemCard item={item} onPress={() => {/* Navegar para detalhe */ }} />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 16 }
});