import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';

const CORES = {
  fundo: '#16171d',
  surface: '#1f2028',
  borda: '#2e303a',
  roxo: '#c084fc',
  texto: '#e2e8f0',
  textoSuave: '#94a3b8',
  erro: '#f87171',
};

export default function LoginScreen() {


  // Configuração do formulário
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', senha: '' },
  });

  // Função de submissão do formulário
  const { entrar, erroLogin, resetErro, isLoggingIn } = useAuth();

  const onSubmit = (data: any) => {
    entrar(data);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Marca */}
      <View style={styles.marca}>
        <View style={styles.iconeWrap}>
          <Text style={styles.icone}>🏠</Text>
        </View>
        <Text style={styles.titulo}>Primeira Casa</Text>
        <Text style={styles.subtitulo}>Organize sua casa do zero</Text>
      </View>

      {/* Formulário  */}
      <View style={styles.form}>
        <Text style={styles.formTitulo}>Entrar na sua conta</Text>

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'E-mail obrigatório',
            pattern: { value: /\S+@\S+\.\S+/, message: 'E-mail inválido' },
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.campoWrap}>
              <TextInput
                label="E-mail"
                value={value}
                onChangeText={(v) => {
                  onChange(v);
                  if (erroLogin) resetErro();
                }}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                outlineColor={errors.email ? CORES.erro : CORES.borda}
                activeOutlineColor={errors.email ? CORES.erro : CORES.roxo}
                textColor={CORES.texto}
                left={<TextInput.Icon icon="email-outline" color={CORES.textoSuave} />}
              />
              {errors.email && (
                <HelperText type="error" style={styles.helperText}>
                  {errors.email.message}
                </HelperText>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="senha"
          rules={{ required: 'Senha obrigatória' }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.campoWrap}>
              <TextInput
                label="Senha"
                value={value}
                onChangeText={(v) => {
                  onChange(v);
                  if (erroLogin) resetErro();
                }}
                secureTextEntry
                mode="outlined"
                style={styles.input}
                outlineColor={errors.senha ? CORES.erro : CORES.borda}
                activeOutlineColor={errors.senha ? CORES.erro : CORES.roxo}
                textColor={CORES.texto}
                left={<TextInput.Icon icon="lock-outline" color={CORES.textoSuave} />}
              />
              {errors.senha && (
                <HelperText type="error" style={styles.helperText}>
                  {errors.senha.message}
                </HelperText>
              )}
            </View>
          )}
        />

        {/* Erro geral de autenticação */}
        {erroLogin ? (
          <View style={styles.erroGeral}>
            <Text style={styles.erroGeralTexto}>{erroLogin}</Text>
          </View>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isLoggingIn}
          disabled={isLoggingIn}
          style={styles.botao}
          buttonColor={CORES.roxo}
        >
          Entrar
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  // Marca
  marca: { alignItems: 'center', marginBottom: 40 },
  iconeWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: CORES.surface,
    borderWidth: 1,
    borderColor: CORES.roxo + '55',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  icone: { fontSize: 32 },
  titulo: { color: CORES.texto, fontSize: 28, fontWeight: '800' },
  subtitulo: { color: CORES.textoSuave, fontSize: 13, marginTop: 4 },

  // Formulário
  form: {
    backgroundColor: CORES.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: CORES.borda,
    gap: 4,
  },
  formTitulo: { color: CORES.textoSuave, fontSize: 13, marginBottom: 10 },

  campoWrap: { gap: 0 },
  input: { backgroundColor: CORES.fundo },
  helperText: { color: CORES.erro, fontSize: 11 },

  // Erro geral
  erroGeral: {
    backgroundColor: CORES.erro + '18',
    borderWidth: 1,
    borderColor: CORES.erro + '44',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  erroGeralTexto: { color: CORES.erro, fontSize: 13, textAlign: 'center' },

  // Botão
  botao: { marginTop: 12, borderRadius: 10, paddingVertical: 2 },
});