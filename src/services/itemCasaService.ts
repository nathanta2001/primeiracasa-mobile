import api from "./api";
import { type ItemCasa, type ItemCasaFiltros, type ItemCasaRequest } from "../types/ItemCasa";

export const itemCasaService = {

    listarTodos: async (): Promise<ItemCasa[]> => {
        const { data } = await api.get<ItemCasa[]>('/itens');
        return data;
    },

    buscarPorId: async (id: string): Promise<ItemCasa> => {
        const { data } = await api.get<ItemCasa>(`/itens/${id}`);
        return data;
    },

    filtrar: async (filtros: ItemCasaFiltros): Promise<ItemCasa[]> => {
        const { data } = await api.get<ItemCasa[]>('/itens/filtrar', { params: filtros });
        return data;
    },

    criar: async (item: ItemCasaRequest): Promise<ItemCasa> => {
        const { data } = await api.post<ItemCasa>('/itens', item);
        return data;
    },

    atualizar: async (id: string, item: ItemCasaRequest): Promise<ItemCasa> => {
        const { data } = await api.put<ItemCasa>(`/itens/${id}`, item);
        return data;
    },

    atualizarFoto: async (id: string, fotoBase64: string): Promise<ItemCasa> => {
        await api.patch(`/itens/${id}/foto`, { foto: fotoBase64 }); 
        const { data } = await api.get<ItemCasa>(`/itens/${id}`);
        return data;
    },

    deletar: async (id: string): Promise<void> => {
        await api.delete(`/itens/${id}`);
    }

}