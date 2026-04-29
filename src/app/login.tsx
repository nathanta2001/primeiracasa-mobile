import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import api from '../services/api';

export default function LoginScreen() {
  const { control, handleSubmit } = useForm({ defaultValues: { email: '', senha: '' } });
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const response = await api.post('/login', data);
      await AsyncStorage.setItem('token', response.data.token);
      router.replace('/(tabs)/itens'); // Navega para a aba de itens após login
    } catch (error) {
      console.error("Erro na autenticação", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Primeira Casa</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput label="E-mail" value={value} onChangeText={onChange} mode="outlined" />
        )}
      />
      <Controller
        control={control}
        name="senha"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Senha" value={value} onChangeText={onChange} secureTextEntry mode="outlined" />
        )}
      />
      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
        Entrar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 20 },
  button: { marginTop: 15 }
});