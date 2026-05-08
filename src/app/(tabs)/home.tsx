import { ConfirmDeleteDialog } from "@/src/components/ConfirmDeleteDialog";
import { ItemCard } from "@/src/components/ItemCard";
import { useAuth } from "@/src/hooks/useAuth";
import { useConfirmDelete } from "@/src/hooks/UseConfirmDelete";
import { useItem } from "@/src/hooks/useDataHooks";
import { ItemCasa } from "@/src/types/ItemCasa";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Text, useTheme } from "react-native-paper";


export default function HomeScreen() {

    // Hooks personalizados para Itens da Casa
    const { data: itens, deletar } = useItem();

    const theme = useTheme();

    // Hook para autenticação, utilizado para o botão de "Sair"
    const { logout } = useAuth();

    // Obtém os últimos 4 itens cadastrados, invertendo a ordem para mostrar o mais recente primeiro
    const ultimosItens: ItemCasa[] | undefined = itens?.slice(-4).reverse();

    const handleEditarItem = (item: ItemCasa) => {
        // Navega para a página de itens passando o ID no state para abrir o modal de edição
        router.navigate({ pathname: '/itens', params: { openEditModalId: item.id } });
    }

    // Hook para confirmar deleção
    const { confirmarDelecao, dialogProps } = useConfirmDelete<ItemCasa>(
        (item) => deletar(item.id)
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header com botão de Sair */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <IconButton icon="home-outline" size={30} />
                    <Text variant="headlineSmall" style={styles.whiteText}>Minha Primeira Casa</Text>
                </View>
                <IconButton
                    icon="logout"
                    iconColor="#ff4d4f" // Cor vermelha para o "Sair"
                    onPress={logout}
                />
            </View>

            {/* Estatísticas */}
            <Card style={styles.statCard}>
                <Card.Content>
                    <Text variant="titleMedium">Total de Itens</Text>
                    <View style={styles.row}>
                        <IconButton icon="cart-outline" size={20} />
                        <Text variant="displaySmall" style={styles.bold}>{itens?.length}</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Atalhos Rápidos (Fiel aos botões da Web) */}
            <View style={styles.shortcutContainer}>
                <Button
                    mode="contained"
                    icon="cart"
                    style={styles.button}
                    onPress={() => router.push('/(tabs)/itens')}
                >
                    Gerenciar Minha Casa
                </Button>
                <Button
                    mode="outlined"
                    icon="format-list-bulleted"
                    style={styles.button}
                    onPress={() => router.push('/(tabs)/listas')}
                >
                    Listas de Compras
                </Button>
            </View>

            <Text variant="titleLarge" style={styles.sectionTitle}>Últimos Itens Cadastrados</Text>

            {/* Lista de Recentes */}
            <View style={styles.recentList}>
                {ultimosItens?.map(item => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        onEdit={handleEditarItem}
                        onDelete={() => confirmarDelecao(item)}
                    />
                ))}

                <ConfirmDeleteDialog
                    {...dialogProps}
                    titulo="Excluir Item"
                    mensagem="Deseja realmente remover este item?"
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    whiteText: { fontWeight: '500' },
    statCard: { marginBottom: 24, backgroundColor: '#1f2028' },
    row: { flexDirection: 'row', alignItems: 'center' },
    bold: { fontWeight: 'bold' },
    shortcutContainer: { gap: 12, marginBottom: 32 },
    button: { borderRadius: 8, paddingVertical: 4 },
    sectionTitle: { marginBottom: 16, fontWeight: '500' },
    recentList: { paddingBottom: 40 }
});
