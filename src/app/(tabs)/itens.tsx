import { itemCasaService } from '@/src/services/itemCasaService';
import { ItemCasa } from '@/src/types/ItemCasa';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Badge, Card, FAB, Text } from 'react-native-paper';

export default function ItensScreen() {

    const [itens, setItens] = useState<ItemCasa[]>([]);
    const [carregando, setCarregando] = useState(false);

    const carregarItens = async () => {
        try {

            setCarregando(true);
            const response = await itemCasaService.listarTodos();
            setItens(response);
        } catch (error) {
            console.error(error);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => { carregarItens(); }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={itens}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregarItens} />}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        {item.fotoBase64 && (
                            <Card.Cover source={{ uri: `data:image/png;base64,${item.fotoBase64}` }} />
                        )}
                        <Card.Content>
                            <View style={styles.row}>
                                <Text variant="titleMedium">{item.nome}</Text>
                                <Badge style={styles.necessidadeBadge}>{item.necessidade}</Badge>
                            </View>
                            <Text variant="bodySmall">Cômodo: {item.comodo} | Tipo: {item.tipo}</Text>
                            <Text variant="labelLarge" style={styles.precoText}>R$ {item.preco.toFixed(2)}</Text>
                        </Card.Content>
                    </Card>
                )}
                />
            <FAB icon="plus" style={styles.fab} onPress={() => {/* Navegar para form */ }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    card: { marginBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    necessidadeBadge: { backgroundColor: '#6200ee' },
    precoText: { marginTop: 5, color: '#2e7d32' },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 }
});