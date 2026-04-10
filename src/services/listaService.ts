import api from "./api";
import { type Lista, type ListaRequest } from "../types/Lista";

export const listaService = {

    listarTodos: async (): Promise<Lista[]> => {
        const { data } = await api.get<Lista[]>('/listas');
        return data;
    },

    buscarPorId: async (id: string): Promise<Lista> => {
        const { data } = await api.get<Lista>(`/listas/${id}`);
        return data;
    },

    criar: async (lista: ListaRequest): Promise<Lista> => {
        const { data } = await api.post<Lista>('/listas', lista);
        return data;
    },

    atualizar: async (id: string, lista: ListaRequest): Promise<Lista> => {
        const { data } = await api.put<Lista>(`/listas/${id}`, lista);
        return data;
    },

    deletar: async (id: string): Promise<void> => {
        await api.delete(`/listas/${id}`);
    }

}