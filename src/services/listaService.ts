import { type Lista, type ListaRequest } from "../types/Lista";
import api from "./api";

// Serviço para interagir com a API de listas
export const listaService = {

    // Função para listar todas as listas
    listarTodos: async (): Promise<Lista[]> => {
        const { data } = await api.get<Lista[]>('/listas');
        return data;
    },

    // Função para buscar uma lista por ID
    buscarPorId: async (id: string): Promise<Lista> => {
        const { data } = await api.get<Lista>(`/listas/${id}`);
        return data;
    },

    // Função para criar uma nova lista
    criar: async (lista: ListaRequest): Promise<Lista> => {
        const { data } = await api.post<Lista>('/listas', lista);
        return data;
    },

    // Função para atualizar uma lista existente
    atualizar: async (id: string, lista: ListaRequest): Promise<Lista> => {
        const { data } = await api.put<Lista>(`/listas/${id}`, lista);
        return data;
    },
    
    // Função para deletar uma lista por ID
    deletar: async (id: string): Promise<void> => {
        await api.delete(`/listas/${id}`);
    }

}