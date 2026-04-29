import { listaService } from '@/src/services/listaService';
import { Lista } from '@/src/types/Lista';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Card, FAB, IconButton } from 'react-native-paper';

export default function ListasScreen() {

    const [listas, setListas] = useState<Lista[]>([]);
    const [carregando, setCarregando] = useState(false);
    const router = useRouter();


    useEffect(() => { carregarListas(); }, []);

    const carregarListas = async () => {
        try {
            setCarregando(true);
            const response = await listaService.listarTodos();
            setListas(response);
        } catch (error) {
            console.error(error);
        } finally {
            setCarregando(false);
        }
    };

    

    return (
        <View style={styles.container}>
            <FlatList
                data={listas}
                keyExtractor={(lista) => lista.id.toString()}
                refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregarListas} />}
                renderItem={({ item: lista }) => (
                    <Card
                        style={styles.card}
                        onPress={() => router.push(`./${lista.id}`)}
                    >
                        <Card.Title
                            title={lista.nome}
                            right={(props) => <IconButton {...props} icon="chevron-right" />}
                        />
                    </Card>
                )}
            />
            <FAB
                icon="plus"
                label="Nova Lista"
                style={styles.fab}
                onPress={() => router.push('./novo')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    card: { marginHorizontal: 16, marginTop: 12, elevation: 2 },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#6200ee' },
});