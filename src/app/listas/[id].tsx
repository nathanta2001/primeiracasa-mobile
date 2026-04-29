import { listaService } from '@/src/services/listaService';
import { produtoService } from '@/src/services/produtoService';
import { Produto } from '@/src/types/Produto';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Avatar, Badge, Card, FAB } from 'react-native-paper';

export default function ListaDetalheScreen() {
    const { id } = useLocalSearchParams();
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [lista, setLista] = useState<any>(null);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        carregarProdutos();
    }, [id]);


    const carregarProdutos = async () => {
        try {

            setCarregando(true);

            // Busca a lista e os produtos em paralelo com Promise.all
            // Promise.all espera as duas requisições terminarem ao mesmo tempo
            // mais eficiente do que fazer uma por vez
            const [listaData, produtosData] = await Promise.all([
                listaService.buscarPorId(id as string),
                produtoService.listarTodos()
            ]);
            setLista(listaData);

            // Filtra só os produtos desta lista
            setProdutos(produtosData.filter((p) => p.idLista === id));
        } catch (error) {
            console.error(error);
            router.navigate('./listas'); // Volta para a lista se der erro
        } finally {
            setCarregando(false);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={produtos}
                keyExtractor={(produto) => produto.id}
                renderItem={({ item: produto }) => (
                    <Card style={styles.card}>
                        <Card.Title
                            title={produto.nome}
                            subtitle={` ${produto.categoria}`}
                            left={(props) => produto.fotoBase64 ?
                                <Avatar.Image {...props} source={{ uri: `data:image/png;base64,${produto.fotoBase64}` }} /> :
                                <Avatar.Icon {...props} icon="cart" />
                            }
                            right={() => (
                                <Badge style={[styles.badge, { backgroundColor: getStatusColor(produto.status) }]}>
                                    {produto.status}
                                </Badge>
                            )}
                        />
                    </Card>
                )}
            />
            <FAB icon="plus" label="Adicionar Produto" style={styles.fab} onPress={() => { }} />
        </View>
    );
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'EM_ESTOQUE': return '#4caf50';
        case 'ACABANDO': return '#ff9800';
        case 'ESGOTADO': return '#f44336';
        default: return '#757575';
    }
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    card: { margin: 8, elevation: 2 },
    badge: { alignSelf: 'center', marginRight: 16 },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 }
});