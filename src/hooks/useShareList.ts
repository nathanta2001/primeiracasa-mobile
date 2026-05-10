import { Alert, Share } from 'react-native';
import { Lista } from '../types/Lista';
import { Produto } from '../types/Produto';
import { useLista } from './useDataHooks';

export function useShareList() {

    // Obter as listas usando o hook useLista
    const { data: listas } = useLista();

    const compartilharTexto = async (produtos: Produto[]) => {

        // Verificar se há produtos para compartilhar
        if (produtos.length === 0) return;

        // Tenta compartilhar a lista
        try {

            // Obter o nome da lista a partir do ID do produto
            const idDaLista = produtos[0]?.idLista;

            // Encontrar a lista correspondente e obter seu nome
            const nomeLista = listas!.find((l: Lista) => l.id === idDaLista)?.nome ?? "Minha Lista";

            // Formatar os produtos para o formato desejado
            const formatados = produtos
                .map((p) => `- ${p.nome} (${p.status.replace(/_/g, ' ')})`)
                .join('\n');

                const mensagem = `Minha Lista: ${nomeLista}\n\n${formatados}`;

                await Share.share({
                    message: mensagem,
                    title: `Lista: ${nomeLista}`,
                });

        } catch (error) {
            Alert.alert('Error', 'Não foi possível compartilhar a lista.');
        }
    };

    return { compartilharTexto };

}