import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, Card, IconButton, Text } from 'react-native-paper';
import { ItemCasa } from '../types/ItemCasa';

interface ItemCardProps {
    item: ItemCasa;
    onEdit: (item: ItemCasa) => void;
    onDelete: (id: string) => void;
}

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
    return (
        <Card style={styles.card} onPress={() => onEdit(item)}>
            {item.fotoBase64 ? (
                <Card.Cover source={{ uri: `data:image/png;base64,${item.fotoBase64}` }} style={styles.cover} />
            ) : (
                <View style={styles.placeholder}>
                    <Avatar.Icon size={48} icon="home-outline" />
                </View>
            )}
            <Card.Content style={styles.content}>
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
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: { marginBottom: 12, marginHorizontal: 4, elevation: 2 },
    cover: { height: 140 },
    placeholder: { height: 140, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
    content: { marginTop: 8 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { flex: 1, fontWeight: 'bold' },
    badge: { backgroundColor: '#6200ee' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    price: { color: '#2e7d32', fontWeight: 'bold' }
});