import { ConfirmDeleteDialog } from '@/src/components/ConfirmDeleteDialog';
import { useConfirmDelete } from '@/src/hooks/UseConfirmDelete';
import { useLista } from '@/src/hooks/useDataHooks';
import { Lista } from '@/src/types/Lista';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Button, FAB, IconButton, Modal, Portal, Surface, Text, TextInput } from 'react-native-paper';

// Constantes de cor
const CORES = {
    fundo: '#16171d',
    surface: '#1f2028',
    borda: '#2e303a',
    roxo: '#c084fc',
    roxoSuave: 'rgba(192, 132, 252, 0.10)',
    texto: '#e2e8f0',
    textoSuave: '#94a3b8',
};

// Ícones por categoria/nome
const iconeParaLista = (nome: string): string => {
    const n = nome.toLowerCase();
    if (n.includes('mercado') || n.includes('compra')) return 'cart-outline';
    if (n.includes('farmácia') || n.includes('remédio')) return 'medical-bag';
    if (n.includes('casa') || n.includes('limpeza')) return 'home-outline';
    if (n.includes('roupa') || n.includes('vestuário')) return 'hanger';
    return 'clipboard-list-outline';
};

// Card de Lista 
function ListaCard({
    lista,
    onPress,
    onDelete,
}: {
    lista: Lista;
    onPress: () => void;
    onDelete: () => void;
}) {

    const icone = iconeParaLista(lista.nome);
    const total = (lista as any).totalProdutos as number | undefined;
    const comprados = (lista as any).produtosComprados as number | undefined;
    const progresso = total && comprados !== undefined ? comprados / total : null;

    return (
        <Surface style={styles.card} elevation={1} onTouchEnd={onPress}>
            {/* Faixa lateral colorida */}
            <View style={styles.cardFaixa} />

            <View style={styles.cardConteudo}>
                {/* Ícone */}
                <View style={styles.cardIconeWrap}>
                    <IconButton
                        icon={icone}
                        iconColor={CORES.roxo}
                        size={22}
                        style={{ margin: 0 }}
                    />
                </View>

                {/* Info */}
                <View style={styles.cardInfo}>
                    <Text style={styles.cardNome} numberOfLines={1}>{lista.nome}</Text>

                    {total !== undefined ? (
                        <Text style={styles.cardSub}>
                            {comprados ?? 0} / {total} itens
                        </Text>
                    ) : (
                        <Text style={styles.cardSub}>Toque para ver os produtos</Text>
                    )}

                    {/* Barra de progresso (só aparece se tiver dados) */}
                    {progresso !== null && (
                        <View style={styles.progressoFundo}>
                            <View style={[styles.progressoBarra, { width: `${Math.round(progresso * 100)}%` }]} />
                        </View>
                    )}
                </View>

                {/* Ações */}
                <View style={styles.cardAcoes}>
                    <IconButton
                        icon="chevron-right"
                        iconColor={CORES.textoSuave}
                        size={20}
                        style={{ margin: 0 }}
                        onPress={onPress}
                    />
                    <IconButton
                        icon="delete-outline"
                        iconColor="#f87171"
                        size={18}
                        style={{ margin: 0 }}
                        onPress={onDelete}
                    />
                </View>
            </View>
        </Surface>
    );
}

// Tela Principal
export default function ListasScreen() {
    const { data: listas, deletar, criar, isFetching, refetch, isSaving } = useLista();
    const router = useRouter();

    const [visivel, setVisivel] = useState(false);
    const [novoNome, setNovoNome] = useState('');

    const { confirmarDelecao, dialogProps } = useConfirmDelete<Lista>(
        (lista) => deletar(lista.id)
    );

    const handleCriar = () => {
        if (!novoNome.trim()) return;
        criar({ nome: novoNome.trim() });
        setNovoNome('');
        setVisivel(false);
    };

    return (
        <View style={styles.container}>

            {/* Header */}
            <Surface style={styles.header} elevation={2}>
                <Text style={styles.headerLabel}>Listas de Compras</Text>
                <Text style={styles.headerValor}>{listas?.length ?? 0}</Text>
                <Text style={styles.headerSub}>listas ativas</Text>
            </Surface>

            {/* Lista */}
            <FlatList
                data={listas}
                keyExtractor={(lista) => lista.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={CORES.roxo} />
                }
                renderItem={({ item: lista }) => (
                    <ListaCard
                        lista={lista}
                        onPress={() => router.push({ pathname: '/(tabs)/lista-detalhe', params: { id: lista.id } })}
                        onDelete={() => confirmarDelecao(lista)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.vazio}>
                        <Text style={{ color: CORES.textoSuave, textAlign: 'center' }}>
                            Nenhuma lista criada ainda.{'\n'}Toque no + para começar.
                        </Text>
                    </View>
                }
            />

            {/* Modal Nova Lista */}
            <Portal>
                <Modal
                    visible={visivel}
                    onDismiss={() => { setVisivel(false); setNovoNome(''); }}
                    contentContainerStyle={styles.modal}
                >
                    <Text style={styles.modalTitulo}>Nova Lista</Text>
                    <TextInput
                        label="Nome da Lista"
                        value={novoNome}
                        onChangeText={setNovoNome}
                        mode="outlined"
                        style={styles.modalInput}
                        outlineColor={CORES.borda}
                        activeOutlineColor={CORES.roxo}
                        textColor={CORES.texto}
                        autoFocus
                        onSubmitEditing={handleCriar}
                    />
                    <View style={styles.modalAcoes}>
                        <Button
                            onPress={() => { setVisivel(false); setNovoNome(''); }}
                            textColor={CORES.textoSuave}
                        >
                            Cancelar
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleCriar}
                            loading={isSaving}
                            disabled={!novoNome.trim() || isSaving}
                            buttonColor={CORES.roxo}
                        >
                            Criar
                        </Button>
                    </View>
                </Modal>
            </Portal>

            <FAB
                icon="plus"
                label="Nova Lista"
                style={styles.fab}
                color="#fff"
                onPress={() => setVisivel(true)}
            />

            <ConfirmDeleteDialog
                {...dialogProps}
                titulo="Excluir Lista"
                mensagem="Deseja realmente remover esta lista e todos os seus produtos?"
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
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: CORES.borda,
    },
    headerLabel: { color: CORES.roxo, fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
    headerValor: { color: CORES.texto, fontSize: 36, fontWeight: '800', marginTop: 4 },
    headerSub: { color: CORES.textoSuave, fontSize: 12, marginTop: 2 },

    // Card de lista
    card: {
        marginHorizontal: 14,
        marginVertical: 5,
        borderRadius: 12,
        backgroundColor: CORES.surface,
        borderWidth: 1,
        borderColor: CORES.borda,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    cardFaixa: {
        width: 3,
        backgroundColor: CORES.roxo,
        borderRadius: 3,
        margin: 10,
        marginRight: 0,
        alignSelf: 'stretch',
    },
    cardConteudo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingRight: 4,
    },
    cardIconeWrap: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: CORES.roxoSuave,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    cardInfo: { flex: 1, gap: 3 },
    cardNome: { color: CORES.texto, fontSize: 15, fontWeight: '600' },
    cardSub: { color: CORES.textoSuave, fontSize: 12 },
    progressoFundo: {
        height: 3,
        backgroundColor: CORES.borda,
        borderRadius: 2,
        marginTop: 4,
        overflow: 'hidden',
    },
    progressoBarra: {
        height: '100%',
        backgroundColor: CORES.roxo,
        borderRadius: 2,
    },
    cardAcoes: { flexDirection: 'column', alignItems: 'center' },

    // Lista
    listContent: { paddingTop: 10, paddingBottom: 100 },
    vazio: { flex: 1, alignItems: 'center', padding: 40 },

    // Modal
    modal: {
        backgroundColor: CORES.surface,
        margin: 20,
        borderRadius: 14,
        padding: 20,
        borderWidth: 1,
        borderColor: CORES.borda,
    },
    modalTitulo: { color: CORES.texto, fontSize: 18, fontWeight: '700', marginBottom: 14 },
    modalInput: { backgroundColor: CORES.fundo, marginBottom: 4 },
    modalAcoes: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 16 },

    // FAB
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: CORES.roxo,
    },
});