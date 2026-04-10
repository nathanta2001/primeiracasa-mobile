import api from "./api";
import { type Produto, type ProdutoRequest } from "../types/Produto";

export const produtoService = {

    listarTodos: async (): Promise<Produto[]> => {
        const { data } = await api.get<Produto[]>('/produtos');
        return data;
    },

    buscarPorId: async (id: string): Promise<Produto> => {
        const { data } = await api.get<Produto>(`/produtos/${id}`);
        return data;
    },

    criar: async (produto: ProdutoRequest): Promise<Produto> => {
        const { data } = await api.post<Produto>('/produtos', produto);
        return data;
    },

    atualizar: async (id: string, produto: ProdutoRequest): Promise<Produto> => {
        const { data } = await api.put<Produto>(`/produtos/${id}`, produto);
        return data;
    },

    atualizarFoto: async (id: string, fotoBase64: string): Promise<Produto> => {
        await api.patch(`/produtos/${id}/foto`, { foto: fotoBase64 }); 
        const { data } = await api.get<Produto>(`/produtos/${id}`);
        return data;
    },


    deletar: async (id: string): Promise<void> => {
        await api.delete(`/produtos/${id}`);
    }

}