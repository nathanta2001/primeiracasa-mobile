import { FormSelector } from "@/src/components/FormSelector";
import { useItem } from "@/src/hooks/useDataHooks";
import { useImagePicker } from "@/src/hooks/useImagePicker";
import { ComodoItem, COMODOS_ITEM, NecessidadeItem, NECESSIDADES_ITEM, TipoItem, TIPOS_ITEM } from "@/src/types/ItemCasa";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function NovoItem() {

    const router = useRouter();

    // Obtém o ID do item a partir dos parâmetros de navegação. 
    const { id } = useLocalSearchParams();

    // hooks personalizados para acessar os dados do item e realizar operações de criação/atualização.
    const { data: item, criar, atualizar, isSaving } = useItem(id as string);

    // hook personalizado para lidar com a seleção de imagens,
    const { fotoBase64, setFotoBase64, capturaFoto, escolherImagem } = useImagePicker({ quality: 0.5 });

    // estados para controlar os campos do formulário.
    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState<TipoItem>('MOBILIA');
    const [comodo, setComodo] = useState<ComodoItem>('SALA');
    const [necessidade, setNecessidade] = useState<NecessidadeItem>('ESSENCIAL');
    const [preco, setPreco] = useState("");

    // Determina se estamos editando um item existente ou criando um novo com base no ID.
    const isEditando = id && id !== 'novo';

    // Quando o item for carregado, preenche os campos do formulário com os dados do item.
    const handleSalvar = () => {
        const payload = {
            nome,
            preco: parseFloat(preco),
            tipo,
            comodo,
            necessidade,
            fotoBase64: fotoBase64 || undefined
        };

        if (isEditando) {
            atualizar({ id: id as string, item: payload });
        } else {
            criar(payload);
        }

        // Após salvar, volta para a tela anterior (lista de itens).
        router.back();
    };

    // preenche os campos do formulário com os dados do item (se for edição).
    useEffect(() => {
        // verifica se o item existe e se o ID não é "novo" 
        // para evitar preencher o formulário com dados inexistentes.
        const itens = Array.isArray(item) ? item[0] : item;

        // Se for edição de um item existente, 
        // preecnhe os campos do formulário com os dados do item.
        if (id !== 'novo' && itens) {

            //modo edição - preenche os campos do formulário com os dados do item
            setNome(itens.nome);
            setPreco(itens.preco?.toString() || '');
            setTipo(itens.tipo);
            setComodo(itens.comodo);
            setNecessidade(itens.necessidade);
            setFotoBase64(itens.fotoBase64 || null);
        }
        else {
            
            //modo criação - limpa os campos do formulário para criar um novo item
            setNome('');
            setPreco('');
            setTipo('MOBILIA');
            setComodo('SALA');
            setNecessidade('ESSENCIAL');
            setFotoBase64(null);
        }
    }, [item, id]); 

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="headlineSmall" style={styles.title}>Cadastrar Item</Text>

            <TextInput label="Nome do Item" value={nome} onChangeText={setNome} mode="outlined" style={styles.input} />

            <TextInput label="Preço (R$)" value={preco} onChangeText={setPreco} keyboardType="numeric" mode="outlined" style={styles.input} />

            <Text style={styles.label}>Status</Text>
            <FormSelector
                value={comodo}
                options={COMODOS_ITEM}
                onSelect={setComodo}
            />

            <Text style={styles.label}>Tipo</Text>
            <FormSelector
                value={tipo}
                options={TIPOS_ITEM}
                onSelect={setTipo}
            />

            <Text style={styles.label}>Necessidade</Text>
            <FormSelector
                value={necessidade}
                options={NECESSIDADES_ITEM}
                onSelect={setNecessidade}
            />

            <View style={styles.photoSection}>
                {fotoBase64 && <Image source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }} style={styles.preview} />}
                <Button icon="camera" onPress={capturaFoto}>Capturar Foto</Button>
                <Button icon="image" onPress={escolherImagem}>Da Galeria</Button>
            </View>

            <Button
                mode="contained"
                onPress={handleSalvar}
                loading={isSaving}
                disabled={!nome || !preco}
            >
                {isEditando ? "Atualizar Item" : "Salvar na Minha Casa"}
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 20, gap: 10 },
    title: { marginBottom: 10, fontWeight: 'bold', color: '#007AFF' },
    input: { marginBottom: 5 },
    label: { marginTop: 10, fontWeight: 'bold' },
    chipGroup: { flexDirection: 'row', marginBottom: 10 },
    chip: { marginRight: 8 },
    photoSection: { alignItems: 'center', marginVertical: 15, gap: 10 },
    preview: { width: '100%', height: 200, borderRadius: 12 }
});
