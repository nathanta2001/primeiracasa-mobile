import { ConfirmDeleteDialog } from '@/src/components/ConfirmDeleteDialog';
import { ItemCard } from '@/src/components/ItemCard';
import { useConfirmDelete } from '@/src/hooks/UseConfirmDelete';
import { useItem } from '@/src/hooks/useDataHooks';
import { ItemCasa } from '@/src/types/ItemCasa';
import { router } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';

export default function ItensScreen() {

    // Hooks personalizados para Itens da Casa
    const { data: itens, deletar, isFetching, refetch } = useItem();

    // Hook para confirmar deleção
    const { confirmarDelecao, dialogProps } = useConfirmDelete<ItemCasa>(
        (item) => deletar(item.id)
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={itens}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
                renderItem={({ item }) => (
                    <ItemCard
                        item={item}
                        onEdit={(item) => router.push({ pathname: '/(tabs)/novoItem', params: { id: item.id } })}
                        onDelete={() => confirmarDelecao(item)}
                    />
                )}
                contentContainerStyle={{ padding: 10 }}
            />
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => router.push({ pathname: '/(tabs)/novoItem', params: { id: 'novo' } })}
            />

            <ConfirmDeleteDialog 
                {...dialogProps} 
                titulo="Excluir Item"
                mensagem="Deseja realmente remover este item?"
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
