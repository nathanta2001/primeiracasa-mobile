import { ConfirmDeleteDialog } from "@/src/components/ConfirmDeleteDialog";
import { ItemCard } from "@/src/components/ItemCard";
import { useAuth } from "@/src/hooks/useAuth";
import { useConfirmDelete } from "@/src/hooks/UseConfirmDelete";
import { useItem } from "@/src/hooks/useDataHooks";
import { ItemCasa } from "@/src/types/ItemCasa";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, IconButton, Surface, Text } from "react-native-paper";

const CORES = {
    fundo: '#16171d',
    surface: '#1f2028',
    borda: '#2e303a',
    roxo: '#c084fc',
    roxoSuave: 'rgba(192, 132, 252, 0.10)',
    texto: '#e2e8f0',
    textoSuave: '#94a3b8',
};

const COR_NECESSIDADE: Record<string, string> = {
    ESSENCIAL: '#4ade80',
    IMPORTANTE: '#facc15',
    DESEJAVEL: '#60a5fa',
};

export default function HomeScreen() {

    const { data: itens, deletar } = useItem();
    const { sair } = useAuth();

    const ultimosItens: ItemCasa[] | undefined = itens?.slice(-4).reverse();

    // Cálculos para o painel de stats
    const totalItens = itens?.length ?? 0;
    const totalValor = itens?.reduce((acc, i) => acc + (i.preco ?? 0), 0) ?? 0;
    const essenciais = itens?.filter(i => i.necessidade === 'ESSENCIAL').length ?? 0;
    const porComodo = itens?.reduce<Record<string, number>>((acc, i) => {
        acc[i.comodo] = (acc[i.comodo] ?? 0) + 1;
        return acc;
    }, {}) ?? {};
    const comodoDestaque = Object.entries(porComodo).sort((a, b) => b[1] - a[1])[0];

    const { confirmarDelecao, dialogProps } = useConfirmDelete<ItemCasa>(
        (item) => deletar(item.id)
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            {/* Header */}
            <Surface style={styles.header} elevation={2}>
                <View style={styles.headerRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerLabel}>Bem-vindo</Text>
                        <Text style={styles.headerTitulo}>Minha Primeira Casa</Text>
                    </View>
                    <IconButton
                        icon="logout"
                        iconColor="#f87171"
                        size={22}
                        onPress={sair}
                        style={styles.logoutBtn}
                    />
                </View>
            </Surface>

            {/* Painel de Stats */}
            <View style={styles.statsGrid}>

                <Surface style={styles.statCardDestaque} elevation={1}>
                    <Text style={styles.statLabelDestaque}>Investimento Total</Text>
                    <Text style={styles.statValorDestaque}>
                        R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                    <Text style={styles.statSubDestaque}>somado de todos os itens cadastrados</Text>
                </Surface>

                <View style={styles.statsRow}>
                    <Surface style={styles.statBadge} elevation={1}>
                        <Text style={styles.statNum}>{totalItens}</Text>
                        <Text style={styles.statLabel}>itens</Text>
                    </Surface>
                    <Surface style={[styles.statBadge, { borderColor: COR_NECESSIDADE.ESSENCIAL + '44' }]} elevation={1}>
                        <Text style={[styles.statNum, { color: COR_NECESSIDADE.ESSENCIAL }]}>{essenciais}</Text>
                        <Text style={styles.statLabel}>essenciais</Text>
                    </Surface>
                    <Surface style={styles.statBadge} elevation={1}>
                        <Text style={[styles.statNum, { fontSize: 14 }]}>
                            {comodoDestaque ? comodoDestaque[0].replace(/_/g, ' ') : '—'}
                        </Text>
                        <Text style={styles.statLabel}>cômodo +itens</Text>
                    </Surface>
                </View>
            </View>

            {/* Atalhos */}
            <View style={styles.atalhos}>
                <Text style={styles.secaoTitulo}>Acesso Rápido</Text>
                <View style={styles.atalhosRow}>
                    <Button
                        mode="contained"
                        icon="home-variant-outline"
                        style={styles.atalhoBtn}
                        buttonColor={CORES.roxo}
                        onPress={() => router.push('/(tabs)/itens')}
                    >
                        Minha Casa
                    </Button>
                    <Button
                        mode="outlined"
                        icon="format-list-bulleted"
                        style={styles.atalhoBtn}
                        textColor={CORES.roxo}
                        onPress={() => router.push('/(tabs)/listas')}
                    >
                        Listas
                    </Button>
                </View>
            </View>

            {/* Últimos Itens */}
            <View style={styles.recentes}>
                <View style={styles.recentesHeader}>
                    <Text style={styles.secaoTitulo}>Últimos Cadastrados</Text>
                    <Button
                        compact
                        textColor={CORES.roxo}
                        onPress={() => router.push('/(tabs)/itens')}
                    >
                        Ver todos
                    </Button>
                </View>

                {ultimosItens?.length === 0 && (
                    <Text style={styles.vazio}>Nenhum item cadastrado ainda.</Text>
                )}

                {ultimosItens?.map(item => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        onEdit={(i) => router.push({ pathname: '/(tabs)/itens-detalhe', params: { id: i.id } })}
                        onDelete={() => confirmarDelecao(item)}
                    />
                ))}
            </View>

            <ConfirmDeleteDialog
                {...dialogProps}
                titulo="Excluir Item"
                mensagem="Deseja realmente remover este item da sua casa?"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    content: { paddingBottom: 40 },

    // Header
    header: {
        backgroundColor: CORES.surface,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: CORES.borda,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    headerLabel: { color: CORES.roxo, fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
    headerTitulo: { color: CORES.texto, fontSize: 22, fontWeight: '800', marginTop: 2 },
    logoutBtn: { margin: 0 },

    // Stats
    statsGrid: { paddingHorizontal: 14, paddingTop: 16, gap: 10 },
    statCardDestaque: {
        backgroundColor: CORES.surface,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: CORES.roxo + '44',
    },
    statLabelDestaque: { color: CORES.roxo, fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
    statValorDestaque: { color: CORES.texto, fontSize: 30, fontWeight: '800', marginTop: 4 },
    statSubDestaque: { color: CORES.textoSuave, fontSize: 11, marginTop: 4 },

    statsRow: { flexDirection: 'row', gap: 10 },
    statBadge: {
        flex: 1,
        backgroundColor: CORES.surface,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: CORES.borda,
    },
    statNum: { color: CORES.roxo, fontSize: 22, fontWeight: '800' },
    statLabel: { color: CORES.textoSuave, fontSize: 10, marginTop: 2, textAlign: 'center' },

    // Atalhos
    atalhos: { paddingHorizontal: 14, marginTop: 20 },
    atalhosRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
    atalhoBtn: { flex: 1, borderRadius: 10 },

    // Recentes
    recentes: { paddingHorizontal: 14, marginTop: 20 },
    recentesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    secaoTitulo: { color: CORES.texto, fontSize: 14, fontWeight: '700' },
    vazio: { color: CORES.textoSuave, textAlign: 'center', paddingVertical: 20 },
});