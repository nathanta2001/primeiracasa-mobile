import { type ItemCasa, type ItemCasaFiltros, type ItemCasaRequest } from "../types/ItemCasa";
import api from "./api";

// Serviço para gerenciar os itens de casa, incluindo operações de CRUD e filtragem
export const itemCasaService = {

    // Lista todos os itens de casa  
    listarTodos: async (): Promise<ItemCasa[]> => {
        const { data } = await api.get<ItemCasa[]>('/itens');
        return data;
    },

    // Busca um item de casa por ID
    buscarPorId: async (id: string): Promise<ItemCasa> => {
        const { data } = await api.get<ItemCasa>(`/itens/${id}`);
        return data;
    },

    // Filtra os itens de casa com base nos critérios fornecidos
    filtrar: async (filtros: ItemCasaFiltros): Promise<ItemCasa[]> => {
        const { data } = await api.get<ItemCasa[]>('/itens/filtrar', { params: filtros });
        return data;
    },

    // Cria um novo item de casa
    criar: async (item: ItemCasaRequest): Promise<ItemCasa> => {
        const { data } = await api.post<ItemCasa>('/itens', item);
        return data;
    },

    // Atualiza um item de casa existente
    atualizar: async (id: string, item: ItemCasaRequest): Promise<ItemCasa> => {
        const { data } = await api.put<ItemCasa>(`/itens/${id}`, item);
        return data;
    },

    // Atualiza a foto de um item de casa
    atualizarFoto: async (id: string, fotoBase64: string): Promise<ItemCasa> => {
        await api.patch(`/itens/${id}/foto`, { foto: fotoBase64 }); 
        const { data } = await api.get<ItemCasa>(`/itens/${id}`);
        return data;
    },

    // Deleta um item de casa por ID
    deletar: async (id: string): Promise<void> => {
        await api.delete(`/itens/${id}`);
    }

}