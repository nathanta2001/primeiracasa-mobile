import { ConfirmDeleteDialog } from '@/src/components/ConfirmDeleteDialog';
import { ItemCard } from '@/src/components/ItemCard';
import { useConfirmDelete } from '@/src/hooks/UseConfirmDelete';
import { useItem } from '@/src/hooks/useDataHooks';
import { useItemFiltro } from '@/src/hooks/Useitemfiltro';
import { COMODOS_ITEM, ItemCasa, NECESSIDADES_ITEM, TIPOS_ITEM } from '@/src/types/ItemCasa';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Chip, FAB, IconButton, Searchbar, Surface, Text } from 'react-native-paper';


// Constantes de cor
const CORES = {
    fundo: '#16171d',
    surface: '#1f2028',
    borda: '#2e303a',
    roxo: '#c084fc',
    roxoSuave: 'rgba(192, 132, 252, 0.12)',
    texto: '#e2e8f0',
    textoSuave: '#94a3b8',
};

// Labels de necessidade com cor semântica
const COR_NECESSIDADE: Record<string, string> = {
    ESSENCIAL: '#4ade80',
    IMPORTANTE: '#facc15',
    DESEJAVEL: '#60a5fa',
};

// Componente de seção de chips
function SecaoChips<T extends string>({
    titulo,
    opcoes,
    ativo,
    onToggle,
}: {
    titulo: string;
    opcoes: readonly T[];
    ativo: T | null | undefined;
    onToggle: (v: T) => void;
}) {
    return (
        <View style={styles.secaoFiltro}>
            <Text style={styles.labelFiltro}>{titulo}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.rowChips}>
                    {opcoes.map((op) => {
                        const selecionado = ativo === op;
                        return (
                            <Chip
                                key={op}
                                selected={selecionado}
                                onPress={() => onToggle(op)}
                                style={[
                                    styles.chip,
                                    selecionado && { backgroundColor: CORES.roxoSuave, borderColor: CORES.roxo },
                                ]}
                                textStyle={{ color: selecionado ? CORES.roxo : CORES.textoSuave, fontSize: 12 }}
                                compact
                            >
                                {op.replace(/_/g, ' ')}
                            </Chip>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

// Tela Principal 
export default function ItensScreen() {

    // Filtro e busca
    const {
        data: itens,
        isFetching,
        refetch,
        filtros,
        busca,
        setBusca,
        toggleFiltro,
        limpar,
        temFiltroAtivo,
    } = useItemFiltro();

    // Estado para controle de abertura do painel de filtros
    const [filtroAberto, setFiltroAberto] = useState(false);

    // Hook para operações de item
    const { deletar, isSaving } = useItem();

    const { confirmarDelecao, dialogProps } = useConfirmDelete<ItemCasa>(
        (item) => deletar(item.id),
        { carregando: isSaving }
    );

    // Cálculos
    const totalItens = itens?.length ?? 0;
    const totalValor = itens?.reduce((acc: number, i: ItemCasa) => acc + (i.preco ?? 0), 0) ?? 0;
    const essenciais = itens?.filter((i: ItemCasa) => i.necessidade === 'ESSENCIAL').length ?? 0;

    return (
        <View style={styles.container}>

            {/*  Header de Resumo */}
            <Surface style={styles.header} elevation={2}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerLabel}>Minha Casa</Text>
                        <Text style={styles.headerValor}>
                            R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Text>
                        <Text style={styles.headerSub}>valor total estimado</Text>
                    </View>
                    <View style={styles.headerStats}>
                        <View style={styles.statBadge}>
                            <Text style={styles.statNum}>{totalItens}</Text>
                            <Text style={styles.statLabel}>itens</Text>
                        </View>
                        <View style={[styles.statBadge, { borderColor: COR_NECESSIDADE.ESSENCIAL + '55' }]}>
                            <Text style={[styles.statNum, { color: COR_NECESSIDADE.ESSENCIAL }]}>{essenciais}</Text>
                            <Text style={styles.statLabel}>essenciais</Text>
                        </View>
                    </View>
                </View>

                {/* Barra de busca */}
                <Searchbar
                    placeholder="Buscar item..."
                    value={busca}
                    onChangeText={setBusca}
                    style={styles.searchbar}
                    inputStyle={{ color: CORES.texto, fontSize: 14 }}
                    placeholderTextColor={CORES.textoSuave}
                    iconColor={CORES.textoSuave}
                    right={() => (
                        <IconButton
                            icon={filtroAberto ? 'filter-remove' : 'filter-variant'}
                            iconColor={temFiltroAtivo ? CORES.roxo : CORES.textoSuave}
                            size={20}
                            onPress={() => setFiltroAberto(v => !v)}
                        />
                    )}
                />

                {/* Painel de Filtros */}
                {filtroAberto && (
                    <View style={styles.painelFiltros}>
                        <SecaoChips
                            titulo="Cômodo"
                            opcoes={COMODOS_ITEM}
                            ativo={filtros.comodo}
                            onToggle={(v) => toggleFiltro('comodo', v)}
                        />
                        <SecaoChips
                            titulo="Tipo"
                            opcoes={TIPOS_ITEM}
                            ativo={filtros.tipo}
                            onToggle={(v) => toggleFiltro('tipo', v)}
                        />
                        <SecaoChips
                            titulo="Necessidade"
                            opcoes={NECESSIDADES_ITEM}
                            ativo={filtros.necessidade}
                            onToggle={(v) => toggleFiltro('necessidade', v)}
                        />
                        {temFiltroAtivo && (
                            <Chip
                                icon="close"
                                onPress={limpar}
                                style={[styles.chip, { borderColor: '#f87171', marginTop: 4 }]}
                                textStyle={{ color: '#f87171', fontSize: 12 }}
                                compact
                            >
                                Limpar filtros
                            </Chip>
                        )}
                    </View>
                )}
            </Surface>

            {/* Lista */}
            <FlatList
                data={itens}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={CORES.roxo} />
                }
                renderItem={({ item }) => (
                    <ItemCard
                        item={item}
                        onEdit={(i) => router.push({ pathname: '/(tabs)/itens-detalhe', params: { id: i.id } })}
                        onDelete={() => confirmarDelecao(item)}
                    />
                )}
                contentContainerStyle={styles.lista}
                ListEmptyComponent={
                    <View style={styles.vazio}>
                        <Text style={{ color: CORES.textoSuave, textAlign: 'center' }}>
                            {temFiltroAtivo
                                ? 'Nenhum item encontrado com esses filtros.'
                                : 'Nenhum item cadastrado ainda.'}
                        </Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={styles.fab}
                color="#fff"
                onPress={() => router.push({ pathname: '/(tabs)/itens-detalhe', params: { id: 'novo' } })}
            />

            <ConfirmDeleteDialog
                {...dialogProps}
                titulo="Excluir Item"
                mensagem="Deseja realmente remover este item da sua casa?"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },

    // Header
    header: {
        backgroundColor: CORES.surface,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: CORES.borda,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    headerLabel: { color: CORES.roxo, fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
    headerValor: { color: CORES.texto, fontSize: 28, fontWeight: '800', marginTop: 2 },
    headerSub: { color: CORES.textoSuave, fontSize: 12, marginTop: 2 },
    headerStats: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    statBadge: {
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: CORES.borda,
        backgroundColor: CORES.fundo,
        minWidth: 56,
    },
    statNum: { color: CORES.roxo, fontSize: 20, fontWeight: '800' },
    statLabel: { color: CORES.textoSuave, fontSize: 10, marginTop: 1 },

    // Searchbar
    searchbar: {
        backgroundColor: CORES.fundo,
        borderRadius: 10,
        height: 44,
        borderWidth: 1,
        borderColor: CORES.borda,
    },

    // Filtros
    painelFiltros: { marginTop: 12, gap: 8 },
    secaoFiltro: { gap: 6 },
    labelFiltro: { color: CORES.textoSuave, fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
    rowChips: { flexDirection: 'row', gap: 6 },
    chip: {
        borderWidth: 1,
        borderColor: CORES.borda,
        backgroundColor: CORES.fundo,
        height: 30,
    },

    // Lista
    lista: { padding: 12, paddingBottom: 100 },
    vazio: { flex: 1, alignItems: 'center', padding: 40 },

    // FAB
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: CORES.roxo,
    },
});