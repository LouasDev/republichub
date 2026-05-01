import { Link } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRepublicaStore } from '@/stores';

export function Compras() {
  const { listasCompras, moradores } = useRepublicaStore();
  const activeLists = listasCompras.filter(l => l.status === 'ativa' || l.status === 'em_compras');

  const statusConfig = {
    ativa: { label: 'Ativa', variant: 'info' as const },
    em_compras: { label: 'Em Compras', variant: 'purple' as const },
    finalizada: { label: 'Finalizada', variant: 'success' as const },
  };

  const listColors = ['bg-sky-400', 'bg-violet-400', 'bg-emerald-400', 'bg-amber-400', 'bg-pink-400'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Compras</h1>
          <p className="page-subtitle">Listas colaborativas de compras</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Lista</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {/* Lists */}
      <div>
        <p className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-3">Listas Ativas</p>
        <div className="space-y-3">
          {activeLists.map((lista, idx) => {
            const total = lista.itens.length;
            const comprados = lista.itens.filter(i => i.comprado).length;
            const progress = total > 0 ? (comprados / total) * 100 : 0;
            const responsavel = lista.responsavelId ? moradores.find(m => m.id === lista.responsavelId) : null;
            const config = statusConfig[lista.status];

            return (
              <Link key={lista.id} to={`/compras/${lista.id}`}>
                <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-14 h-14 ${listColors[idx % listColors.length]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-xl font-bold text-white">{lista.nome[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-[15px] font-semibold">{lista.nome}</h3>
                          <p className="text-[13px] text-text-muted mt-0.5">{total} itens • {comprados} comprados</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant={config.variant}>{config.label}</Badge>
                          {responsavel && lista.status === 'em_compras' && (
                            <Badge variant="default" className="max-w-[120px] truncate">{responsavel.nome.split(' ')[0]}</Badge>
                          )}
                          <ChevronRight className="w-4 h-4 text-text-muted/50" />
                        </div>
                      </div>
                      {total > 0 && (
                        <div className="mt-3">
                          <div className="w-full bg-bg-soft rounded-full h-1.5">
                            <div
                              className="bg-accent-green h-1.5 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
