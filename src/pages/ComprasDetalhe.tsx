import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ShoppingCart, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRepublicaStore } from '@/stores';
import { MoneyText } from '@/components/shared/MoneyText';

export function ComprasDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listasCompras, toggleItemCompra, updateListaStatus } = useRepublicaStore();
  const lista = listasCompras.find(l => l.id === id);

  if (!lista) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-muted">Lista não encontrada</p>
        <button onClick={() => navigate('/compras')} className="mt-4 text-accent-blue font-medium text-sm">Voltar para Compras</button>
      </div>
    );
  }

  const total = lista.itens.length;
  const comprados = lista.itens.filter(i => i.comprado).length;
  const progress = total > 0 ? (comprados / total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/compras')} className="p-2 -ml-2 hover:bg-bg-soft rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="page-title">{lista.nome}</h1>
          <p className="page-subtitle">{total} itens • {comprados} comprados</p>
        </div>
      </div>

      {/* Progress */}
      {total > 0 && (
        <div className="w-full bg-bg-soft rounded-full h-2">
          <div className="bg-accent-green h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Items */}
      <Card>
        <CardContent className="p-5 lg:p-6">
          <div className="divide-y divide-border-light">
            {lista.itens.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 cursor-pointer transition-colors ${item.comprado ? 'opacity-60' : ''}`}
                onClick={() => toggleItemCompra(lista.id, item.id)}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.comprado ? 'bg-accent-green border-accent-green' : 'border-border'}`}>
                  {item.comprado && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] font-medium ${item.comprado ? 'line-through text-text-muted' : ''}`}>{item.nome}</p>
                  <p className="text-[12px] text-text-muted mt-0.5">Qtd: {item.quantidade}</p>
                </div>
                {item.valor && <MoneyText value={item.valor} className="flex-shrink-0" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="secondary" className="flex-1">
          <Plus className="w-4 h-4" />
          Adicionar Item
        </Button>
        {lista.status === 'ativa' && (
          <Button variant="primary" className="flex-1" onClick={() => updateListaStatus(lista.id, 'em_compras')}>
            <ShoppingCart className="w-4 h-4" />
            Iniciar Compras
          </Button>
        )}
        {lista.status === 'em_compras' && (
          <Button variant="primary" className="flex-1" onClick={() => updateListaStatus(lista.id, 'finalizada')}>
            <Check className="w-4 h-4" />
            Finalizar Compras
          </Button>
        )}
      </div>
    </div>
  );
}
