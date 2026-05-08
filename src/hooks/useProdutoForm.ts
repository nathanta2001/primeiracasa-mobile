import { CATEGORIA_PRODUTO, CategoriaProduto, Produto, STATUS_PRODUTO, StatusProduto } from '@/src/types/Produto';
import { useCallback, useState } from 'react';

// padroes iniciais para os campos do formulário de produto
const DEFAULTS = {
    nome: '',
    status: 'EM_ESTOQUE' as StatusProduto,
    categoria: 'MERCEARIA' as CategoriaProduto,
    fotoBase64: null as string | null,
};

// interface para o payload do produto, definindo os tipos dos campos
interface ProdutoPayload {
    nome: string;
    status: StatusProduto;
    categoria: CategoriaProduto;
    fotoBase64: string | null;
    idLista: string;
}

// interface para as opções do hook useProdutoForm, definindo os tipos das funções de criação e atualização
interface UseProdutoFormOptions {
    idLista: string; // ID da lista à qual o produto pertence
    onCreate: (payload: ProdutoPayload) => void; // função para criar um novo produto
    onUpdate: (data: { id: string, payload: ProdutoPayload }) => void; // função para atualizar um produto existente
}

interface UseProdutoFormReturn {

    //estado do modal
    visivel: boolean; // indica se o formulário/modal está visível
    produtoEditando: Produto | null; // produto que está sendo editado 
    isEditando: boolean; // indica se o formulário está em modo de edição (true) ou criação (false)

    //campos do formulário
    nome: string; // nome do produto
    status: StatusProduto; // status do produto (EM_ESTOQUE, FALTANDO, COMPRADO)
    categoria: CategoriaProduto; // categoria do produto (MERCEARIA, HIGIENE, etc.)
    fotoBase64: string | null; // foto do produto em formato Base64

    //setters para os campos do formulário
    setNome: (nome: string) => void; // função para atualizar o nome do produto
    setStatus: (status: StatusProduto) => void; // função para atualizar o status do produto
    setCategoria: (categoria: CategoriaProduto) => void; // função para atualizar a categoria do produto
    setFotoBase64: (fotoBase64: string | null) => void; // função para atualizar a foto do produto

    //ações
    abrirCriacao: () => void; // função para abrir o formulário em modo de criação
    abrirEdicao: (produto: Produto) => void; // função para abrir o formulário em modo de edição
    fechar: () => void; // função para fechar o formulário/modal
    salvar: () => void; // função para salvar as alterações, seja criando um novo produto ou atualizando um existente

    // opções pra renderização dos selects
    opçoesStatus: typeof STATUS_PRODUTO; // opções de status disponíveis para o produto
    opçoesCategoria: typeof CATEGORIA_PRODUTO; // opções de categoria disponíveis para o produto

}


export function useProdutoForm({

    // ID da lista à qual o produto pertence, necessário para associar o produto à lista correta
    idLista,
    onCreate,
    onUpdate,

}: UseProdutoFormOptions): UseProdutoFormReturn {

    const [visivel, setVisivel] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

    const [nome, setNome] = useState(DEFAULTS.nome);
    const [status, setStatus] = useState<StatusProduto>(DEFAULTS.status);
    const [categoria, setCategoria] = useState<CategoriaProduto>(DEFAULTS.categoria);
    const [fotoBase64, setFotoBase64] = useState<string | null>(DEFAULTS.fotoBase64);

    const resetCampos = useCallback(() => {
        setNome(DEFAULTS.nome);
        setStatus(DEFAULTS.status);
        setCategoria(DEFAULTS.categoria);
        setFotoBase64(DEFAULTS.fotoBase64);
    }, []);

    const abrirCriacao = useCallback(() => {
        setProdutoEditando(null);
        resetCampos();
        setVisivel(true);
    }, [resetCampos]);

    const abrirEdicao = useCallback((produto: Produto) => {
        setProdutoEditando(produto);
        setNome(produto.nome);
        setStatus(produto.status);
        setCategoria(produto.categoria);
        setFotoBase64(produto.fotoBase64 || null);
        setVisivel(true);
    }, []);

    const fechar = useCallback(() => {
        setVisivel(false);
        setProdutoEditando(null);
        resetCampos();
    }, [resetCampos]);

    const salvar = useCallback(() => {
        const payload: ProdutoPayload = {
            nome,
            status,
            categoria,
            fotoBase64,
            idLista,
        };
        if (produtoEditando) {
            onUpdate({ id: produtoEditando.id, payload });
        } else {
            onCreate(payload);
        }
        fechar();
    }, [nome, status, categoria, fotoBase64, idLista, onCreate, onUpdate, produtoEditando, fechar]);

    return {
        visivel,
        produtoEditando,
        isEditando: produtoEditando !== null,

        nome,
        status,
        categoria,
        fotoBase64,

        setNome,
        setStatus,
        setCategoria,
        setFotoBase64,

        abrirCriacao,
        abrirEdicao,
        fechar,
        salvar,

        opçoesStatus: STATUS_PRODUTO,
        opçoesCategoria: CATEGORIA_PRODUTO,
    };

}
