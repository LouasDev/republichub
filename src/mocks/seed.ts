import type { Republica, Morador, DespesaRecorrente, ListaCompras, Tarefa, Despesa, Aviso, Notificacao, Saldo, Meta } from '@/types';

export const republica: Republica = {
  id: "rep-1",
  nome: "ATHENAS",
  endereco: "Rua Sebastião Lucas, 205",
  codigoConvite: "LF6KV5",
};

export const moradores: Morador[] = [
  { id: "u1", nome: "Marco A.", email: "mdeoliveirajascolka@gmail.com", score: 105.4, taxa: 0.6, avatarColor: "red", pendentes: 0, concluidas: 6, liberadas: 1, creditoTarefas: 0, debitoTarefas: 12.80, saldoFinanceiro: 0.00, falhadas: 1 },
  { id: "u2", nome: "Luis Otávio Fonseca", email: "luisotavioduraesfonseca@gmail.com", score: 106, taxa: 0, avatarColor: "gray", pendentes: 0, concluidas: 2, liberadas: 0, creditoTarefas: 0, debitoTarefas: 0, saldoFinanceiro: -23.39, falhadas: 0 },
  { id: "u3", nome: "Ithalo Pimentel", email: "claudeclaudao@gmail.com", score: 112.9, taxa: 0, avatarColor: "lightgray", isMe: true, pendentes: 0, concluidas: 5, liberadas: 0, creditoTarefas: 0, debitoTarefas: 0, saldoFinanceiro: 12.88, falhadas: 0 },
  { id: "u4", nome: "Gustavo Luis", email: "gustavoluismarinho@gmail.com", score: 110, taxa: 0, avatarColor: "black", pendentes: 0, concluidas: 4, liberadas: 0, creditoTarefas: 0, debitoTarefas: 0, saldoFinanceiro: 0.00, falhadas: 0 },
  { id: "u5", nome: "Renato Monteiro", email: "renaatomonteiro@gmail.com", score: 103, taxa: 0, avatarColor: "darkgray", pendentes: 0, concluidas: 1, liberadas: 0, creditoTarefas: 0, debitoTarefas: 0, saldoFinanceiro: -5.60, falhadas: 0 },
];

export const despesasRecorrentes: DespesaRecorrente[] = [
  { id: "dr1", titulo: "Aluguel", valor: 1800, frequencia: "mensal", recebedorId: "u3", proximaData: "2026-05-10", semDebitosTarefas: true },
  { id: "dr2", titulo: "Internet", valor: 80, frequencia: "mensal", recebedorId: "u3", proximaData: "2026-05-01", semDebitosTarefas: true },
];

export const listasCompras: ListaCompras[] = [
  { id: "lc1", nome: "Feira", status: "ativa", itens: [] },
  {
    id: "lc2",
    nome: "Mercado",
    status: "em_compras",
    responsavelId: "u2",
    itens: [
      { id: "i1", nome: "Arroz 5kg", quantidade: 1, valor: 22.90, comprado: true, adicionadoPorId: "u3" },
      { id: "i2", nome: "Feijão 1kg", quantidade: 2, valor: 8.50, comprado: true, adicionadoPorId: "u4" },
      { id: "i3", nome: "Leite 1L", quantidade: 6, valor: 5.99, comprado: false, adicionadoPorId: "u3" },
      { id: "i4", nome: "Café 500g", quantidade: 1, valor: 18.90, comprado: false, adicionadoPorId: "u5" },
      { id: "i5", nome: "Açúcar 1kg", quantidade: 1, valor: 4.50, comprado: false, adicionadoPorId: "u2" },
    ],
  },
];

export const tarefasConcluidas: Tarefa[] = [
  { id: "t1", titulo: "LAVAR ÁREA DE SERVIÇO", pe: 4, responsavelId: "u3", prazo: "2026-04-13", concluidaEm: "2026-04-13", status: "concluida" },
  { id: "t2", titulo: "Limpar sala", pe: 2, responsavelId: "u3", prazo: "2026-04-10", concluidaEm: "2026-04-10", status: "concluida" },
  { id: "t3", titulo: "Tirar Lixo pra fora", pe: 1, responsavelId: "u3", prazo: "2026-04-13", concluidaEm: "2026-04-13", status: "concluida" },
  { id: "t4", titulo: "Arrumar cozinha", pe: 2, responsavelId: "u3", prazo: "2026-04-07", concluidaEm: "2026-04-07", status: "concluida" },
  { id: "t5", titulo: "Lavar Banheiro Principal", pe: 4, responsavelId: "u3", prazo: "2026-04-03", concluidaEm: "2026-04-03", status: "concluida" },
];

export const despesasRecentes: Despesa[] = [
  { id: "d1", titulo: "Compras", pagadorId: "u4", valor: 69.97, data: "2026-04-15" },
  { id: "d2", titulo: "mussarela e presunto", pagadorId: "u3", valor: 28.00, data: "2026-04-14" },
  { id: "d3", titulo: "Temperos", pagadorId: "u4", valor: 22.12, data: "2026-04-12" },
  { id: "d4", titulo: "BH Pães", pagadorId: "u5", valor: 10.58, data: "2026-04-10" },
];

export const avisos: Aviso[] = [
  { id: "a1", titulo: "Marco tá com o parafuso froxo", conteudo: "froxinho", autorId: "u5", fixado: true, data: "2026-04-05" },
];

export const meuSaldo: Saldo = {
  aReceber: 12.88,
  voceDeve: 0,
  teDevem: 12.88,
};

export const metas: Meta[] = [];

const generateNotifications = (): Notificacao[] => {
  const notificacoes: Notificacao[] = [
    { id: "n1", tipo: "pagamento_confirmado", titulo: "Pagamento confirmado!", descricao: "Gustavo Luis confirmou o recebimento de R$ 11.87", data: "2026-05-01T17:15:00", lida: false },
    { id: "n2", tipo: "pagamento_registrado", titulo: "Pagamento registrado", descricao: "Você registrou pagamento de R$ 15.00 para Marco A.", data: "2026-05-01T14:30:00", lida: false },
    { id: "n3", tipo: "nova_despesa", titulo: "Nova despesa", descricao: "Renato Monteiro registrou 'BH Pães'. Sua parte: R$ 2.12", data: "2026-04-30T20:00:00", lida: false },
    { id: "n4", tipo: "nova_tarefa_atribuida", titulo: "Nova tarefa atribuída", descricao: "Você foi designado para: LAVAR ÁREA DE SERVIÇO (6 PE) - Prazo: 13/04", data: "2026-04-28T10:00:00", lida: true },
    { id: "n5", tipo: "tarefa_urgente", titulo: "⚠️ Tarefa URGENTE", descricao: "Você foi designado para: Lavar Louça (2.6 PE) - Prazo: HOJE", data: "2026-04-27T08:00:00", lida: true },
    { id: "n6", tipo: "compras_iniciadas", titulo: "Compras iniciadas", descricao: "Luis Otávio Fonseca está fazendo as compras da lista 'Mercado'", data: "2026-04-26T15:00:00", lida: true },
    { id: "n7", tipo: "compras_finalizadas", titulo: "Compras finalizadas", descricao: "Gustavo Luis finalizou as compras. Sua parte: R$ 14.00", data: "2026-04-25T18:30:00", lida: true },
    { id: "n8", tipo: "novo_aviso", titulo: "Novo aviso no mural", descricao: "Renato Monteiro: Marco tá com o parafuso froxo", data: "2026-04-24T12:00:00", lida: true },
    { id: "n9", tipo: "pagamento_confirmado", titulo: "Pagamento confirmado!", descricao: "Marco A. confirmou o recebimento de R$ 8.50", data: "2026-04-23T16:45:00", lida: true },
    { id: "n10", tipo: "nova_despesa", titulo: "Nova despesa", descricao: "Gustavo Luis registrou 'Compras'. Sua parte: R$ 13.99", data: "2026-04-22T11:30:00", lida: true },
    { id: "n11", tipo: "pagamento_registrado", titulo: "Pagamento registrado", descricao: "Luis Otávio Fonseca registrou pagamento de R$ 20.00", data: "2026-04-21T09:15:00", lida: true },
    { id: "n12", tipo: "nova_tarefa_atribuida", titulo: "Nova tarefa atribuída", descricao: "Você foi designado para: Limpar sala (2 PE) - Prazo: 10/04", data: "2026-04-20T14:00:00", lida: true },
    { id: "n13", tipo: "compras_iniciadas", titulo: "Compras iniciadas", descricao: "Marco A. está fazendo as compras da lista 'Feira'", data: "2026-04-19T10:30:00", lida: true },
    { id: "n14", tipo: "pagamento_confirmado", titulo: "Pagamento confirmado!", descricao: "Renato Monteiro confirmou o recebimento de R$ 5.00", data: "2026-04-18T17:00:00", lida: true },
    { id: "n15", tipo: "nova_despesa", titulo: "Nova despesa", descricao: "Marco A. registrou 'Internet'. Sua parte: R$ 16.00", data: "2026-04-17T08:45:00", lida: true },
    { id: "n16", tipo: "tarefa_urgente", titulo: "⚠️ Tarefa URGENTE", descricao: "Você foi designado para: Tirar Lixo (1 PE) - Prazo: HOJE", data: "2026-04-16T07:30:00", lida: true },
    { id: "n17", tipo: "compras_finalizadas", titulo: "Compras finalizadas", descricao: "Marco A. finalizou as compras. Sua parte: R$ 22.50", data: "2026-04-15T19:00:00", lida: true },
    { id: "n18", tipo: "novo_aviso", titulo: "Novo aviso no mural", descricao: "Gustavo Luis: Reunião de casa domingo às 19h", data: "2026-04-14T13:00:00", lida: true },
    { id: "n19", tipo: "pagamento_confirmado", titulo: "Pagamento confirmado!", descricao: "Luis Otávio Fonseca confirmou o recebimento de R$ 18.00", data: "2026-04-13T15:30:00", lida: true },
    { id: "n20", tipo: "nova_despesa", titulo: "Nova despesa", descricao: "Ithalo Pimentel registrou 'mussarela e presunto'. Sua parte: R$ 5.60", data: "2026-04-12T11:00:00", lida: true },
    { id: "n21", tipo: "pagamento_registrado", titulo: "Pagamento registrado", descricao: "Você registrou pagamento de R$ 30.00 para Gustavo Luis", data: "2026-04-11T16:20:00", lida: true },
    { id: "n22", tipo: "nova_tarefa_atribuida", titulo: "Nova tarefa atribuída", descricao: "Você foi designado para: Arrumar cozinha (2 PE) - Prazo: 07/04", data: "2026-04-10T09:00:00", lida: true },
    { id: "n23", tipo: "compras_iniciadas", titulo: "Compras iniciadas", descricao: "Renato Monteiro está fazendo as compras da lista 'Limpeza'", data: "2026-04-09T14:15:00", lida: true },
    { id: "n24", tipo: "pagamento_confirmado", titulo: "Pagamento confirmado!", descricao: "Gustavo Luis confirmou o recebimento de R$ 25.00", data: "2026-04-08T18:00:00", lida: true },
    { id: "n25", tipo: "nova_despesa", titulo: "Nova despesa", descricao: "Luis Otávio Fonseca registrou 'Temperos'. Sua parte: R$ 4.42", data: "2026-04-07T10:30:00", lida: true },
    { id: "n26", tipo: "tarefa_urgente", titulo: "⚠️ Tarefa URGENTE", descricao: "Você foi designado para: Lavar Banheiro Principal (4 PE) - Prazo: HOJE", data: "2026-04-06T07:00:00", lida: true },
    { id: "n27", tipo: "compras_finalizadas", titulo: "Compras finalizadas", descricao: "Renato Monteiro finalizou as compras. Sua parte: R$ 35.00", data: "2026-04-05T20:00:00", lida: true },
    { id: "n28", tipo: "novo_aviso", titulo: "Novo aviso no mural", descricao: "Marco A.: Não esqueçam de pagar o aluguel até dia 10", data: "2026-04-04T12:30:00", lida: true },
    { id: "n29", tipo: "pagamento_confirmado", titulo: "Pagamento confirmado!", descricao: "Marco A. confirmou o recebimento de R$ 360.00", data: "2026-04-03T16:00:00", lida: true },
    { id: "n30", tipo: "nova_despesa", titulo: "Nova despesa", descricao: "Renato Monteiro registrou 'Aluguel'. Sua parte: R$ 360.00", data: "2026-04-02T09:30:00", lida: true },
    { id: "n31", tipo: "pagamento_registrado", titulo: "Pagamento registrado", descricao: "Marco A. registrou pagamento de R$ 360.00", data: "2026-04-01T14:00:00", lida: true },
    { id: "n32", tipo: "nova_tarefa_atribuida", titulo: "Nova tarefa atribuída", descricao: "Você foi designado para: Lavar Banheiro Principal (4 PE) - Prazo: 03/04", data: "2026-03-31T10:00:00", lida: true },
    { id: "n33", tipo: "compras_iniciadas", titulo: "Compras iniciadas", descricao: "Gustavo Luis está fazendo as compras da lista 'Mercado'", data: "2026-03-30T15:30:00", lida: true },
    { id: "n34", tipo: "pagamento_confirmado", titulo: "Pagamento confirmado!", descricao: "Renato Monteiro confirmou o recebimento de R$ 12.00", data: "2026-03-29T17:45:00", lida: true },
    { id: "n35", tipo: "nova_despesa", titulo: "Nova despesa", descricao: "Gustavo Luis registrou 'Material de limpeza'. Sua parte: R$ 8.00", data: "2026-03-28T11:15:00", lida: true },
    { id: "n36", tipo: "tarefa_urgente", titulo: "⚠️ Tarefa URGENTE", descricao: "Você foi designado para: Limpar geladeira (3 PE) - Prazo: HOJE", data: "2026-03-27T08:00:00", lida: true },
    { id: "n37", tipo: "compras_finalizadas", titulo: "Compras finalizadas", descricao: "Gustavo Luis finalizou as compras. Sua parte: R$ 28.00", data: "2026-03-26T19:30:00", lida: true },
    { id: "n38", tipo: "novo_aviso", titulo: "Novo aviso no mural", descricao: "Luis Otávio Fonseca: Quem comeu meu iogurte?", data: "2026-03-25T13:00:00", lida: true },
    { id: "n39", tipo: "pagamento_confirmado", titulo: "Pagamento confirmado!", descricao: "Gustavo Luis confirmou o recebimento de R$ 6.00", data: "2026-03-24T16:30:00", lida: true },
    { id: "n40", tipo: "nova_despesa", titulo: "Nova despesa", descricao: "Marco A. registrou 'Água'. Sua parte: R$ 10.00", data: "2026-03-23T10:00:00", lida: true },
    { id: "n41", tipo: "pagamento_registrado", titulo: "Pagamento registrado", descricao: "Renato Monteiro registrou pagamento de R$ 15.00", data: "2026-03-22T14:45:00", lida: true },
    { id: "n42", tipo: "nova_tarefa_atribuida", titulo: "Nova tarefa atribuída", descricao: "Você foi designado para: Varrer quintal (3 PE) - Prazo: 25/03", data: "2026-03-21T09:00:00", lida: true },
  ];
  return notificacoes;
};

export const notificacoes = generateNotifications();
