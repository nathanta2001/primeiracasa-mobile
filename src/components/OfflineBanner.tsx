import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNetwork } from '../hooks/useNetwork';

export function OfflineBanner() {
    const { isConnected } = useNetwork();

    if (isConnected) return null;

    return (
        <View style={styles.banner}>
            <Text style={styles.texto}>Você está offline. Alterações serão sincronizadas ao voltar.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: { backgroundColor: '#f87171', padding: 8, alignItems: 'center' },
    texto: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});