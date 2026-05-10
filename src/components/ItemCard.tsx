import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, Card, IconButton, Surface, Text } from 'react-native-paper';
import { useNetwork } from '../hooks/useNetwork';
import { ItemCasa } from '../types/ItemCasa';
import { NormalizaImagem } from './NormalizaImagem';

interface ItemCardProps {
    item: ItemCasa;
    onEdit: (item: ItemCasa) => void;
    onDelete: (id: string) => void;
}

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {


    const isOffline = useNetwork().isConnected === false;

    return (
        <Card style={styles.card} onPress={() => onEdit(item)}>
            {item.fotoBase64 ? (
                <NormalizaImagem
                    base64={item.fotoBase64}
                    style={styles.cover}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.placeholder}>
                    <Avatar.Icon size={48} icon="home-outline" />
                </View>
            )}
            <Card.Content style={styles.content}>
                <Surface style={[styles.card, isOffline && { opacity: 0.7 }]} elevation={1}>
                    <View style={styles.header}>
                        <Text variant="titleMedium" style={styles.title}>{item.nome}</Text>
                        <Badge style={styles.badge}>{item.necessidade}</Badge>
                    </View>
                    <Text variant="bodySmall">Cômodo: {item.comodo} | Tipo: {item.tipo}</Text>
                    <View style={styles.footer}>
                        <Text variant="labelLarge" style={styles.price}>R$ {item.preco.toFixed(2)}</Text>
                        <IconButton
                            icon="delete-outline"
                            iconColor="red"
                            size={20}
                            onPress={() => onDelete(item.id)}
                        />
                    </View>
                </Surface>
            </Card.Content>

        </Card >
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        backgroundColor: '#1f2028', // --code-bg
        borderWidth: 1,
        borderColor: '#2e303a'      // --border
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
        backgroundColor: '#2e303a'
    },
    cover: {
        height: 120,
    },
    content: {
        paddingVertical: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    title: { color: '#f3f4f6', fontWeight: 'bold' },
    badge: { backgroundColor: '#c084fc', color: '#16171d' }, // --accent
    price: { color: '#c084fc', fontWeight: 'bold' }
});