
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Vibration } from 'react-native';
import { itemCasaService } from '../services/itemCasaService';
import { listaService } from '../services/listaService';
import { produtoService } from '../services/produtoService';


// --- HOOKS DE ITENS DA CASA ---
export function useItem(id?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: id ? ['item', id] : ['itens'],
    queryFn: async () => id ? [await itemCasaService.buscarPorId(id)] : itemCasaService.listarTodos(),
    enabled: id !== 'novo',
  });

  const criar = useMutation({
    mutationFn: itemCasaService.criar,
    onSuccess: () => {
      Vibration.vibrate(50);
      queryClient.invalidateQueries({ queryKey: ['itens'] });
    },
  });

  const atualizar = useMutation({
    mutationFn: (data: { id: string; item: any }) => itemCasaService.atualizar(data.id, data.item),
    onSuccess: () => {
      Vibration.vibrate(50);
      queryClient.invalidateQueries({ queryKey: ['itens'] });
    },
  });

  const deletar = useMutation({
    mutationFn: itemCasaService.deletar,
    onSuccess: () => {
      Vibration.vibrate(100);
      queryClient.invalidateQueries({ queryKey: ['itens'] });
    },
  });

  return { ...query, criar: criar.mutate, atualizar: atualizar.mutate, deletar: deletar.mutate, isSaving: criar.isPending || atualizar.isPending };
}

// --- HOOKS DE LISTAS ---
export function useLista() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['listas'],
    queryFn: listaService.listarTodos
  });

  const criar = useMutation({
    mutationFn: listaService.criar,
    onSuccess: () => {
      Vibration.vibrate(50);
      queryClient.invalidateQueries({ queryKey: ['listas'] });
    },
  });

  const deletar = useMutation({
    mutationFn: listaService.deletar,
    onSuccess: () => {
      Vibration.vibrate(100);
      queryClient.invalidateQueries({ queryKey: ['listas'] });
    },
  });

  return { ...query, criar: criar.mutate, deletar: deletar.mutate, isSaving: criar.isPending };
}

// --- HOOKS DE PRODUTOS ---
export function useProduto(listaId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['produtos', listaId],
    queryFn: async () => {
        const res = await produtoService.listarTodos();
        return res.filter(p => p.idLista === listaId);
    },
    enabled: !!listaId
  });

  const criar = useMutation({
    mutationFn: produtoService.criar,
    onSuccess: () => {
      Vibration.vibrate(50);
      queryClient.invalidateQueries({ queryKey: ['produtos', listaId] });
    },
  });

  const atualizar = useMutation({
    mutationFn: (data: { id: string; produto: any }) => produtoService.atualizar(data.id, data.produto),
    onSuccess: () => {
      Vibration.vibrate(50);
      queryClient.invalidateQueries({ queryKey: ['produtos', listaId] });
    },
  });

  const deletar = useMutation({
    mutationFn: produtoService.deletar,
    onSuccess: () => {
      Vibration.vibrate(100);
      queryClient.invalidateQueries({ queryKey: ['produtos', listaId] });
    },
  });

  return { ...query, criar: criar.mutate, atualizar: atualizar.mutate, deletar: deletar.mutate, isSaving: criar.isPending || atualizar.isPending };
}