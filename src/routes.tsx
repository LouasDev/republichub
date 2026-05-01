import { createBrowserRouter, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Notificacoes } from '@/pages/Notificacoes';
import { useRepublicaStore } from '@/stores';
import { Dashboard } from '@/pages/Dashboard';
import { Financas } from '@/pages/Financas';
import { Compras } from '@/pages/Compras';
import { ComprasDetalhe } from '@/pages/ComprasDetalhe';
import { Tarefas } from '@/pages/Tarefas';
import { Metas } from '@/pages/Metas';
import { VisaoGeral } from '@/pages/VisaoGeral';
import { Moradores } from '@/pages/Moradores';
import { Configuracoes } from '@/pages/Configuracoes';

function Layout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notificacoes } = useRepublicaStore();
  const unreadCount = notificacoes.filter(n => !n.lida).length;

  return (
    <>
      <Shell
        onNotifications={() => setShowNotifications(true)}
        unreadCount={unreadCount}
      >
        <Outlet />
      </Shell>
      {showNotifications && <Notificacoes onClose={() => setShowNotifications(false)} />}
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/financas', element: <Financas /> },
      { path: '/compras', element: <Compras /> },
      { path: '/compras/:id', element: <ComprasDetalhe /> },
      { path: '/tarefas', element: <Tarefas /> },
      { path: '/metas', element: <Metas /> },
      { path: '/visao-geral', element: <VisaoGeral /> },
      { path: '/moradores', element: <Moradores /> },
      { path: '/configuracoes', element: <Configuracoes /> },
    ],
  },
]);
