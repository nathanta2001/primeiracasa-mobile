import { AlertCircle, MapPin, Package } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ItemCasa } from '../types/ItemCasa'; // Use o tipo que você já tem

// Componente para exibir cada item da casa
interface ItemCardProps {
    item: ItemCasa;
    onPress: () => void;
}

// funcão para exibir o card de cada item, mostrando nome,
// cômodo e necessidade e seu respectivo ícone.
export function ItemCard({ item, onPress }: ItemCardProps) {

    return (
        // Card para cada item.
        <TouchableOpacity style={styles.card} onPress={onPress}>
            // Cabeçalho do card, ícone e nome.
            <View style={styles.header}>
                <Package size={20} color="#007AFF" />
                <Text style={styles.title}>{item.nome}</Text>
            </View>

            // Detalhes do item, cômodo e necessidade.
            <View style={styles.details}>
                <View style={styles.infoRow}>
                    <MapPin size={16} color="#666" />
                    <Text style={styles.infoText}>{item.comodo}</Text>
                </View>
                <View style={styles.infoRow}>
                    <AlertCircle size={16} color="#666" />
                    <Text style={styles.infoText}>{item.necessidade}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

// Estilos do card.
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 3, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    title: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
    details: { gap: 6 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    infoText: { color: '#666', fontSize: 14 }
});