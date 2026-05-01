import { itemCasaService } from "@/src/services/itemCasaService";
import { ComodoItem, NecessidadeItem, NECESSIDADES_ITEM, TipoItem } from "@/src/types/ItemCasa";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";

export default function NovoItem() {

    // hook para acessar o roteador e realizar redirecionamentos.
    const router = useRouter();

    // estado para controlar o carregamento durante a criação do item.
    const [loading, setLoading] = useState(false);

    // estados para controlar os campos do formulário.
    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState<TipoItem>('MOBILIA');
    const [comodo, setComodo] = useState<ComodoItem>('SALA');
    const [necessidade, setNecessidade] = useState<NecessidadeItem>('ESSENCIAL');
    const [preco, setPreco] = useState("");
    const [fotoBase64, setFotoBase64] = useState<string | null>(null);

    //função para escolher ou tirar um foto.
    const escolherImagem = async () => {

        // solicita permissão para acessar a câmera.
        const resultado = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images', // só permite imagens
            allowsEditing: true, // permite editar a imagem (cortar, etc.)
            aspect: [4, 3], // proporção da imagem
            quality: 0.5, // Qualidade reduzida 
            base64: true, // retorna a imagem em base64 para facilitar o envio ao backend
        });

        // se o usuário não cancelou e a imagem foi capturada, armazena a imagem em base64 no estado.
        if (!resultado.canceled && resultado.assets[0].base64) {
            setFotoBase64(resultado.assets[0].base64);
        }
    };

    // função para salvar o item, enviando os dados para o backend.
    const salvar = async () => {
        try {
            setLoading(true);
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
            setLoading(false);
        }
    };

    return (    
        
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="headlineSmall" style={styles.title}>Novo Item para Casa</Text>

            // campo de texto para o nome do item.
            <TextInput
                label="Nome do Item"
                value={nome}
                onChangeText={setNome}
                mode="outlined"
                style={styles.input}
            />
            
            // campo de texto para o preço estimado do item, com teclado numérico.
            <TextInput
                label="Preço Estimado (R$)"
                value={preco}
                onChangeText={setPreco}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
            />

            // seleção do cômodo onde o item será usado.
            <Text style={styles.label}>Necessidade</Text>
            <SegmentedButtons
                value={necessidade}
                onValueChange={value => setNecessidade(value as NecessidadeItem)}
                buttons={NECESSIDADES_ITEM.map(n => ({ value: n, label: n }))}
            />
            
            // seleção do tipo do item (mobiliário, eletrodoméstico, etc.)
            <View style={styles.photoSection}>
                {fotoBase64 ? (
                    <Image source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }} style={styles.preview} />
                ) : (
                    <View style={styles.placeholder}><Text>Sem foto</Text></View>
                )}
                // botão para escolher da galeria ou tirar uma foto do item.
                <Button
                    icon="camera"
                    mode="outlined"
                    onPress={escolherImagem}
                >
                    Tirar Foto
                </Button>
            </View>
            
            // botão para salvar o item
            // fica desabilitado se estiver carregando ou se o nome estiver vazio.
            <Button
                mode="contained"
                onPress={salvar}
                loading={loading}
                disabled={loading || !nome}
                style={styles.saveButton}
            >
                Salvar Item
            </Button>
        </ScrollView>
    );
}

// estilos para a tela de criação de item.
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 20 },
    title: { marginBottom: 20, fontWeight: 'bold' },
    input: { marginBottom: 15 },
    label: { marginTop: 10, marginBottom: 8, fontWeight: '500' },
    photoSection: { alignItems: 'center', marginVertical: 20, gap: 10 },
    preview: { width: 200, height: 150, borderRadius: 8 },
    placeholder: { width: 200, height: 150, backgroundColor: '#eee', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    saveButton: { marginTop: 20, paddingVertical: 8 }
});
