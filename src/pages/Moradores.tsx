import { Star, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MoradorAvatar } from '@/components/shared/MoradorAvatar';
import { useRepublicaStore } from '@/stores';

export function Moradores() {
  const { moradores } = useRepublicaStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Moradores</h1>
          <p className="page-subtitle">Qualquer morador pode aprovar ou rejeitar entradas</p>
        </div>
        <Button variant="primary">
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Convidar</span>
        </Button>
      </div>

      {/* Lista */}
      <Card>
        <CardContent className="p-5 lg:p-6">
          <h3 className="text-[15px] font-semibold mb-5">Moradores ({moradores.length})</h3>
          <div className="divide-y divide-border-light">
            {moradores.map((m) => (
              <div key={m.id} className="py-5 first:pt-0 last:pb-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <MoradorAvatar name={m.nome} color={m.avatarColor} size="lg" />
                    <div>
                      <p className="font-semibold">{m.nome}</p>
                      <p className="text-[13px] text-text-muted truncate max-w-[200px] sm:max-w-none">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 flex-shrink-0" />
                    <div className="text-right">
                      <p className="text-xl font-bold">{m.score.toFixed(1)}</p>
                      <p className="text-[11px] text-text-muted font-medium">Score</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-accent-green">{m.concluidas ?? 0}</p>
                    <p className="text-[11px] text-text-muted font-medium mt-0.5">Concluídas</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-accent-red">{m.falhadas ?? 0}</p>
                    <p className="text-[11px] text-text-muted font-medium mt-0.5">Falhadas</p>
                  </div>
                  <div className={`rounded-xl p-3 text-center ${m.taxa > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
                    <p className={`text-xl font-bold ${m.taxa > 0 ? 'text-accent-red' : 'text-accent-green'}`}>
                      {m.taxa.toFixed(1)}%
                    </p>
                    <p className="text-[11px] text-text-muted font-medium mt-0.5">Taxa</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
