import { itemCasaService } from '@/src/services/itemCasaService';
import { ComodoItem, NecessidadeItem, TipoItem } from '@/src/types/ItemCasa';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

// Espelha os query params que o backend aceita via Spring Specifications
export interface ItemFiltros {
    tipo?: TipoItem | null;
    comodo?: ComodoItem | null;
    necessidade?: NecessidadeItem | null;
    nome?: string | null;
}

// Retorna apenas os filtros que têm valor
const limparFiltros = (f: ItemFiltros): Record<string, string> =>
    Object.fromEntries(
        Object.entries(f).filter(([, v]) => v !== null && v !== undefined && v !== '')
    ) as Record<string, string>;

export function useItemFiltro() {
    const [filtros, setFiltros] = useState<ItemFiltros>({});
    const [busca, setBusca] = useState('');

    const query = useQuery({
        // A query re-executa automaticamente sempre que filtros ou busca mudam
        queryKey: ['itens', filtros, busca],
        queryFn: () => {
            const params = limparFiltros({ ...filtros, nome: busca || null });
            // Se não há filtros ativos, usa o endpoint padrão
            return Object.keys(params).length > 0
                ? itemCasaService.filtrar(params)
                : itemCasaService.listarTodos();
        },
        staleTime: 1000 * 30, // 30s de cache
    });

    // Atualiza um filtro específico mantendo os outros intactos
    const setFiltro = useCallback(<K extends keyof ItemFiltros>(
        chave: K,
        valor: ItemFiltros[K]
    ) => {
        setFiltros(prev => ({ ...prev, [chave]: valor }));
    }, []);

    // Toggle: se já está ativo, remove; senão, aplica
    const toggleFiltro = useCallback(<K extends keyof ItemFiltros>(
        chave: K,
        valor: ItemFiltros[K]
    ) => {
        setFiltros(prev => ({
            ...prev,
            [chave]: prev[chave] === valor ? null : valor,
        }));
    }, []);

    // Limpa todos os filtros e a busca
    const limpar = useCallback(() => {
        setFiltros({});
        setBusca('');
    }, []);

    // Indica se algum filtro ou busca está ativo para mostrar o botão de limpar
    const temFiltroAtivo = Object.values(filtros).some(v => v !== null && v !== undefined)
        || busca.length > 0;

    return {
        ...query,
        filtros,
        busca,
        setBusca,
        setFiltro,
        toggleFiltro,
        limpar,
        temFiltroAtivo,
    };
}