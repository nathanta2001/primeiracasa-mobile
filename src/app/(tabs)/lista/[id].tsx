import { ConfirmDeleteDialog } from '@/src/components/ConfirmDeleteDialog';
import { FormSelector } from '@/src/components/FormSelector';
import { useConfirmDelete } from '@/src/hooks/UseConfirmDelete';
import { useProduto } from '@/src/hooks/useDataHooks';
import { useImagePicker } from '@/src/hooks/useImagePicker';
import { useProdutoForm } from '@/src/hooks/useProdutoForm';
import { CATEGORIA_PRODUTO, Produto, STATUS_PRODUTO } from '@/src/types/Produto';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';

export default function ListaDetalheScreen() {

    // Obtém o ID da lista a partir dos parâmetros de navegação
    const { id: idLista } = useLocalSearchParams<{ id: string }>();

    // Hook para gerenciar os produtos da lista, incluindo as operações de criação, atualização e exclusão
    const { data: produtos, criar, atualizar, deletar } = useProduto(idLista);

    // Hook para gerenciar a lógica do formulário de produto, incluindo os campos do formulário e as ações de abrir/fechar o modal
    const { fotoBase64, capturaFoto, escolherImagem, setFotoBase64: setFotoBase64ImagePicker } = useImagePicker({ quality: 0.5 });

    // Hook para gerenciar o estado do formulário de produto, incluindo os campos do formulário e as ações de abrir/fechar o modal
    const {
        visivel, isEditando, nome, setNome, status, setStatus,
        categoria, setCategoria, setFotoBase64, abrirCriacao,
        abrirEdicao, fechar, salvar, produtoEditando
    } = useProdutoForm({
        idLista: idLista!,
        onCreate: (payload) => criar({ ...payload, fotoBase64: payload.fotoBase64 ?? undefined }), // Chama o mutation de criar
        onUpdate: (data) => atualizar({ id: data.id, produto: { ...data.payload, fotoBase64: data.payload.fotoBase64 ?? undefined } }), // Chama o mutation de atualizar
    });

    // Hook para confirmar deleção
    const { confirmarDelecao, dialogProps } = useConfirmDelete<Produto>(
        (produto) => deletar(produto.id)
    );

    //sincronizar foto selecionada com o formulário
    useEffect(() => {
        setFotoBase64(fotoBase64);
    }, [fotoBase64, setFotoBase64]);

    return (
        <View style={styles.container}>
            <FlatList
                data={produtos}
                renderItem={({ item }) => (
                    <Card style={styles.card} onPress={() => {
                        abrirEdicao(item);
                        setFotoBase64ImagePicker(item.fotoBase64 || null); // Sincroniza foto ao abrir edição
                    }}>
                        <Card.Title
                            title={item.nome}
                            subtitle={`${item.categoria} - ${item.status}`}
                            right={() => <IconButton
                                icon="delete"
                                onPress={() => confirmarDelecao(item)} />}
                            left={(props) => item.fotoBase64 ?
                                <Avatar.Image {...props} source={{ uri: `data:image/png;base64,${item.fotoBase64}` }} /> :
                                <Avatar.Icon {...props} icon="cart" />
                            }
                        />
                    </Card>
                )}
            />
            <Portal>
                <Modal visible={visivel}
                    onDismiss={fechar}
                    contentContainerStyle={styles.modalContent}>

                    <Text style={styles.title}>
                        {isEditando ? "Editar Produto" : "Novo Produto"}
                    </Text>

                    <TextInput label="Nome" value={nome} onChangeText={setNome} mode='outlined' />

                    <Text style={styles.label}>Status</Text>
                    <FormSelector
                        value={status}
                        options={STATUS_PRODUTO}
                        onSelect={setStatus}
                    />

                    <Text style={styles.label}>Categoria</Text>
                    <FormSelector
                        value={categoria}
                        options={CATEGORIA_PRODUTO}
                        onSelect={setCategoria}
                    />

                    <View style={styles.photoSection}>
                        {fotoBase64 && <Image source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }} style={styles.preview} />}
                        <View style={{ flexDirection: 'row' }}>
                            <Button icon="camera" onPress={capturaFoto}>Câmera</Button>
                            <Button icon="image" onPress={escolherImagem}>Galeria</Button>
                        </View>
                    </View>

                    <Button mode="contained" onPress={salvar} style={{ marginTop: 10 }}>
                        {isEditando ? "Salvar Alterações" : "Adicionar à Lista"}
                    </Button>
                </Modal>
            </Portal>
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => {
                    setFotoBase64ImagePicker(null); // Limpa foto anterior
                    abrirCriacao();
                }}
            />
            <ConfirmDeleteDialog
                {...dialogProps}
                titulo="Excluir Produto"
                mensagem="Deseja realmente remover este item da sua lista?"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    card: { marginHorizontal: 12, marginVertical: 6 },
    fab: { position: 'absolute', right: 16, bottom: 16 },
    modalContent: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    label: { marginTop: 10, fontWeight: '500' },
    photoSection: { alignItems: 'center', marginVertical: 10 },
    preview: { width: 100, height: 100, borderRadius: 8, marginBottom: 5 }
});