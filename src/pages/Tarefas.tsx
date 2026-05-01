import { useState } from 'react';
import { Star, Coins, Info, Search, CheckCircle2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { MoneyText } from '@/components/shared/MoneyText';
import { useRepublicaStore } from '@/stores';
import { formatDate } from '@/lib/utils';
import type { Tarefa } from '@/types';

export function Tarefas() {
  const { tarefas, moradores } = useRepublicaStore();
  const me = moradores.find(m => m.isMe)!;
  const [activeTab, setActiveTab] = useState('minhas');
  const [search, setSearch] = useState('');

  const concluidas = tarefas.filter(t => t.status === 'concluida');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Tarefas</h1>
          <p className="page-subtitle">Gestão colaborativa com Pontos de Esforço</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Tarefa</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="secondary">
          <Coins className="w-4 h-4" />
          <span className="hidden sm:inline">Disponíveis (1)</span>
          <span className="sm:hidden">1</span>
        </Button>
        <Button variant="secondary">
          <Info className="w-4 h-4" />
          <span className="hidden sm:inline">Visão Geral</span>
          <span className="sm:hidden">Info</span>
        </Button>
      </div>

      {/* Score Card */}
      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <p className="text-[13px] text-text-muted font-medium">Score de Contribuição</p>
              <p className="text-2xl font-bold tracking-tight">{me.score.toFixed(1)}</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-[12px] text-text-muted mb-0.5">Crédito</p>
              <MoneyText value={0} variant="green" />
            </div>
            <div className="text-right">
              <p className="text-[12px] text-text-muted mb-0.5">Débito</p>
              <MoneyText value={0} variant="red" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50" />
        <input
          type="text"
          placeholder="Buscar tarefa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border pl-10 pr-4 py-2.5 text-sm bg-white outline-none transition-all focus:border-accent-blue/40 focus:ring-2 focus:ring-accent-blue/10 placeholder:text-text-muted"
        />
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-5 lg:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="minhas">Minhas</TabsTrigger>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="disponiveis">
                Disponíveis
                <Badge variant="success" className="ml-1.5 text-[10px]">1</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="minhas">
              <ConcluidasList tarefas={concluidas} />
            </TabsContent>
            <TabsContent value="todas">
              <ConcluidasList tarefas={concluidas} />
            </TabsContent>
            <TabsContent value="disponiveis">
              <div className="text-center py-16 text-text-muted">
                <p>Nenhuma tarefa disponível no momento</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function ConcluidasList({ tarefas }: { tarefas: Tarefa[] }) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-3">Concluídas</p>
      <div className="space-y-2">
        {tarefas.map((t) => (
          <div key={t.id} className="bg-bg-soft rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4.5 h-4.5 text-accent-green" />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-medium line-through text-text-muted">{t.titulo}</p>
              <p className="text-[12px] text-text-muted mt-0.5">Concluída em {t.concluidaEm ? formatDate(t.concluidaEm) : '-'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
