import { itemCasaService } from "@/src/services/itemCasaService";
import { ItemCasa } from "@/src/types/ItemCasa";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Card } from "react-native-paper";



export default function HomeScreen() {

    const [itens, setItens] = useState<ItemCasa[]>([]);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        carregarItens();
    }, []);

    const carregarItens = async () => {
        try {
            setCarregando(true);
            const response = await itemCasaService.listarTodos();
            setItens(response);
        } catch (error) {
            console.error(error);
        } finally {
            setCarregando(false);
        }
    };

    const ultimosItens = itens.slice(-4).reverse();

    const handleDeletar = async (id: string) => {
        try {
            await itemCasaService.deletar(id);

            console.log("Item removido com sucesso!");
            carregarItens(); // Recarrega a lista após deletar
        } catch (error) {
            console.error("Erro ao remover item.");
        }

    };

    const handleEditarItem = (id: string) => {
        // Navega para a página de itens passando o ID no state para abrir o modal de edição
        router.navigate({ pathname: '/itens', params: { openEditModalId: id } });
    }

    return (
        <View>
            <title aria-level={2}>
                Minha Primeira Casa
            </title>

            {/* Dashboard de Estatísticas */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Card>
                        <Text style={{ fontWeight: 'bold' }}>Total de Itens</Text>
                        <Text style={{ fontSize: 24 }}>{itens.length}</Text>
                    </Card>
                </View>
            </View>
        </View>
    );

}
