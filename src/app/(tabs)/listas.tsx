import { listaService } from '@/src/services/listaService';
import { Lista } from '@/src/types/Lista';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Button, Card, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';

export default function ListasScreen() {

    const [listas, setListas] = useState<Lista[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [visivel, setVisivel] = useState(false);
    const [novoNome, setNovoNome] = useState("");
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

    const handleCriarLista = async () => {
        try {
            setCarregando(true);
            await listaService.criar({ nome: novoNome });
            setVisivel(false);
            setNovoNome("");
            carregarListas(); // Recarrega a lista após criar
        } catch (error) {
            console.error("Erro ao criar lista:", error);
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
                        onPress={() => router.push(`/listas/${lista.id}`)}
                    >
                        <Card.Title
                            title={lista.nome}
                            right={(props) => <IconButton {...props} icon="chevron-right" />}
                        />
                    </Card>
                )}
            />
            <Portal>
                <Modal visible={visivel} onDismiss={() => setVisivel(false)} contentContainerStyle={styles.modal}>
                    <Text variant="headlineSmall" style={{ marginBottom: 10 }}>Nova Lista</Text>
                    <TextInput
                        label="Nome da Lista"
                        value={novoNome}
                        onChangeText={setNovoNome}
                        mode="outlined"
                    />
                    <Button 
                        mode="contained" 
                        onPress={handleCriarLista} 
                        style={{ marginTop: 15 }}
                        loading={carregando}
                    >
                        Criar
                    </Button>
                </Modal>
            </Portal>

            <FAB
                icon="plus"
                label="Nova Lista"
                style={styles.fab}
                onPress={() => setVisivel(true)} // Agora abre o modal em vez de navegar
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    card: { marginHorizontal: 16, marginTop: 12, elevation: 2 },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#6200ee' },
    modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 12 }
});
