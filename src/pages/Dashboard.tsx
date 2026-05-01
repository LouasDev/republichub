import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingCart, Wallet, ListChecks, Target, Megaphone, CheckCircle2, Star, Bell, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { MoneyText } from '@/components/shared/MoneyText';
import { useRepublicaStore } from '@/stores';
import { formatDate } from '@/lib/utils';

const shortcuts = [
  { icon: Wallet, label: 'Finanças', path: '/financas', color: 'bg-emerald-500', bgSoft: 'bg-emerald-50' },
  { icon: ShoppingCart, label: 'Compras', path: '/compras', color: 'bg-blue-500', bgSoft: 'bg-blue-50' },
  { icon: ListChecks, label: 'Tarefas', path: '/tarefas', color: 'bg-violet-500', bgSoft: 'bg-violet-50' },
  { icon: Target, label: 'Metas', path: '/metas', color: 'bg-sky-500', bgSoft: 'bg-sky-50' },
  { icon: Megaphone, label: 'Avisos', path: '/', color: 'bg-orange-500', bgSoft: 'bg-orange-50' },
];

export function Dashboard() {
  const { republica, saldo, despesas, moradores, avisos, listasCompras } = useRepublicaStore();
  const me = moradores.find(m => m.isMe)!;
  const activeLists = listasCompras.filter(l => l.status === 'ativa' || l.status === 'em_compras');
  const listCompraAtiva = activeLists.find(l => l.status === 'em_compras');
  const responsavelCompra = listCompraAtiva?.responsavelId ? moradores.find(m => m.id === listCompraAtiva.responsavelId) : null;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-accent rounded-2xl px-5 py-6 lg:px-8 lg:py-8 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 lg:-mt-8">
        <div className="flex items-start justify-between max-w-[1120px] mx-auto">
          <div>
            <p className="text-white/60 text-sm mb-1.5 font-medium">Olá, {me.nome.split(' ')[0]}</p>
            <h1 className="text-[28px] lg:text-[32px] font-bold text-white leading-tight tracking-tight">{republica.nome}</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="bg-white/15 backdrop-blur-sm rounded-full px-3.5 py-2 flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white text-sm">{me.score.toFixed(1)}</span>
            </div>
            <button className="relative p-2.5 bg-white/15 backdrop-blur-sm rounded-full hover:bg-white/25 transition-colors">
              <Bell className="w-5 h-5 text-white" />
              {saldo.aReceber > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent-red rounded-full ring-2 ring-accent/80" />}
            </button>
          </div>
        </div>
      </div>

      {/* Meu Saldo */}
      <Card className="relative -mt-3 z-10">
        <CardContent className="p-5 lg:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] text-text-muted font-medium mb-1">Meu Saldo</p>
              <p className="text-3xl lg:text-[36px] font-bold text-accent-green tracking-tight">R$ {saldo.aReceber.toFixed(2)}</p>
              <p className="text-sm text-text-muted mt-0.5">a receber</p>
            </div>
            <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-accent-green" />
            </div>
          </div>
          <div className="border-t border-border-light mt-5 pt-5 grid grid-cols-2 gap-6">
            <div>
              <p className="text-[13px] text-text-muted mb-0.5">Você deve</p>
              <MoneyText value={saldo.voceDeve} variant="red" />
            </div>
            <div>
              <p className="text-[13px] text-text-muted mb-0.5">Te devem</p>
              <MoneyText value={saldo.teDevem} variant="green" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active lists banner */}
      {activeLists.length > 0 && (
        <Link to="/compras" className="block">
          <div className="bg-blue-50 rounded-xl px-5 py-4 flex items-center gap-4 hover:bg-blue-100/70 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-5 h-5 text-accent-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-text-primary">{activeLists.length} lista(s) de compras ativa(s)</p>
              {responsavelCompra && (
                <p className="text-sm text-accent-blue/80 mt-0.5">
                  {responsavelCompra.nome} está comprando
                </p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-text-muted/60 flex-shrink-0" />
          </div>
        </Link>
      )}

      {/* Shortcuts */}
      <div className="grid grid-cols-5 gap-3">
        {shortcuts.map((s) => (
          <Link key={s.path} to={s.path} className="flex flex-col items-center gap-2 py-4 bg-white rounded-xl shadow-sm border border-border/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            <div className={`w-11 h-11 ${s.color} rounded-full flex items-center justify-center`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-semibold text-text-secondary">{s.label}</span>
          </Link>
        ))}
      </div>

      {/* Minhas Tarefas + Despesas Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <h3 className="text-[15px] font-semibold">Minhas Tarefas</h3>
            <Link to="/tarefas" className="text-[13px] text-text-muted hover:text-accent-blue transition-colors">Ver todas</Link>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7 text-accent-green/60" />
            </div>
            <p className="text-base font-semibold text-text-primary">Tudo em dia!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-[15px] font-semibold">Despesas Recentes</h3>
            <Link to="/financas" className="text-[13px] text-text-muted hover:text-accent-blue transition-colors">Ver todas</Link>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border-light">
              {despesas.slice(0, 4).map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium truncate">{d.titulo}</p>
                    <p className="text-[12px] text-text-muted mt-0.5">{moradores.find(m => m.id === d.pagadorId)?.nome}</p>
                  </div>
                  <p className="text-[14px] font-semibold ml-4 flex-shrink-0">R$ {d.valor.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <h3 className="text-[15px] font-semibold">Despesas Mensais</h3>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-end justify-around gap-2">
              {['Jan', 'Fev', 'Mar', 'Abr', 'Mai'].map((m, idx) => {
                const heights = [50, 70, 40, 85, 55];
                return (
                  <div key={m} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full max-w-[36px] bg-accent-blue/15 rounded-t-md"
                      style={{ height: `${heights[idx]}px` }}
                    />
                    <span className="text-[11px] text-text-muted font-medium">{m}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-[15px] font-semibold">Por Categoria (Mês)</h3>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-sm text-text-muted">Sem despesas este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Tarefas da Casa */}
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-semibold">Tarefas da Casa</h3>
          <Link to="/tarefas" className="text-[13px] text-text-muted hover:text-accent-blue transition-colors">Ver todas</Link>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-sm text-text-muted">Nenhuma tarefa pendente na casa</p>
        </CardContent>
      </Card>

      {/* Mural de Avisos */}
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-semibold">Mural de Avisos</h3>
          <Link to="/" className="text-[13px] text-text-muted hover:text-accent-blue transition-colors">Ver todos</Link>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border-light">
            {avisos.map((aviso) => (
              <div key={aviso.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1.5">
                  {aviso.fixado && <span className="bg-bg-soft text-text-muted px-2 py-0.5 rounded-md text-[11px] font-semibold">Fixado</span>}
                  <h4 className="text-[14px] font-semibold">{aviso.titulo}</h4>
                </div>
                <p className="text-[13px] text-text-muted mb-2">{aviso.conteudo}</p>
                <p className="text-[12px] text-text-muted">
                  {moradores.find(m => m.id === aviso.autorId)?.nome} • {formatDate(aviso.data)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
