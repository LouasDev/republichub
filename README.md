# 🏠 RepublicHub

> Gestão colaborativa para repúblicas estudantis

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## Visão Geral

RepublicHub é uma aplicação web para gestão colaborativa de repúblicas estudantis. Resolve três dores principais:

1. **Divisão de despesas** com regras claras e taxas punitivas
2. **Distribuição justa de tarefas** domésticas via gamificação com Pontos de Esforço (PE)
3. **Governança transparente** da casa com código de convite

## ✨ Funcionalidades

| Módulo | Descrição |
|---|---|
| **Dashboard** | Saldo, tarefas, despesas recentes, mural de avisos e atalhos rápidos |
| **Finanças** | Despesas recorrentes (aluguel, internet), pendências, histórico e saldos |
| **Compras** | Listas colaborativas com barra de progresso e status em tempo real |
| **Tarefas** | Score de contribuição, busca, abas (Minhas/Todas/Disponíveis) |
| **Metas** | Objetivos da república com acompanhamento |
| **Visão Geral** | KPIs da casa, cards detalhados por morador com métricas |
| **Moradores** | Lista completa com score, concluídas, falhadas e taxa |
| **Configurações** | Perfil, dados da república, código de convite |
| **Notificações** | Painel lateral com 40+ tipos de notificações |

## 🛠 Stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** — design system com variáveis customizadas
- **Zustand** — estado global (uma store por domínio)
- **React Router v6** — roteamento
- **Lucide React** — ícones
- **Recharts** — gráficos de despesas
- **date-fns** — formatação de datas (pt-BR)

## 📁 Estrutura

```
src/
├── App.tsx
├── main.tsx
├── routes.tsx
├── components/
│   ├── ui/          # Botões, inputs, cards, tabs, badges, dialogs
│   ├── layout/      # Sidebar (desktop) + BottomNav (mobile)
│   └── shared/      # Avatar, ScoreBadge, MoneyText, EmptyState
├── pages/           # 10 páginas completas
├── stores/          # Zustand store com ações
├── types/           # Interfaces TypeScript
├── mocks/           # Dados mockados em memória
├── lib/             # Utils (cn, formatters)
└── styles/          # globals.css com design system
```

## 🎨 Design System

O design é **clean, fluido e responsivo**:

- **Desktop (≥1024px):** Sidebar fixa lateral com 260px
- **Mobile (<1024px):** Bottom navigation com 5 itens
- Cards com bordas sutis + sombras leves
- Tipografia Inter com hierarquia clara
- Feedback tátil (`active:scale-[0.98]`) e transições suaves
- Espaçamento consistente com sistema de 4px

## 🚀 Começando

```bash
# Instalar dependências
npm install

# Rodar dev server
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

A aplicação estará disponível em `http://localhost:5173/`

## 📊 Conceitos do Produto

### Pontos de Esforço (PE)
Cada tarefa tem um peso em PE. Ao concluir, o morador ganha PE no Score.

### Score de Contribuição
Soma dos PE com modificadores. É o "ranking" da casa.

### Taxa Punitiva
Percentual de tarefas falhadas. Taxas altas geram multas financeiras.

### Crédito/Débito
PE não realizado vira dinheiro: quem fez a tarefa de outro recebe em R$.

## 📱 Screenshots

| Desktop | Mobile |
|---|---|
| Sidebar lateral fixa | Bottom navigation |
| Grid 2 colunas | Coluna única |
| Header hero | Header compacto |

## 📄 License

MIT

---

Feito com ❤️ para repúblicas estudantis
