
// Lista de categorias para os produtos
export const CATEGORIA_PRODUTO = [
    "MERCEARIA",
    "HORTIFRUTI",
    "ACOUGUE",
    "LATICINIOS",
    "PADARIA",
    "BEBIDAS",
    "HIGIENE",
    "LIMPEZA",
    "PET_SHOP",
    "CONGELADOS",
    "GRAOS_E_CEREAIS",
    "UTILITARIOS",
    "OUTROS",
] as const;

// Status do produto
export const STATUS_PRODUTO = [
    "EM_ESTOQUE",
    "ACABANDO",
    "ESGOTADO"
] as const;

export type StatusProduto = typeof STATUS_PRODUTO[number];
export type CategoriaProduto = typeof CATEGORIA_PRODUTO[number];

// Interface para representar um produto
export interface Produto {
    id: string;
    nome: string;
    preco: number;
    categoria: CategoriaProduto;
    status: StatusProduto; 
    idLista: string;   
    fotoBase64?: string; // Campo opcional para armazenar a foto em Base64
}

// Interface para representar os dados necessários para criar ou atualizar um produto
export interface ProdutoRequest {
    nome: string;
    preco: number;
    categoria: CategoriaProduto;
    status: StatusProduto;
    idLista: string;      
    fotoBase64?: string; // Campo opcional para armazenar a foto em Base64
}


