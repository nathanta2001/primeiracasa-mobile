
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Vibration } from 'react-native';
import { itemCasaService } from '../services/itemCasaService';
import { listaService } from '../services/listaService';
import { produtoService } from '../services/produtoService';
import { ItemCasa } from '../types/ItemCasa';
import { Lista } from '../types/Lista';
import { Produto } from '../types/Produto';
import { useNotifications } from './useNotifications';


// --- HOOKS DE ITENS DA CASA ---
export function useItem(id?: string) {
  const queryClient = useQueryClient();
  const { agendarNotificacion } = useNotifications();

  const query = useQuery({
    queryKey: id ? ['item', id] : ['itens'],
    queryFn: async () => id ? [await itemCasaService.buscarPorId(id)] : itemCasaService.listarTodos(),
    enabled: id !== 'novo',
  });

  const invalidarTudo = () => {
    queryClient.invalidateQueries({ queryKey: ['itens'] }); // Filtros e Listas
    queryClient.invalidateQueries({ queryKey: ['item'] });  // Detalhes individuais
  };

  const criar = useMutation({
    mutationFn: itemCasaService.criar,
    onSuccess: (data) => {
      Vibration.vibrate(50);
      agendarNotificacion("Novo Item", `${data.nome} foi adicionado à sua casa!`);
      invalidarTudo();
    },
  });

  const atualizar = useMutation({
    mutationFn: (data: { id: string; item: any }) => itemCasaService.atualizar(data.id, data.item),
    onSuccess: (variables) => {
      Vibration.vibrate(50);
      invalidarTudo();
      queryClient.invalidateQueries({ queryKey: ['item', variables.id] });
    },
  });

  const deletar = useMutation({
    mutationFn: itemCasaService.deletar,
    
    onMutate: async (idItem) => {

      // Cancela refetchs de saída para evitar sobrescrever o estado otimista
      await queryClient.cancelQueries({ queryKey: ['itens'] });

      // Salva o snapshot do estado anterior
      const previousItens = queryClient.getQueryData<ItemCasa[]>(['itens']);

      // remove o item do cache local imediatamente
      queryClient.setQueryData(['itens'], (old: ItemCasa[] | undefined) =>
        old?.filter((item) => item.id !== idItem)
      );

      // Retorna o contexto com o valor anterior
      return { previousItens };
    },

    // se a mutação falhar 
    onError: (err, idItem, context) => {
      queryClient.setQueryData(['itens'], context?.previousItens);
      Alert.alert("Erro", "Não foi possível deletar o item. Tente novamente.");
    },

    // Sempre invalidar após sucesso ou erro para sincronizar com o server
    onSettled: () => {
      invalidarTudo();
    },
    onSuccess: () => {
      Vibration.vibrate(100);
      agendarNotificacion("Item Deletado com Sucesso", "O item foi removido da sua casa!");
    },
  });

  return { ...query, criar: criar.mutate, atualizar: atualizar.mutate, deletar: deletar.mutate, isSaving: criar.isPending || atualizar.isPending || deletar.isPending };
}

// --- HOOKS DE LISTAS ---
export function useLista() {
  const queryClient = useQueryClient();
  const { agendarNotificacion } = useNotifications();

  const query = useQuery({
    queryKey: ['listas'],
    queryFn: listaService.listarTodos
  });

  const criar = useMutation({
    mutationFn: listaService.criar,
    onSuccess: (data) => {
      Vibration.vibrate(50);
      agendarNotificacion("Nova Lista Criada", `${data.nome} foi criada com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['listas'] });
    },
  });

  const deletar = useMutation({
    mutationFn: listaService.deletar,
    onMutate: async (idLista) => {

      // Cancela refetchs de saída para evitar sobrescrever o estado otimista
      await queryClient.cancelQueries({ queryKey: ['listas'] });

      // Salva o snapshot do estado anterior
      const previousListas = queryClient.getQueryData<Lista[]>(['listas']);

      // remove a lista do cache local imediatamente
      queryClient.setQueryData(['listas'], (old: Lista[] | undefined) =>
        old?.filter((lista) => lista.id !== idLista)
      );

      // Retorna o contexto com o valor anterior
      return { previousListas };
    },

    // se a mutação falhar 
    onError: (err, idLista, context) => {
      queryClient.setQueryData(['listas'], context?.previousListas);
      Alert.alert("Erro", "Não foi possível deletar a lista. Tente novamente.");
    },

    // Sempre invalidar após sucesso ou erro para sincronizar com o server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['listas'] });
    },
    onSuccess: () => {
      Vibration.vibrate(100);
      agendarNotificacion("Lista Deletada", `A lista foi removida com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['listas'] });
    },
  });

  return { ...query, criar: criar.mutate, deletar: deletar.mutate, isSaving: criar.isPending };
}

// --- HOOKS DE PRODUTOS ---
export function useProduto(listaId: string) {
  const queryClient = useQueryClient();
  const { agendarNotificacion } = useNotifications();

  const query = useQuery({
    queryKey: ['produtos', listaId],
    queryFn: async () => {
      const res = await produtoService.listarTodos();
      return res.filter(p => p.idLista === listaId);
    },
    enabled: !!listaId
  });

  const invalidarComListas = () => {
    queryClient.invalidateQueries({ queryKey: ['produtos'] });
    queryClient.invalidateQueries({ queryKey: ['listas'] }); // Atualiza contadores na tela de listas
  };

  const criar = useMutation({
    mutationFn: produtoService.criar,
    onSuccess: (data) => {
      Vibration.vibrate(50);
      agendarNotificacion("Novo Produto", `${data.nome} foi adicionado à lista!`);
      invalidarComListas();
    },
  });

  const atualizar = useMutation({
    mutationFn: (data: { id: string; produto: any }) => produtoService.atualizar(data.id, data.produto),
    onSuccess: (produtoAtualizado) => {
      Vibration.vibrate(50);
      if (produtoAtualizado.status === 'ESGOTADO') {
        agendarNotificacion("Produto Esgotou!", `O item ${produtoAtualizado.nome} acabou.`);
      }
      invalidarComListas();
    },
  });

  const deletar = useMutation({
    mutationFn: produtoService.deletar,
    onMutate: async (idProduto) => {

      // Cancela refetchs de saída para evitar sobrescrever o estado otimista
      await queryClient.cancelQueries({ queryKey: ['produtos'] });

      // Salva o snapshot do estado anterior
      const previousProdutos = queryClient.getQueryData<Produto[]>(['produtos', listaId]);

      // remove o item do cache local imediatamente
      queryClient.setQueryData(['produtos', listaId], (old: Produto[] | undefined) =>
        old?.filter((produto) => produto.id !== idProduto)
      );

      // Retorna o contexto com o valor anterior
      return { previousProdutos };
    },

    // se a mutação falhar 
    onError: (err, idItem, context) => {
      queryClient.setQueryData(['produtos', listaId], context?.previousProdutos);
      Alert.alert("Erro", "Não foi possível deletar o item. Tente novamente.");
    },

    // Sempre invalidar após sucesso ou erro para sincronizar com o server
    onSettled: () => {
      invalidarComListas();
    },
    onSuccess: () => {
      Vibration.vibrate(100);
      agendarNotificacion("Produto Deletado", "O produto foi removido da lista!");
      invalidarComListas();
    },
  });

  return { ...query, criar: criar.mutate, atualizar: atualizar.mutate, deletar: deletar.mutate, isSaving: criar.isPending || atualizar.isPending };
}