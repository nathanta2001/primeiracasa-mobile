export const TIPOS_ITEM = [
    'MOBILIA',
    'UTENSILIO',
    'ELETRODOMESTICO',
    'ELETRONICO'
] as const;

export const NECESSIDADES_ITEM = [
    'ESSENCIAL',
    'DESEJAVEL',
    'OPCIONAL'
] as const;

export const COMODOS_ITEM = [
    'COZINHA',
    'QUARTO',
    'SALA',
    'BANHEIRO',
    'AREA_DE_SERVICO',
    'COPA',
    'QUINTAL',
    'JARDIM',
    'GARAGEM',
    'OUTROS'
] as const;

export type TipoItem = typeof TIPOS_ITEM[number];
export type NecessidadeItem = typeof NECESSIDADES_ITEM[number];
export type ComodoItem = typeof COMODOS_ITEM[number];


export interface ItemCasa {
    id: string;
    nome: string;
    preco: number;
    tipo: TipoItem;
    necessidade: NecessidadeItem;
    comodo: ComodoItem;
    fotoBase64?: string; // Campo opcional para armazenar a foto em Base64
}

export interface ItemCasaRequest {
    nome: string;
    preco: number;
    tipo: TipoItem;
    necessidade: NecessidadeItem;
    comodo: ComodoItem;
    fotoBase64?: string; // Campo opcional para armazenar a foto em Base64
}

export interface ItemCasaFiltros {
    nome?: string;
    tipo?: TipoItem;
    necessidade?: NecessidadeItem;
    comodo?: ComodoItem;
    precoMin?: number;
    precoMax?: number;
}


