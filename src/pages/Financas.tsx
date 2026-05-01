import { useState } from 'react';
import { TrendingUp, TrendingDown, Pencil, RefreshCw, Trash2, Plus, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import { MoneyText } from '@/components/shared/MoneyText';
import { Badge } from '@/components/ui/Badge';
import { useRepublicaStore } from '@/stores';
import { CheckCircle2 } from 'lucide-react';

export function Financas() {
  const { despesasRecorrentes, moradores, saldo } = useRepublicaStore();
  const [activeTab, setActiveTab] = useState('pendentes');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Finanças</h1>
          <p className="page-subtitle">Divisão automática com taxas punitivas</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Despesa</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-accent-green" />
            </div>
            <div>
              <p className="text-[13px] text-text-muted font-medium">A receber</p>
              <p className="text-2xl font-bold text-accent-green tracking-tight">R$ {saldo.aReceber.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-5 h-5 text-accent-red" />
            </div>
            <div>
              <p className="text-[13px] text-text-muted font-medium">A pagar</p>
              <p className="text-2xl font-bold text-accent-red tracking-tight">R$ {saldo.voceDeve.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Despesas Recorrentes */}
      <Card>
        <CardHeader>
          <h3 className="text-[12px] uppercase tracking-wider text-text-muted font-bold">Despesas Recorrentes</h3>
          <Button variant="secondary" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Nova
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {despesasRecorrentes.map((dr) => {
              const recebedor = moradores.find(m => m.id === dr.recebedorId);
              return (
                <div key={dr.id} className="bg-blue-50/70 rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                      <span className="text-[15px] font-bold text-text-primary">{dr.titulo}</span>
                      <Badge variant="default">{dr.frequencia === 'mensal' ? 'Mensal' : dr.frequencia}</Badge>
                      {dr.semDebitosTarefas && <span className="text-[11px] text-accent-green font-semibold">Sem débitos tarefas</span>}
                    </div>
                    <p className="text-xl font-bold text-accent-blue mb-2">R$ {dr.valor.toFixed(2)}</p>
                    <p className="text-[13px] text-text-muted mb-1">Recebe: <span className="font-medium text-text-secondary">{recebedor?.nome}</span></p>
                    <p className="text-[13px] text-text-muted flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Próxima: {new Date(dr.proximaData).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-bg-soft transition-colors shadow-sm">
                      <Pencil className="w-3.5 h-3.5 text-text-secondary" />
                    </button>
                    <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-bg-soft transition-colors shadow-sm">
                      <RefreshCw className="w-3.5 h-3.5 text-accent-blue" />
                    </button>
                    <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm">
                      <Trash2 className="w-3.5 h-3.5 text-accent-red" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="p-5 lg:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="saldos">Saldos</TabsTrigger>
            </TabsList>
            <TabsContent value="pendentes">
              <EmptyState
                icon={CheckCircle2}
                title="Tudo em dia!"
                subtitle="Você não tem pagamentos pendentes"
              />
            </TabsContent>
            <TabsContent value="historico">
              <EmptyState
                icon={CheckCircle2}
                title="Sem histórico"
                subtitle="Nenhum pagamento registrado ainda"
              />
            </TabsContent>
            <TabsContent value="saldos">
              <div className="divide-y divide-border-light">
                {moradores.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <span className="text-[14px] font-medium">{m.nome}</span>
                    <MoneyText value={m.saldoFinanceiro ?? 0} variant={(m.saldoFinanceiro ?? 0) >= 0 ? 'green' : 'red'} />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
