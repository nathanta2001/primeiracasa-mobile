import { ConfirmDeleteDialog } from '@/src/components/ConfirmDeleteDialog';
import { FormSelector } from '@/src/components/FormSelector';
import { useConfirmDelete } from '@/src/hooks/UseConfirmDelete';
import { useProduto } from '@/src/hooks/useDataHooks';
import { useImagePicker } from '@/src/hooks/useImagePicker';
import { useProdutoForm } from '@/src/hooks/useProdutoForm';
import { CATEGORIA_PRODUTO, Produto, STATUS_PRODUTO } from '@/src/types/Produto';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, View } from 'react-native';
import { Avatar, Button, Chip, FAB, IconButton, Modal, Portal, Surface, Text, TextInput } from 'react-native-paper';

// Constantes
const CORES = {
    fundo: '#16171d',
    surface: '#1f2028',
    borda: '#2e303a',
    roxo: '#c084fc',
    roxoSuave: 'rgba(192, 132, 252, 0.10)',
    texto: '#e2e8f0',
    textoSuave: '#94a3b8',
};

const COR_STATUS: Record<string, string> = {
    EM_ESTOQUE: '#4ade80',
    ACABANDO: '#facc15',
    ESGOTADO: '#f87171',
};

const LABEL_STATUS: Record<string, string> = {
    EM_ESTOQUE: 'Em Estoque',
    ACABANDO: 'Acabando',
    ESGOTADO: 'Esgotado',
};

// Card de Produto
function ProdutoCard({
    item,
    onEdit,
    onDelete,
}: {
    item: Produto;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const corStatus = COR_STATUS[item.status] ?? CORES.textoSuave;

    return (
        <Surface style={styles.card} elevation={1} onTouchEnd={onEdit}>
            {/* Faixa lateral de status */}
            <View style={[styles.cardFaixa, { backgroundColor: corStatus }]} />

            <View style={styles.cardConteudo}>
                {/* Avatar (foto ou ícone) */}
                {item.fotoBase64 ? (
                    <Avatar.Image
                        size={44}
                        source={{ uri: `data:image/png;base64,${item.fotoBase64}` }}
                        style={styles.avatar}
                    />
                ) : (
                    <Avatar.Icon
                        size={44}
                        icon="cart-outline"
                        style={[styles.avatar, { backgroundColor: CORES.roxoSuave }]}
                        color={CORES.roxo}
                    />
                )}

                {/* Info */}
                <View style={styles.cardInfo}>
                    <Text style={styles.cardNome} numberOfLines={1}>{item.nome}</Text>
                    <Text style={styles.cardCategoria}>{item.categoria?.replace(/_/g, ' ')}</Text>
                    <Chip
                        compact
                        style={[styles.statusChip, { borderColor: corStatus + '44', backgroundColor: corStatus + '18' }]}
                        textStyle={{ color: corStatus, fontSize: 10, fontWeight: '700' }}
                    >
                        {LABEL_STATUS[item.status] ?? item.status}
                    </Chip>
                </View>

                {/* Botão de delete */}
                <IconButton
                    icon="delete-outline"
                    iconColor="#f87171"
                    size={18}
                    style={{ margin: 0 }}
                    onPress={(e) => { e.stopPropagation(); onDelete(); }}
                />
            </View>
        </Surface>
    );
}

// Tela Principal
export default function ListaDetalheScreen() {
    const { id: idLista } = useLocalSearchParams<{ id: string }>();

    const { data: produtos, criar, atualizar, deletar, isFetching, refetch } = useProduto(idLista);

    const { fotoBase64, capturaFoto, escolherImagem, setFotoBase64: setFotoPicker } = useImagePicker({ quality: 0.5 });

    const {
        visivel, isEditando, nome, setNome, status, setStatus,
        categoria, setCategoria, setFotoBase64, abrirCriacao,
        abrirEdicao, fechar, salvar,
    } = useProdutoForm({

        idLista: idLista!,
        
        onCreate: (payload) => {
            const cleanBase64 = payload.fotoBase64?.includes('base64,')
                ? payload.fotoBase64.split('base64,')[1]
                : payload.fotoBase64;

            criar({ ...payload, fotoBase64: cleanBase64 ?? undefined });
        },
        onUpdate: (data) => atualizar({ id: data.id, produto: { ...data.payload, fotoBase64: data.payload.fotoBase64 ?? undefined } }),
    });

    const { confirmarDelecao, dialogProps } = useConfirmDelete<Produto>(
        (produto) => deletar(produto.id)
    );

    // Sincroniza a foto do picker com o formulário
    useEffect(() => { setFotoBase64(fotoBase64); }, [fotoBase64]);

    // Resumo de status para o mini-header 
    const total = produtos?.length ?? 0;
    const emEstoque = produtos?.filter(p => p.status === 'EM_ESTOQUE').length ?? 0;
    const acabando = produtos?.filter(p => p.status === 'ACABANDO').length ?? 0;
    const esgotado = produtos?.filter(p => p.status === 'ESGOTADO').length ?? 0;

    return (
        <View style={styles.container}>

            {/* Mini Header de Resumo */}
            <Surface style={styles.header} elevation={2}>
                <View style={styles.headerRow}>
                    <View style={styles.headerStat}>
                        <Text style={styles.statNum}>{total}</Text>
                        <Text style={styles.statLabel}>total</Text>
                    </View>
                    <View style={[styles.headerStat, { borderColor: COR_STATUS.EM_ESTOQUE + '44' }]}>
                        <Text style={[styles.statNum, { color: COR_STATUS.EM_ESTOQUE }]}>{emEstoque}</Text>
                        <Text style={styles.statLabel}>em estoque</Text>
                    </View>
                    <View style={[styles.headerStat, { borderColor: COR_STATUS.ACABANDO + '44' }]}>
                        <Text style={[styles.statNum, { color: COR_STATUS.ACABANDO }]}>{acabando}</Text>
                        <Text style={styles.statLabel}>acabando</Text>
                    </View>
                    <View style={[styles.headerStat, { borderColor: COR_STATUS.ESGOTADO + '44' }]}>
                        <Text style={[styles.statNum, { color: COR_STATUS.ESGOTADO }]}>{esgotado}</Text>
                        <Text style={styles.statLabel}>esgotado</Text>
                    </View>
                </View>

                {/* Barra de progresso geral */}
                {total > 0 && (
                    <View style={styles.progressoFundo}>
                        <View style={[styles.progressoBarra, { width: `${Math.round((emEstoque / total) * 100)}%` }]} />
                    </View>
                )}
            </Surface>

            {/* Lista de Produtos */}
            <FlatList
                data={produtos}
                keyExtractor={(p) => p.id}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={CORES.roxo} />
                }
                renderItem={({ item }) => (
                    <ProdutoCard
                        item={item}
                        onEdit={() => {
                            abrirEdicao(item);
                            setFotoPicker(item.fotoBase64 || null);
                        }}
                        onDelete={() => confirmarDelecao(item)}
                    />
                )}
                contentContainerStyle={styles.lista}
                ListEmptyComponent={
                    <View style={styles.vazio}>
                        <Text style={{ color: CORES.textoSuave, textAlign: 'center' }}>
                            Nenhum produto nesta lista.{'\n'}Toque no + para adicionar.
                        </Text>
                    </View>
                }
            />

            {/* Modal de Formulário */}
            <Portal>
                <Modal
                    visible={visivel}
                    onDismiss={fechar}
                    contentContainerStyle={styles.modal}
                >
                    <Text style={styles.modalTitulo}>
                        {isEditando ? 'Editar Produto' : 'Novo Produto'}
                    </Text>

                    <TextInput
                        label="Nome"
                        value={nome}
                        onChangeText={setNome}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={CORES.borda}
                        activeOutlineColor={CORES.roxo}
                        textColor={CORES.texto}
                    />

                    <Text style={styles.inputLabel}>Status</Text>
                    <FormSelector value={status} options={STATUS_PRODUTO} onSelect={setStatus} />

                    <Text style={styles.inputLabel}>Categoria</Text>
                    <FormSelector value={categoria} options={CATEGORIA_PRODUTO} onSelect={setCategoria} />

                    {/* Seção de foto */}
                    <View style={styles.fotoSection}>
                        {fotoBase64 && (
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }}
                                style={styles.fotoPreview}
                            />
                        )}
                        <View style={styles.fotoBotoes}>
                            <Button icon="camera" onPress={capturaFoto} textColor={CORES.roxo} compact>Câmera</Button>
                            <Button icon="image" onPress={escolherImagem} textColor={CORES.roxo} compact>Galeria</Button>
                            {fotoBase64 && (
                                <Button icon="close" onPress={() => setFotoPicker(null)} textColor="#f87171" compact>
                                    Remover
                                </Button>
                            )}
                        </View>
                    </View>

                    <Button
                        mode="contained"
                        onPress={salvar}
                        style={{ marginTop: 14 }}
                        buttonColor={CORES.roxo}
                        disabled={!nome.trim()}
                    >
                        {isEditando ? 'Salvar Alterações' : 'Adicionar à Lista'}
                    </Button>
                </Modal>
            </Portal>

            <FAB
                icon="plus"
                style={styles.fab}
                color="#fff"
                onPress={() => {
                    setFotoPicker(null);
                    abrirCriacao();
                }}
            />

            <ConfirmDeleteDialog
                {...dialogProps}
                titulo="Excluir Produto"
                mensagem="Deseja realmente remover este produto da lista?"
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
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: CORES.borda,
    },
    headerRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    headerStat: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: CORES.borda,
        backgroundColor: CORES.fundo,
    },
    statNum: { color: CORES.roxo, fontSize: 22, fontWeight: '800' },
    statLabel: { color: CORES.textoSuave, fontSize: 10, marginTop: 1 },
    progressoFundo: { height: 4, backgroundColor: CORES.borda, borderRadius: 2, overflow: 'hidden' },
    progressoBarra: { height: '100%', backgroundColor: CORES.roxo, borderRadius: 2 },

    // Card de produto
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
    cardFaixa: { width: 3, margin: 10, marginRight: 0, borderRadius: 2 },
    cardConteudo: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingRight: 4 },
    avatar: { marginHorizontal: 10 },
    cardInfo: { flex: 1, gap: 3 },
    cardNome: { color: CORES.texto, fontSize: 14, fontWeight: '600' },
    cardCategoria: { color: CORES.textoSuave, fontSize: 11 },
    statusChip: { alignSelf: 'flex-start', marginTop: 2, borderWidth: 1, height: 22 },

    // Lista
    lista: { paddingTop: 10, paddingBottom: 100 },
    vazio: { alignItems: 'center', padding: 40 },

    // Modal
    modal: {
        backgroundColor: CORES.surface,
        margin: 16,
        borderRadius: 14,
        padding: 20,
        borderWidth: 1,
        borderColor: CORES.borda,
    },
    modalTitulo: { color: CORES.texto, fontSize: 18, fontWeight: '700', marginBottom: 14 },
    input: { backgroundColor: CORES.fundo, marginBottom: 4 },
    inputLabel: { color: CORES.textoSuave, fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 10, marginBottom: 4 },
    fotoSection: { marginTop: 12, gap: 8 },
    fotoPreview: { width: '100%', height: 140, borderRadius: 10 },
    fotoBotoes: { flexDirection: 'row', gap: 4 },

    // FAB
    fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: CORES.roxo },
});