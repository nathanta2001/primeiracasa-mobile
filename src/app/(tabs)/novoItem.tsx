import { FormSelector } from "@/src/components/FormSelector";
import { itemCasaService } from "@/src/services/itemCasaService";
import { ComodoItem, COMODOS_ITEM, NecessidadeItem, NECESSIDADES_ITEM, TipoItem, TIPOS_ITEM } from "@/src/types/ItemCasa";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function NovoItem() {

    // hook para acessar o roteador e realizar redirecionamentos.
    const router = useRouter();

    // estado para controlar o carregamento durante a criação do item.
    const [carregando, setCarregando] = useState(false);

    // estados para controlar os campos do formulário.
    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState<TipoItem>('MOBILIA');
    const [comodo, setComodo] = useState<ComodoItem>('SALA');
    const [necessidade, setNecessidade] = useState<NecessidadeItem>('ESSENCIAL');
    const [preco, setPreco] = useState("");
    const [fotoBase64, setFotoBase64] = useState<string | null>(null);


    // função para salvar o item, enviando os dados para o backend.
    const salvar = async () => {
        try {
            setCarregando(true);
            await itemCasaService.criar({
                nome,
                preco: parseFloat(preco.replace(',', '.')),
                tipo,
                comodo,
                necessidade,
                fotoBase64: fotoBase64 || undefined // se não tiver foto, envia undefined para o backend
            });
            router.replace('/(tabs)/itens');
        } catch (error) {
            console.error("Erro ao salvar item", error);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="headlineSmall" style={styles.title}>Cadastrar Item</Text>

            <TextInput label="Nome do Item" value={nome} onChangeText={setNome} mode="outlined" style={styles.input} />

            <TextInput label="Preço (R$)" value={preco} onChangeText={setPreco} keyboardType="numeric" mode="outlined" style={styles.input} />

            <Text style={styles.label}>Cômodo</Text>
            <FormSelector
                label="Cômodo"
                value={comodo}
                options={COMODOS_ITEM}
                onSelect={setComodo}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipGroup}>
                {COMODOS_ITEM.map((c) => (
                    <Button key={c} mode={comodo === c ? "contained" : "outlined"} onPress={() => setComodo(c)} style={styles.chip}>
                        {c}
                    </Button>
                ))}
            </ScrollView>

            <Text style={styles.label}>Tipo de Item</Text>
            <FormSelector
                label="Tipo de Item"
                value={tipo}
                options={TIPOS_ITEM}
                onSelect={setTipo}
            />

            <Text style={styles.label}>Necessidade</Text>
            <FormSelector
                label="Necessidade"
                value={necessidade}
                options={NECESSIDADES_ITEM}
                onSelect={setNecessidade}
            />

            <View style={styles.photoSection}>
                {fotoBase64 && <Image source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }} style={styles.preview} />}
                <Button icon="camera" mode="contained-tonal" onPress={async () => {
                    let res = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.5 });
                    if (!res.canceled) setFotoBase64(res.assets[0].base64!);
                }}>Capturar Foto</Button>
            </View>

            <Button mode="contained" onPress={salvar} loading={carregando} disabled={!nome || !preco}>
                Salvar na Minha Casa
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
