import { ConfirmDeleteDialog } from '@/src/components/ConfirmDeleteDialog';
import { useConfirmDelete } from '@/src/hooks/UseConfirmDelete';
import { useLista } from '@/src/hooks/useDataHooks';
import { Lista } from '@/src/types/Lista';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';

export default function ListasScreen() {


    // hooks personalizados para Listas
    const { data: listas, deletar, criar, isFetching, refetch, isSaving } = useLista();
    const router = useRouter();

    // estados locais para controle do modal e do nome da nova lista
    const [visivel, setVisivel] = useState(false);
    const [novoNome, setNovoNome] = useState('');

    // Hook para confirmar deleção
    const { confirmarDelecao, dialogProps } = useConfirmDelete<Lista>(
        (lista) => deletar(lista.id)
    );


    return (
        <View style={styles.container}>
            <FlatList
                data={listas}
                keyExtractor={(lista) => lista.id.toString()}
                refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
                renderItem={({ item: lista }) => (
                    <Card style={styles.card} onPress={() => router.push(`/lista/${lista.id}`)}>
                        <Card.Content>
                            <View style={styles.cardContent}>
                                <Avatar.Icon size={40} icon="clipboard-list" style={{ backgroundColor: '#2e303a' }} />
                                <View style={{ marginLeft: 12, flex: 1 }}>
                                    <Text variant="titleMedium" style={styles.boldText}>{lista.nome}</Text>
                                    <Text variant="bodySmall">Toque para ver os produtos</Text>
                                </View>
                                <IconButton icon="chevron-right" />
                            </View>
                        </Card.Content>
                    </Card>
                )}
            />

            <Portal>
                <Modal
                    visible={visivel}
                    onDismiss={() => setVisivel(false)}
                    contentContainerStyle={styles.modal}
                >
                    <Text variant="headlineSmall" style={{ marginBottom: 10 }}>Nova Lista</Text>
                    <TextInput
                        label="Nome da Lista"
                        value={novoNome}
                        onChangeText={setNovoNome}
                        mode="outlined"
                    />
                    <Button
                        mode="contained"
                        onPress={() => {
                            criar({ nome: novoNome });
                            setNovoNome('');
                            setVisivel(false);
                        }}
                        style={{ marginTop: 15 }}
                        loading={isSaving}
                    >
                        Criar
                    </Button>
                </Modal>
            </Portal>

            <FAB
                icon="plus"
                label="Nova Lista"
                style={styles.fab}
                onPress={() => setVisivel(true)}
            />
            <ConfirmDeleteDialog
                {...dialogProps}
                titulo="Excluir Lista"
                mensagem="Deseja realmente remover esta lista?"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    card: { marginHorizontal: 16, marginTop: 12, elevation: 2 },
    cardContent: { flexDirection: 'row', alignItems: 'center' },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#6200ee' },
    modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 12 },
    boldText: { fontWeight: 'bold' },
});
