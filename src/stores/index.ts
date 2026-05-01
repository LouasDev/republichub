import { create } from 'zustand';
import type { Republica, Morador, DespesaRecorrente, ListaCompras, Tarefa, Despesa, Aviso, Saldo, Meta, Notificacao, ItemCompra } from '@/types';
import { republica as seedRepublica, moradores as seedMoradores, despesasRecorrentes as seedDespesasRecorrentes, listasCompras as seedListasCompras, tarefasConcluidas as seedTarefas, despesasRecentes as seedDespesas, avisos as seedAvisos, meuSaldo as seedSaldo, notificacoes as seedNotificacoes, metas as seedMetas } from '@/mocks/seed';

interface RepublicaState {
  republica: Republica;
  moradores: Morador[];
  despesasRecorrentes: DespesaRecorrente[];
  listasCompras: ListaCompras[];
  tarefas: Tarefa[];
  despesas: Despesa[];
  avisos: Aviso[];
  saldo: Saldo;
  metas: Meta[];
  notificacoes: Notificacao[];
  setNotificacoes: (notificacoes: Notificacao[]) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  addListaCompras: (lista: ListaCompras) => void;
  addTarefa: (tarefa: Tarefa) => void;
  addDespesa: (despesa: Despesa) => void;
  addMeta: (meta: Meta) => void;
  addItemCompra: (listaId: string, item: ItemCompra) => void;
  toggleItemCompra: (listaId: string, itemId: string) => void;
  updateListaStatus: (listaId: string, status: ListaCompras['status']) => void;
}

export const useRepublicaStore = create<RepublicaState>((set) => ({
  republica: seedRepublica,
  moradores: seedMoradores,
  despesasRecorrentes: seedDespesasRecorrentes,
  listasCompras: seedListasCompras,
  tarefas: seedTarefas,
  despesas: seedDespesas,
  avisos: seedAvisos,
  saldo: seedSaldo,
  metas: seedMetas,
  notificacoes: seedNotificacoes,
  setNotificacoes: (notificacoes) => set({ notificacoes }),
  markAllNotificationsAsRead: () => set((state) => ({
    notificacoes: state.notificacoes.map(n => ({ ...n, lida: true }))
  })),
  deleteNotification: (id) => set((state) => ({
    notificacoes: state.notificacoes.filter(n => n.id !== id)
  })),
  addListaCompras: (lista) => set((state) => ({
    listasCompras: [...state.listasCompras, lista]
  })),
  addTarefa: (tarefa) => set((state) => ({
    tarefas: [...state.tarefas, tarefa]
  })),
  addDespesa: (despesa) => set((state) => ({
    despesas: [despesa, ...state.despesas]
  })),
  addMeta: (meta) => set((state) => ({
    metas: [...state.metas, meta]
  })),
  addItemCompra: (listaId, item) => set((state) => ({
    listasCompras: state.listasCompras.map(l =>
      l.id === listaId ? { ...l, itens: [...l.itens, item] } : l
    )
  })),
  toggleItemCompra: (listaId, itemId) => set((state) => ({
    listasCompras: state.listasCompras.map(l =>
      l.id === listaId ? {
        ...l,
        itens: l.itens.map(i => i.id === itemId ? { ...i, comprado: !i.comprado } : i)
      } : l
    )
  })),
  updateListaStatus: (listaId, status) => set((state) => ({
    listasCompras: state.listasCompras.map(l =>
      l.id === listaId ? { ...l, status } : l
    )
  })),
}));
