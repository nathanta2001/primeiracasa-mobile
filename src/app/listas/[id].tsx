import { FormSelector } from '@/src/components/FormSelector';
import { produtoService } from '@/src/services/produtoService';
import { CATEGORIA_PRODUTO, CategoriaProduto, Produto, STATUS_PRODUTO, StatusProduto } from '@/src/types/Produto';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';

export default function ListaDetalheScreen() {

    const { id } = useLocalSearchParams();
    const [produtoeditando, setProdutoEditando] = useState<Produto | null>(null);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [visivel, setVisivel] = useState(false);

    const [nome, setNome] = useState("");
    const [status, setStatus] = useState<StatusProduto>('EM_ESTOQUE');
    const [categoria, setCategoria] = useState<CategoriaProduto>('MERCEARIA');
    const [fotoBase64, setFotoBase64] = useState<string | null>(null);


    const abrirEdicao = (produto: Produto) => {
        setProdutoEditando(produto);
        setNome(produto.nome);
        setStatus(produto.status);
        setCategoria(produto.categoria);
        setFotoBase64(produto.fotoBase64 || null);
        setVisivel(true);
    };

    const handleSalvarEdicao = async () => {

        const payload = {
            nome,
            status,
            categoria,
            fotoBase64: fotoBase64 || undefined,
            idLista: id as string
        };

        try {
            setCarregando(true);
            if (produtoeditando) {
                await produtoService.atualizar(produtoeditando.id, payload);
            } else {
                await produtoService.criar(payload);
            }
            setVisivel(false);
            setProdutoEditando(null);
            limparCampos();
            carregarProdutos();
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
        } finally {
            setCarregando(false);
        }
    };


    useEffect(() => {
        carregarProdutos();
    }, [id]);

    const carregarProdutos = async () => {
        try {

            setCarregando(true);
            const response = await produtoService.listarTodos();
            setProdutos(response.filter((p) => p.idLista === id)); // Filtra só os produtos desta lista
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        } finally {
            setCarregando(false);
        }
    };

    const limparCampos = () => {
        setNome(''); setFotoBase64(null);
    };

    const handleDeletar = async (id: string) => {
        try {
            await produtoService.deletar(id);
            carregarProdutos();
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
        }
    };


    return (
        <View style={styles.container}>
            <FlatList
                data={produtos}
                renderItem={({ item }) => (
                    <Card style={styles.card} onPress={() => abrirEdicao(item)}>
                        <Card.Title
                            title={item.nome}
                            subtitle={`${item.categoria} - ${item.status}`}
                            right={() => <IconButton icon="delete" onPress={() => handleDeletar(item.id)} />}
                            left={(props) => item.fotoBase64 ?
                                <Avatar.Image {...props} source={{ uri: `data:image/png;base64,${item.fotoBase64}` }} /> :
                                <Avatar.Icon {...props} icon="cart" />
                            }
                        />
                    </Card>
                )}
            />
            <Portal>
                <Modal visible={visivel} onDismiss={() => { setVisivel(false); setProdutoEditando(null); }}>
                    <Text>{produtoeditando ? "Editar Produto" : "Novo Produto"}</Text>

                    <TextInput label="Nome" value={nome} onChangeText={setNome} />

                    <Text style={styles.label}>Status</Text>
                    <FormSelector
                        label="Status"
                        value={status}
                        options={STATUS_PRODUTO}
                        onSelect={setStatus}
                    />

                    <Text style={styles.label}>Categoria</Text>
                    <FormSelector
                        label="Categoria"
                        value={categoria}
                        options={CATEGORIA_PRODUTO}
                        onSelect={setCategoria}
                    />
                    <Button onPress={handleSalvarEdicao}>{produtoeditando ? "Atualizar" : "Adicionar"}</Button>
                </Modal>
            </Portal>
            <FAB icon="plus" style={styles.fab} onPress={() => { setProdutoEditando(null); limparCampos(); setVisivel(true); }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    card: { margin: 8 },
    fab: { position: 'absolute', right: 16, bottom: 16 },
    content: { padding: 20, gap: 10 },
    title: { marginBottom: 10, fontWeight: 'bold', color: '#007AFF' },
    input: { marginBottom: 5 },
    label: { marginTop: 10, fontWeight: 'bold' },
    chipGroup: { flexDirection: 'row', marginBottom: 10 },
    chip: { marginRight: 8 },
    photoSection: { alignItems: 'center', marginVertical: 15, gap: 10 },
    preview: { width: '100%', height: 200, borderRadius: 12 }
});