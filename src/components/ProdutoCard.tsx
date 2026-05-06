import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { Produto } from '../types/Produto';

interface ProdutoCardProps {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onDelete: (id: string) => void;
}

export const ProdutoCard = ({ produto, onEdit, onDelete }: ProdutoCardProps) => {
  return (
    <Card style={styles.card} onPress={() => onEdit(produto)}>
      <Card.Title
        title={produto.nome}
        subtitle={`${produto.categoria} - ${produto.status}`}
        left={(props) => produto.fotoBase64 ?
          <Avatar.Image {...props} source={{ uri: `data:image/png;base64,${produto.fotoBase64}` }} /> :
          <Avatar.Icon {...props} icon="cart" />
        }
        right={(props) => (
          <IconButton {...props} icon="delete" iconColor="red" onPress={() => onDelete(produto.id)} />
        )}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginVertical: 4, marginHorizontal: 8, elevation: 2 }
});