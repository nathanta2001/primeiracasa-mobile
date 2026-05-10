import { FormSelector } from "@/src/components/FormSelector";
import { useItem } from "@/src/hooks/useDataHooks";
import { useImagePicker } from "@/src/hooks/useImagePicker";
import { ComodoItem, COMODOS_ITEM, NecessidadeItem, NECESSIDADES_ITEM, TipoItem, TIPOS_ITEM } from "@/src/types/ItemCasa";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";

const CORES = {
    fundo: '#16171d',
    surface: '#1f2028',
    borda: '#2e303a',
    roxo: '#c084fc',
    roxoSuave: 'rgba(192, 132, 252, 0.10)',
    texto: '#e2e8f0',
    textoSuave: '#94a3b8',
};

export default function ItensDetalhe() {

    // Hooks de navegação e parâmetros
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // Hooks de dados e imagem
    const { data: item, criar, atualizar, isSaving } = useItem(id as string);
    const { fotoBase64, setFotoBase64, capturaFoto, escolherImagem } = useImagePicker({ quality: 0.5 });

    // Estados locais para os campos do formulário
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState<TipoItem>('MOBILIA');
    const [comodo, setComodo] = useState<ComodoItem>('SALA');
    const [necessidade, setNecessidade] = useState<NecessidadeItem>('ESSENCIAL');
    const [preco, setPreco] = useState('');

    // Determina se estamos editando um item existente ou criando um novo
    const isEditando = id && id !== 'novo';

    // Função para salvar ou atualizar o item
    const handleSalvar = () => {
        const payload = {
            nome,
            preco: parseFloat(preco),
            tipo,
            comodo,
            necessidade,
            fotoBase64: fotoBase64 || undefined,
        };
        if (isEditando) {
            atualizar({ id: id as string, item: payload });
        } else {
            
            const cleanBase64 = payload.fotoBase64?.includes('base64,')
                ? payload.fotoBase64.split('base64,')[1]
                : payload.fotoBase64;

            criar({ ...payload, fotoBase64: cleanBase64 ?? undefined });
        }
        router.navigate('/(tabs)/itens');
    };

    // Carrega os dados do item para edição ou limpa os campos para criação
    useEffect(() => {

        // Se for um item novo, reseta para o valor padrão
        if (id === 'novo') {
            setNome('');
            setPreco('');
            setTipo('MOBILIA');
            setComodo('SALA');
            setNecessidade('ESSENCIAL');
            setFotoBase64(null);
            return;
        }

        // Se for edição 
        const dadosItem = Array.isArray(item) ? item[0] : item;

        // Preenche os campos com os dados do item, se disponíveis
        if (dadosItem) {
            setNome(dadosItem.nome || '');
            setPreco(dadosItem.preco?.toString() || '');
            setTipo(dadosItem.tipo || 'MOBILIA');
            setComodo(dadosItem.comodo || 'SALA');
            setNecessidade(dadosItem.necessidade || 'ESSENCIAL');
            setFotoBase64(dadosItem.fotoBase64 || null);
        }
    }, [id, item]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            {/* Header */}
            <Surface style={styles.header} elevation={2}>
                <Text style={styles.headerLabel}>
                    {isEditando ? 'Editando Item' : 'Novo Item'}
                </Text>
                <Text style={styles.headerSub}>
                    {isEditando
                        ? 'Atualize as informações abaixo'
                        : 'Preencha os dados para adicionar à sua casa'}
                </Text>
            </Surface>

            {/* Campos */}
            <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>Informações Básicas</Text>

                <TextInput
                    label="Nome do Item"
                    value={nome}
                    onChangeText={setNome}
                    mode="outlined"
                    style={styles.input}
                    outlineColor={CORES.borda}
                    activeOutlineColor={CORES.roxo}
                    textColor={CORES.texto}
                />

                <TextInput
                    label="Preço (R$)"
                    value={preco}
                    onChangeText={setPreco}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                    outlineColor={CORES.borda}
                    activeOutlineColor={CORES.roxo}
                    textColor={CORES.texto}
                />
            </View>

            <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>Classificação</Text>

                <Text style={styles.inputLabel}>Cômodo</Text>
                <FormSelector value={comodo} options={COMODOS_ITEM} onSelect={setComodo} />

                <Text style={styles.inputLabel}>Tipo</Text>
                <FormSelector value={tipo} options={TIPOS_ITEM} onSelect={setTipo} />

                <Text style={styles.inputLabel}>Necessidade</Text>
                <FormSelector value={necessidade} options={NECESSIDADES_ITEM} onSelect={setNecessidade} />
            </View>

            {/* Foto */}
            <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>Foto</Text>

                {fotoBase64 && (
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }}
                        style={styles.preview}
                    />
                )}

                <View style={styles.fotoBotoes}>
                    <Button
                        icon="camera"
                        mode="outlined"
                        onPress={capturaFoto}
                        style={styles.fotoBtn}
                        textColor={CORES.roxo}
                    >
                        Câmera
                    </Button>
                    <Button
                        icon="image"
                        mode="outlined"
                        onPress={escolherImagem}
                        style={styles.fotoBtn}
                        textColor={CORES.roxo}
                    >
                        Galeria
                    </Button>
                    {fotoBase64 && (
                        <Button
                            icon="close"
                            mode="outlined"
                            onPress={() => setFotoBase64(null)}
                            style={[styles.fotoBtn, { borderColor: '#f87171' }]}
                            textColor="#f87171"
                        >
                            Remover
                        </Button>
                    )}
                </View>
            </View>

            {/* Botão Salvar */}
            <Button
                mode="contained"
                onPress={handleSalvar}
                loading={isSaving}
                disabled={!nome || !preco || isSaving}
                style={styles.botaoSalvar}
                buttonColor={CORES.roxo}
            >
                {isEditando ? 'Atualizar Item' : 'Salvar na Minha Casa'}
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    content: { paddingBottom: 40 },

    // Header
    header: {
        backgroundColor: CORES.surface,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: CORES.borda,
    },
    headerLabel: { color: CORES.roxo, fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
    headerSub: { color: CORES.textoSuave, fontSize: 13, marginTop: 4 },

    // Seções
    secao: {
        marginHorizontal: 16,
        marginTop: 20,
    },
    secaoTitulo: {
        color: CORES.texto,
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: CORES.borda,
    },

    // Inputs
    input: { backgroundColor: CORES.fundo, marginBottom: 10 },
    inputLabel: {
        color: CORES.textoSuave,
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginTop: 10,
        marginBottom: 4,
    },

    // Foto
    preview: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 },
    fotoBotoes: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    fotoBtn: { flex: 1, borderColor: CORES.borda },

    // Botão Salvar
    botaoSalvar: { marginHorizontal: 16, marginTop: 28, borderRadius: 10, paddingVertical: 2 },
});