import { useState } from 'react';
import { Users, ListChecks, Coins, ArrowLeftRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { MoradorAvatar } from '@/components/shared/MoradorAvatar';
import { ScoreBadge } from '@/components/shared/ScoreBadge';
import { MoneyText } from '@/components/shared/MoneyText';
import { Badge } from '@/components/ui/Badge';
import { useRepublicaStore } from '@/stores';

const kpis = [
  { icon: Users, label: 'Membros', value: 5, color: 'bg-blue-500' },
  { icon: ListChecks, label: 'Tarefas Ativas', value: 0, color: 'bg-violet-500' },
  { icon: Coins, label: 'Disponíveis', value: 1, color: 'bg-emerald-500' },
  { icon: ArrowLeftRight, label: 'Trocas Pendentes', value: 0, color: 'bg-orange-500' },
];

export function VisaoGeral() {
  const { moradores } = useRepublicaStore();
  const [activeTab, setActiveTab] = useState('membros');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Visão Geral do Sistema</h1>
        <p className="page-subtitle">Mapa completo da república - membros, tarefas e economia</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className={`w-10 h-10 ${kpi.color} rounded-full flex items-center justify-center mb-2`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
              <p className="text-[11px] text-text-muted font-medium mt-0.5">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-5 lg:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="membros">Membros</TabsTrigger>
              <TabsTrigger value="economia">Economia</TabsTrigger>
              <TabsTrigger value="guia">Guia PE</TabsTrigger>
            </TabsList>

            <TabsContent value="membros">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {moradores.map((m) => (
                  <Card
                    key={m.id}
                    className={`p-4 ${m.isMe ? 'ring-2 ring-accent' : ''}`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <MoradorAvatar name={m.nome} color={m.avatarColor} size="lg" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-[15px] font-semibold">{m.nome}</h3>
                            {m.isMe && <Badge variant="default">Você</Badge>}
                          </div>
                          {m.taxa > 0 && (
                            <Badge variant="warning" className="mt-1">{m.taxa}% taxa</Badge>
                          )}
                        </div>
                      </div>
                      <ScoreBadge score={m.score} />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-bg-soft rounded-lg p-2.5 text-center">
                        <p className="text-lg font-bold text-accent-purple">{m.pendentes ?? 0}</p>
                        <p className="text-[11px] text-text-muted font-medium">Pendentes</p>
                      </div>
                      <div className="bg-bg-soft rounded-lg p-2.5 text-center">
                        <p className="text-lg font-bold text-accent-green">{m.concluidas ?? 0}</p>
                        <p className="text-[11px] text-text-muted font-medium">Concluídas</p>
                      </div>
                      <div className="bg-bg-soft rounded-lg p-2.5 text-center">
                        <p className="text-lg font-bold text-accent-orange">{m.liberadas ?? 0}</p>
                        <p className="text-[11px] text-text-muted font-medium">Liberadas</p>
                      </div>
                    </div>

                    {/* Financial */}
                    <div className="border-t border-border-light pt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-text-muted">Crédito tarefas:</span>
                        <MoneyText value={m.creditoTarefas ?? 0} variant="green" />
                      </div>
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-text-muted">Débito tarefas:</span>
                        <MoneyText value={m.debitoTarefas ?? 0} variant="red" />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border-light">
                        <span className="text-[13px] font-medium">Saldo financeiro:</span>
                        <MoneyText
                          value={m.saldoFinanceiro ?? 0}
                          variant={(m.saldoFinanceiro ?? 0) >= 0 ? 'green' : 'red'}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="economia">
              <div className="text-center py-16 text-text-muted">
                <p>Economia da república em breve...</p>
              </div>
            </TabsContent>
            <TabsContent value="guia">
              <div className="text-center py-16 text-text-muted">
                <p>Guia de Pontos de Esforço em breve...</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
