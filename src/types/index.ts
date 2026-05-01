export interface Republica {
  id: string;
  nome: string;
  endereco: string;
  codigoConvite: string;
}

export interface Morador {
  id: string;
  nome: string;
  email: string;
  score: number;
  taxa: number;
  avatarColor: string;
  isMe?: boolean;
  pendentes?: number;
  concluidas?: number;
  liberadas?: number;
  creditoTarefas?: number;
  debitoTarefas?: number;
  saldoFinanceiro?: number;
  falhadas?: number;
}

export interface DespesaRecorrente {
  id: string;
  titulo: string;
  valor: number;
  frequencia: string;
  recebedorId: string;
  proximaData: string;
  semDebitosTarefas?: boolean;
}

export interface ItemCompra {
  id: string;
  nome: string;
  quantidade: number;
  valor?: number;
  comprado: boolean;
  adicionadoPorId: string;
}

export interface ListaCompras {
  id: string;
  nome: string;
  status: 'ativa' | 'em_compras' | 'finalizada';
  responsavelId?: string;
  itens: ItemCompra[];
}

export interface Tarefa {
  id: string;
  titulo: string;
  pe: number;
  responsavelId: string;
  prazo: string;
  concluidaEm?: string;
  status: 'pendente' | 'concluida' | 'disponivel';
}

export interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  valorAlvo: number;
  valorAtual: number;
  status: 'ativa' | 'concluida' | 'arquivada';
  criadaEm: string;
}

export interface Despesa {
  id: string;
  titulo: string;
  pagadorId: string;
  valor: number;
  data: string;
  categoria?: string;
}

export interface Aviso {
  id: string;
  titulo: string;
  conteudo: string;
  autorId: string;
  fixado: boolean;
  data: string;
}

export interface Notificacao {
  id: string;
  tipo: 'pagamento_confirmado' | 'pagamento_registrado' | 'nova_despesa' | 'nova_tarefa_atribuida' | 'tarefa_urgente' | 'compras_iniciadas' | 'compras_finalizadas' | 'novo_aviso';
  titulo: string;
  descricao: string;
  data: string;
  lida: boolean;
}

export interface Saldo {
  aReceber: number;
  voceDeve: number;
  teDevem: number;
}
