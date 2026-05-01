import { useState } from 'react';
import { Target, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/shared/EmptyState';

export function Metas() {
  const [activeTab, setActiveTab] = useState('ativas');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Metas da República</h1>
          <p className="page-subtitle">Objetivos e projetos compartilhados</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Meta</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-5 lg:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="ativas">Ativas</TabsTrigger>
              <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
              <TabsTrigger value="arquivadas">Arquivadas</TabsTrigger>
            </TabsList>

            <TabsContent value="ativas">
              <EmptyState
                icon={Target}
                title="Nenhuma meta ativa"
                subtitle="Crie objetivos para organizar e acompanhar os projetos da república"
                ctaLabel="Criar Meta"
              />
            </TabsContent>
            <TabsContent value="concluidas">
              <EmptyState
                icon={Target}
                title="Nenhuma meta concluída"
                subtitle="As metas concluídas aparecerão aqui"
              />
            </TabsContent>
            <TabsContent value="arquivadas">
              <EmptyState
                icon={Target}
                title="Nenhuma meta arquivada"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
