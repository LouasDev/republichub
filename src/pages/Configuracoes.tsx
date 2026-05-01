import { useState } from 'react';
import { Star, Percent, ChevronRight, Home, Copy, RefreshCw, Trash2, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MoradorAvatar } from '@/components/shared/MoradorAvatar';
import { Dialog, DialogHeader, DialogTitle, DialogClose, DialogContent, DialogFooter } from '@/components/ui/Dialog';
import { useRepublicaStore } from '@/stores';

export function Configuracoes() {
  const { republica, moradores } = useRepublicaStore();
  const me = moradores.find(m => m.isMe)!;
  const [nomeRepublica, setNomeRepublica] = useState(republica.nome);
  const [endereco, setEndereco] = useState(republica.endereco);
  const [showSairDialog, setShowSairDialog] = useState(false);
  const [showSairContaDialog, setShowSairContaDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(republica.codigoConvite);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Configurações</h1>
        <p className="page-subtitle">Gerencie sua conta e república</p>
      </div>

      {/* Perfil */}
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MoradorAvatar name={me.nome} color={me.avatarColor} size="xl" />
            <div>
              <h3 className="text-[15px] font-bold">{me.nome}</h3>
              <p className="text-[13px] text-text-muted">{me.email}</p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                  <span className="text-[13px] text-accent-green font-semibold">Score: {me.score.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[13px] text-accent-green font-semibold">Taxa: {me.taxa}%</span>
                </div>
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-text-muted/50 flex-shrink-0" />
        </CardContent>
      </Card>

      {/* República */}
      <Card>
        <CardContent className="p-5 lg:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Home className="w-5 h-5 text-text-secondary" />
            <h3 className="text-[15px] font-semibold">República</h3>
          </div>

          <div className="space-y-4">
            <Input label="Nome da República" value={nomeRepublica} onChange={(e) => setNomeRepublica(e.target.value)} />
            <Input label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            <Button variant="secondary" className="w-full">Salvar Alterações</Button>
          </div>

          {/* Código de Convite */}
          <div className="border-t border-border-light mt-6 pt-6">
            <p className="text-[13px] font-semibold mb-3">Código de Convite</p>
            <div className="bg-bg-soft rounded-xl p-4 flex items-center justify-between">
              <span className="text-xl font-bold tracking-[0.25em] text-text-primary">
                {republica.codigoConvite.split('').join(' ')}
              </span>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={handleCopyCode}
                  className="p-2 bg-white rounded-lg hover:bg-bg-soft transition-colors shadow-sm"
                >
                  <Copy className={`w-4 h-4 ${copied ? 'text-accent-green' : 'text-text-secondary'}`} />
                </button>
                <button className="p-2 bg-white rounded-lg hover:bg-bg-soft transition-colors shadow-sm">
                  <RefreshCw className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="space-y-3">
        <Button variant="destructive" className="w-full" onClick={() => setShowSairDialog(true)}>
          <Trash2 className="w-4 h-4 text-accent-red" />
          Sair da República
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => setShowSairContaDialog(true)}>
          <LogOut className="w-4 h-4" />
          Sair da Conta
        </Button>
      </div>

      {/* Dialogs */}
      <Dialog open={showSairDialog} onOpenChange={setShowSairDialog}>
        <DialogHeader>
          <DialogTitle>Confirmar saída</DialogTitle>
          <DialogClose onClick={() => setShowSairDialog(false)} />
        </DialogHeader>
        <DialogContent>
          <p className="text-[14px] text-text-secondary">Tem certeza que deseja sair da República ATHENAS? Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowSairDialog(false)} className="flex-1">Cancelar</Button>
            <Button variant="destructive" className="flex-1">Sair</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSairContaDialog} onOpenChange={setShowSairContaDialog}>
        <DialogHeader>
          <DialogTitle>Sair da conta</DialogTitle>
          <DialogClose onClick={() => setShowSairContaDialog(false)} />
        </DialogHeader>
        <DialogContent>
          <p className="text-[14px] text-text-secondary">Tem certeza que deseja sair da sua conta?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowSairContaDialog(false)} className="flex-1">Cancelar</Button>
            <Button variant="destructive" className="flex-1">Sair</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
