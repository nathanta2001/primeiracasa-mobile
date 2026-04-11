import { type Produto, type ProdutoRequest } from "../types/Produto";
import api from "./api";


// O serviço de produtos é responsável por fazer as requisições à API relacionadas aos produtos.
export const produtoService = {

    // Função para listar todos os produtos.
    listarTodos: async (): Promise<Produto[]> => {
        const { data } = await api.get<Produto[]>('/produtos');
        return data;
    },

    // Função para buscar um produto por ID.
    buscarPorId: async (id: string): Promise<Produto> => {
        const { data } = await api.get<Produto>(`/produtos/${id}`);
        return data;
    },

    // Função para criar um novo produto.
    criar: async (produto: ProdutoRequest): Promise<Produto> => {
        const { data } = await api.post<Produto>('/produtos', produto);
        return data;
    },

    // Função para atualizar um produto existente.
    atualizar: async (id: string, produto: ProdutoRequest): Promise<Produto> => {
        const { data } = await api.put<Produto>(`/produtos/${id}`, produto);
        return data;
    },

    // Função para atualizar a foto de um produto.
    atualizarFoto: async (id: string, fotoBase64: string): Promise<Produto> => {
        await api.patch(`/produtos/${id}/foto`, { foto: fotoBase64 }); 
        const { data } = await api.get<Produto>(`/produtos/${id}`);
        return data;
    },

    // Função para deletar um produto.
    deletar: async (id: string): Promise<void> => {
        await api.delete(`/produtos/${id}`);
    }

}