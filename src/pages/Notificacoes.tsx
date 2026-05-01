import { Trash2, CheckCircle2, Wallet, ListChecks, Megaphone, ShoppingCart, TrendingUp } from 'lucide-react';
import { useRepublicaStore } from '@/stores';
import { formatDateTime } from '@/lib/utils';

const iconMap: Record<string, { icon: typeof Trash2; color: string }> = {
  pagamento_confirmado: { icon: CheckCircle2, color: 'text-accent-green' },
  pagamento_registrado: { icon: TrendingUp, color: 'text-accent-green' },
  nova_despesa: { icon: Wallet, color: 'text-accent-green' },
  nova_tarefa_atribuida: { icon: ListChecks, color: 'text-accent-purple' },
  tarefa_urgente: { icon: ListChecks, color: 'text-accent-red' },
  compras_iniciadas: { icon: ShoppingCart, color: 'text-accent-orange' },
  compras_finalizadas: { icon: ShoppingCart, color: 'text-accent-blue' },
  novo_aviso: { icon: Megaphone, color: 'text-accent-orange' },
};

export function Notificacoes({ onClose }: { onClose?: () => void }) {
  const { notificacoes, markAllNotificationsAsRead, deleteNotification } = useRepublicaStore();
  const unreadCount = notificacoes.filter(n => !n.lida).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-border-light px-5 py-4 z-10">
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="text-lg font-bold">Notificações</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-bg-soft rounded-lg transition-colors">
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-text-muted">{unreadCount} não lidas</p>
            <button onClick={markAllNotificationsAsRead} className="text-[13px] text-accent-blue font-semibold hover:underline">
              Marcar todas como lidas
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-3 space-y-1">
          {notificacoes.map((n) => {
            const { icon: Icon, color } = iconMap[n.tipo] || { icon: ListChecks, color: 'text-text-muted' };
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${!n.lida ? 'bg-bg-soft' : 'hover:bg-bg-soft/60'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${!n.lida ? 'bg-white' : 'bg-bg-soft'}`}>
                  <Icon className={`w-[18px] h-[18px] ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold leading-snug">{n.titulo}</p>
                  <p className="text-[12px] text-text-muted mt-0.5 leading-snug">{n.descricao}</p>
                  <p className="text-[11px] text-text-muted/70 mt-1">{formatDateTime(n.data)}</p>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0 ml-1 pt-1">
                  {!n.lida && <span className="w-2 h-2 bg-accent-green rounded-full" />}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-text-muted/50" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
