
// Interface para representar uma lista de compras
export interface Lista {
    id: string;
    nome: string;
}

// Interface para representar os dados necessários para criar ou atualizar uma lista de compras
export interface ListaRequest {
    nome: string;
}

