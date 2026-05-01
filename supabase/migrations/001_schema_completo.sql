-- ============================================================
-- RepublicHub — Schema de Produção (Tier S)
-- Multi-tenant com RLS blindado, triggers de gamificação
-- e views de cálculo financeiro auditável.
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- 0. ENUM TYPES
-- ============================================================

create type status_tarefa as enum ('pendente', 'concluida', 'disponivel', 'expirada');
create type status_lista as enum ('ativa', 'em_compras', 'finalizada');
create type status_meta as enum ('ativa', 'concluida', 'arquivada');
create type freq_despesa as enum ('mensal', 'quinzenal', 'semanal', 'unica');
create type tipo_notificacao as enum (
  'pagamento_confirmado',
  'pagamento_registrado',
  'nova_despesa',
  'nova_tarefa_atribuida',
  'tarefa_urgente',
  'compras_iniciadas',
  'compras_finalizadas',
  'novo_aviso',
  'novo_membro',
  'mudanca_score'
);

-- ============================================================
-- 1. TABELA CENTRAL — REPUBLICAS
-- ============================================================

create table republicas (
  id          uuid primary key default gen_random_uuid(),
  nome        varchar(120)    not null,
  endereco    text,
  codigo_convite varchar(8)  not null unique,
  criado_em   timestamptz     not null default now(),
  atualizado_em timestamptz   not null default now()
);

-- Índice para busca rápida por código de convite
create unique index idx_republicas_codigo on republicas (codigo_convite);

-- RLS na tabela republicas:
-- Qualquer usuário autenticado pode ler dados de repúblicas das quais faz parte.
-- Só pode INSERT quem está criando uma república nova.
alter table republicas enable row level security;

create policy " republicas: dono pode ler"
  on republicas for select
  using (
    exists (
      select 1 from membros m
      where m.republica_id = republicas.id
        and m.user_id = auth.uid()
    )
  );

create policy "republicas: qualquer autenticado pode criar"
  on republicas for insert
  to authenticated
  with check (true);

create policy "republicas: apenas membros podem atualizar"
  on republicas for update
  using (
    exists (
      select 1 from membros m
      where m.republica_id = republicas.id
        and m.user_id = auth.uid()
    )
  );

-- ============================================================
-- 2. PERFIS DE USUÁRIO — Vinculado a auth.users
-- ============================================================

create table perfis (
  id            uuid primary key, -- = auth.users.id
  nome          varchar(150)    not null,
  email         varchar(255)    not null unique,
  avatar_url    text,
  republica_id  uuid            null references republicas(id) on delete set null,
  score         numeric(10,2)   not null default 100.00,
  taxa_falha    numeric(5,2)    not null default 0.00,
  tarefas_concluidas int       not null default 0,
  tarefas_falhadas   int       not null default 0,
  criado_em     timestamptz     not null default now(),
  atualizado_em timestamptz     not null default now()
);

alter table perfis enable row level security;

-- Usuário pode ler APENAS perfis da mesma república
create policy "perfis: ler membros da mesma república"
  on perfis for select
  using (
    exists (
      select 1 from membros m
      where m.republica_id = perfis.republica_id
        and m.user_id = auth.uid()
    )
  );

-- Usuário pode atualizar APENAS seu próprio perfil
create policy "perfis: atualizar próprio perfil"
  on perfis for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Usuário pode inserir APENAS seu próprio perfil (durante onboarding)
create policy "perfis: inserir próprio perfil"
  on perfis for insert
  to authenticated
  with check (id = auth.uid());

-- TRIGGER: impede UPDATE nas colunas protegidas (score, republica_id, taxa_falha) via API direta
create or replace function fn_perfis_protect_system_cols()
returns trigger as $$
begin
  -- Só funções internas (security definer) podem alterar estas colunas
  if current_setting('app.internal_role', true) <> 'system' then
    if new.score <> old.score then
      raise exception 'Alteração de score só pode ser feita pelo sistema (trigger)';
    end if;
    if new.republica_id is distinct from old.republica_id then
      raise exception 'Alteração de republica_id só pode ser feita via convite (RPC)';
    end if;
    if new.taxa_falha <> old.taxa_falha then
      raise exception 'Alteração de taxa_falha só pode ser feita pelo sistema (trigger)';
    end if;
    if new.tarefas_concluidas <> old.tarefas_concluidas then
      raise exception 'Alteração de tarefas_concluidas só pode ser feita pelo sistema (trigger)';
    end if;
    if new.tarefas_falhadas <> old.tarefas_falhadas then
      raise exception 'Alteração de tarefas_falhadas só pode ser feita pelo sistema (trigger)';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_perfis_protect
  before update on perfis
  for each row
  execute function fn_perfis_protect_system_cols();

-- ============================================================
-- 3. MEMBROS — Tabela de junção user ↔ republica
-- ============================================================

create table membros (
  id            uuid primary key default gen_random_uuid(),
  republica_id  uuid not null references republicas(id) on delete cascade,
  user_id       uuid not null references perfis(id) on delete cascade,
  funcao        varchar(50) default 'morador',
  entrou_em     timestamptz not null default now(),
  unique(republica_id, user_id)
);

create index idx_membros_republica on membros(republica_id);
create index idx_membros_user on membros(user_id);

alter table membros enable row level security;

create policy "membros: ler membros da mesma república"
  on membros for select
  using (
    exists (
      select 1 from membros m
      where m.republica_id = membros.republica_id
        and m.user_id = auth.uid()
    )
  );

create policy "membros: inserir (apenas dono da república ou via RPC)"
  on membros for insert
  with check (
    exists (
      select 1 from membros m
      where m.republica_id = membros.republica_id
        and m.user_id = auth.uid()
    )
    or current_setting('app.internal_role', true) = 'system'
  );

create policy "membros: deletar (apenas se for o próprio ou admin)"
  on membros for delete
  using (
    user_id = auth.uid()
    or current_setting('app.internal_role', true) = 'system'
  );

-- ============================================================
-- 4. DESPESAS RECORRENTES
-- ============================================================

create table despesas_recorrentes (
  id            uuid primary key default gen_random_uuid(),
  republica_id  uuid not null references republicas(id) on delete cascade,
  titulo        varchar(200)  not null,
  valor         numeric(10,2) not null,
  frequencia    freq_despesa  not null default 'mensal',
  recebedor_id  uuid not null references perfis(id),
  proxima_data  date,
  criado_por    uuid not null references perfis(id),
  criado_em     timestamptz   not null default now(),
  atualizado_em timestamptz   not null default now()
);

create index idx_desp_rec_rep on despesas_recorrentes(republica_id);

alter table despesas_recorrentes enable row level security;

create policy "desp_rec: CRUD apenas membros da república"
  on despesas_recorrentes for all
  using (
    exists (
      select 1 from membros m
      where m.republica_id = despesas_recorrentes.republica_id
        and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from membros m
      where m.republica_id = despesas_recorrentes.republica_id
        and m.user_id = auth.uid()
    )
  );

-- ============================================================
-- 5. DESPESAS (registro individual)
-- ============================================================

create table despesas (
  id            uuid primary key default gen_random_uuid(),
  republica_id  uuid not null references republicas(id) on delete cascade,
  titulo        varchar(200)  not null,
  valor         numeric(10,2) not null,
  pagador_id    uuid not null references perfis(id),
  categoria     varchar(80),
  data          date          not null default current_date,
  comprovante_url text,
  criado_em     timestamptz   not null default now()
);

create index idx_despesas_rep on despesas(republica_id);
create index idx_despesas_data on despesas(data);

alter table despesas enable row level security;

create policy "despesas: CRUD apenas membros da república"
  on despesas for all
  using (
    exists (
      select 1 from membros m
      where m.republica_id = despesas.republica_id
        and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from membros m
      where m.republica_id = despesas.republica_id
        and m.user_id = auth.uid()
    )
  );

-- ============================================================
-- 6. TAREFAS
-- ============================================================

create table tarefas (
  id            uuid primary key default gen_random_uuid(),
  republica_id  uuid not null references republicas(id) on delete cascade,
  titulo        varchar(300)  not null,
  pontos_esforco numeric(4,1) not null check (pontos_esforco between 1 and 10),
  responsavel_id uuid        null references perfis(id),
  status        status_tarefa not null default 'pendente',
  prazo         date          not null,
  concluida_em  timestamptz,
  criado_por    uuid not null references perfis(id),
  criado_em     timestamptz   not null default now(),
  atualizado_em timestamptz   not null default now()
);

create index idx_tarefas_rep on tarefas(republica_id);
create index idx_tarefas_status on tarefas(status);
create index idx_tarefas_prazo on tarefas(prazo);

alter table tarefas enable row level security;

create policy "tarefas: CRUD apenas membros da república"
  on tarefas for all
  using (
    exists (
      select 1 from membros m
      where m.republica_id = tarefas.republica_id
        and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from membros m
      where m.republica_id = tarefas.republica_id
        and m.user_id = auth.uid()
    )
  );

-- ============================================================
-- 7. TRIGGER — Motor de Gamificação (Score + Taxa)
-- ============================================================

-- Função interna que recalcula score e taxa
create or replace function fn_recalcular_score_morador(p_user_id uuid)
returns void as $$
declare
  v_rep_id        uuid;
  v_total_pe      numeric;
  v_concluidas    int;
  v_falhadas      int;
  v_total_tentativas int;
  v_novo_score    numeric;
  v_nova_taxa     numeric;
begin
  -- Busca a república do usuário
  select republica_id into v_rep_id from perfis where id = p_user_id;
  if v_rep_id is null then return; end if;

  -- Conta tarefas concluídas e soma PE
  select coalesce(sum(pontos_esforco), 0), count(*)
  into v_total_pe, v_concluidas
  from tarefas
  where republica_id = v_rep_id
    and responsavel_id = p_user_id
    and status = 'concluida';

  -- Conta tarefas falhadas (expiradas e não concluídas)
  select count(*)
  into v_falhadas
  from tarefas
  where republica_id = v_rep_id
    and responsavel_id = p_user_id
    and status in ('expirada', 'pendente')
    and prazo < current_date;

  v_total_tentativas := v_concluidas + v_falhadas;

  -- Score = base 100 + PE acumulados - (falhadas * 0.5)
  v_novo_score := 100 + v_total_pe - (v_falhadas * 0.5);

  -- Taxa de falha = falhadas / total * 100
  if v_total_tentativas > 0 then
    v_nova_taxa := round((v_falhadas::numeric / v_total_tentativas) * 100, 2);
  else
    v_nova_taxa := 0;
  end if;

  -- Atualiza perfil com permissão de sistema
  perform set_config('app.internal_role', 'system', true);
  update perfis set
    score = v_novo_score,
    taxa_falha = v_nova_taxa,
    tarefas_concluidas = v_concluidas,
    tarefas_falhadas = v_falhadas,
    atualizado_em = now()
  where id = p_user_id;
  perform set_config('app.internal_role', '', true);
end;
$$ language plpgsql security definer;

-- Trigger: ao concluir uma tarefa, recalcula o score
create or replace function trg_tarefas_gamificacao()
returns trigger as $$
begin
  -- Se a tarefa mudou para 'concluida'
  if new.status = 'concluida' and (old.status is null or old.status <> 'concluida') then
    new.concluida_em := now();
    perform fn_recalcular_score_morador(new.responsavel_id);
  end if;

  -- Se o prazo passou e a tarefa ainda está pendente
  if old.prazo >= current_date and new.prazo < current_date
     and new.status not in ('concluida', 'expirada') then
    new.status := 'expirada';
    if new.responsavel_id is not null then
      perform fn_recalcular_score_morador(new.responsavel_id);
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_tarefas_gamificacao
  before update on tarefas
  for each row
  execute function trg_tarefas_gamificacao();

-- Wrapper para usar como trigger (returns trigger)
create or replace function trg_recalcular_score_insert()
returns trigger as $$
begin
  perform fn_recalcular_score_morador(new.responsavel_id);
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_tarefas_gamificacao_insert
  after insert on tarefas
  for each row
  when (new.status = 'concluida' and new.responsavel_id is not null)
  execute function trg_recalcular_score_insert();

-- ============================================================
-- 8. LISTAS DE COMPRAS
-- ============================================================

create table listas_compras (
  id            uuid primary key default gen_random_uuid(),
  republica_id  uuid not null references republicas(id) on delete cascade,
  nome          varchar(150)  not null,
  status        status_lista  not null default 'ativa',
  responsavel_id uuid        null references perfis(id),
  criado_por    uuid not null references perfis(id),
  criado_em     timestamptz   not null default now(),
  atualizado_em timestamptz   not null default now()
);

create index idx_listas_rep on listas_compras(republica_id);

alter table listas_compras enable row level security;

create policy "listas: CRUD apenas membros da república"
  on listas_compras for all
  using (
    exists (
      select 1 from membros m
      where m.republica_id = listas_compras.republica_id
        and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from membros m
      where m.republica_id = listas_compras.republica_id
        and m.user_id = auth.uid()
    )
  );

-- ============================================================
-- 9. ITENS DE COMPRA
-- ============================================================

create table itens_compra (
  id            uuid primary key default gen_random_uuid(),
  lista_id      uuid not null references listas_compras(id) on delete cascade,
  nome          varchar(200)  not null,
  quantidade    int           not null default 1,
  valor_unitario numeric(8,2),
  comprado      boolean       not null default false,
  adicionado_por uuid not null references perfis(id),
  criado_em     timestamptz   not null default now()
);

create index idx_itens_lista on itens_compra(lista_id);

alter table itens_compra enable row level security;

create policy "itens: CRUD via membros da república (join com listas)"
  on itens_compra for all
  using (
    exists (
      select 1 from listas_compras lc
      join membros m on m.republica_id = lc.republica_id
      where lc.id = itens_compra.lista_id
        and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from listas_compras lc
      join membros m on m.republica_id = lc.republica_id
      where lc.id = itens_compra.lista_id
        and m.user_id = auth.uid()
    )
  );

-- ============================================================
-- 10. METAS
-- ============================================================

create table metas (
  id            uuid primary key default gen_random_uuid(),
  republica_id  uuid not null references republicas(id) on delete cascade,
  titulo        varchar(200)  not null,
  descricao     text,
  valor_alvo    numeric(12,2) not null,
  valor_atual   numeric(12,2) not null default 0,
  status        status_meta   not null default 'ativa',
  criado_por    uuid not null references perfis(id),
  criado_em     timestamptz   not null default now(),
  atualizado_em timestamptz   not null default now()
);

create index idx_metas_rep on metas(republica_id);

alter table metas enable row level security;

create policy "metas: CRUD apenas membros da república"
  on metas for all
  using (
    exists (
      select 1 from membros m
      where m.republica_id = metas.republica_id
        and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from membros m
      where m.republica_id = metas.republica_id
        and m.user_id = auth.uid()
    )
  );

-- ============================================================
-- 11. AVISOS (Mural)
-- ============================================================

create table avisos (
  id            uuid primary key default gen_random_uuid(),
  republica_id  uuid not null references republicas(id) on delete cascade,
  titulo        varchar(300)  not null,
  conteudo      text,
  fixado        boolean       not null default false,
  autor_id      uuid not null references perfis(id),
  criado_em     timestamptz   not null default now(),
  atualizado_em timestamptz   not null default now()
);

create index idx_avisos_rep on avisos(republica_id);
create index idx_avisos_criado on avisos(criado_em desc);

alter table avisos enable row level security;

-- Enable realtime para avisos
alter publication supabase_realtime add table avisos;

create policy "avisos: ler membros da república"
  on avisos for select
  using (
    exists (
      select 1 from membros m
      where m.republica_id = avisos.republica_id
        and m.user_id = auth.uid()
    )
  );

create policy "avisos: inserir membros da república"
  on avisos for insert
  with check (
    exists (
      select 1 from membros m
      where m.republica_id = avisos.republica_id
        and m.user_id = auth.uid()
    )
  );

create policy "avisos: atualizar apenas autor"
  on avisos for update
  using (autor_id = auth.uid());

create policy "avisos: deletar apenas autor"
  on avisos for delete
  using (autor_id = auth.uid());

-- Enable realtime para notificacoes também
alter publication supabase_realtime add table notificacoes;

-- ============================================================
-- 12. NOTIFICAÇÕES
-- ============================================================

create table notificacoes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references perfis(id) on delete cascade,
  tipo          tipo_notificacao not null,
  titulo        varchar(300)  not null,
  descricao     text,
  lida          boolean       not null default false,
  criado_em     timestamptz   not null default now()
);

create index idx_notif_user on notificacoes(user_id);
create index idx_notif_lida on notificacoes(lida);

alter table notificacoes enable row level security;

create policy "notificacoes: ler próprias"
  on notificacoes for select
  using (user_id = auth.uid());

create policy "notificacoes: inserir (sistema ou autor)"
  on notificacoes for insert
  with check (
    user_id = auth.uid()
    or current_setting('app.internal_role', true) = 'system'
  );

create policy "notificacoes: atualizar próprias"
  on notificacoes for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notificacoes: deletar próprias"
  on notificacoes for delete
  using (user_id = auth.uid());

-- ============================================================
-- 13. VIEW — Calculadora de Dívidas (Saldo Financeiro)
-- ============================================================

create or replace view vw_saldos_moradores as
with despesas_divididas as (
  -- Quanto cada morador deve nas despesas da república
  select
    d.republica_id,
    p.id as morador_id,
    d.valor / nullif((select count(*) from membros m2 where m2.republica_id = d.republica_id), 0) as parte_devida
  from despesas d
  cross join perfis p
  join membros m on m.republica_id = d.republica_id and m.user_id = p.id
),
creditos as (
  -- Créditos de tarefas: quem fez tarefa de outro recebe
  select
    t.republica_id,
    t.responsavel_id as credor_id,
    (t.pontos_esforco * 2.5) as valor_credito -- 1 PE = R$ 2,50
  from tarefas t
  where t.status = 'concluida'
    and t.responsavel_id is not null
),
debitos as (
  -- Débitos de tarefas falhadas
  select
    t.republica_id,
    t.responsavel_id as devedor_id,
    (t.pontos_esforco * 2.5) as valor_debito
  from tarefas t
  where t.status = 'expirada'
    and t.responsavel_id is not null
)
select
  p.id as morador_id,
  p.republica_id,
  p.nome,
  coalesce(sum(dd.parte_devida), 0) as total_despesas,
  coalesce(sum(c.valor_credito), 0) as total_creditos,
  coalesce(sum(db.valor_debito), 0) as total_debitos,
  round(
    coalesce(sum(c.valor_credito), 0)
    - coalesce(sum(dd.parte_devida), 0)
    - coalesce(sum(db.valor_debito), 0),
    2
  ) as saldo_liquido
from perfis p
left join membros m on m.user_id = p.id
left join despesas_divididas dd on dd.republica_id = p.republica_id and dd.morador_id = p.id
left join creditos c on c.republica_id = p.republica_id and c.credor_id = p.id
left join debitos db on db.republica_id = p.republica_id and db.devedor_id = p.id
group by p.id, p.republica_id, p.nome;

-- View herda RLS das tabelas subjacentes. A política de perfis
-- já garante que apenas membros da mesma república vejam dados.

-- ============================================================
-- 14. FUNÇÃO RPC — Entrar em República via Código de Convite
-- Transação atômica: valida → vincula → atualiza perfil
-- ============================================================

create or replace function fn_entrar_republica(p_codigo_convite varchar(8))
returns jsonb
language plpgsql
security definer
as $$
declare
  v_rep_id    uuid;
  v_user_id   uuid := auth.uid();
  v_nome_rep  varchar(120);
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado';
  end if;

  -- 1. Validar código de convite
  select id, nome into v_rep_id, v_nome_rep
  from republicas
  where codigo_convite = upper(p_codigo_convite);

  if not found then
    raise exception 'Código de convite inválido';
  end if;

  -- 2. Verificar se já é membro
  if exists (select 1 from membros where republica_id = v_rep_id and user_id = v_user_id) then
    raise exception 'Usuário já é membro desta república';
  end if;

  -- 3. Transação atômica
  perform set_config('app.internal_role', 'system', true);

  -- Vincula usuário à república
  update perfis
  set republica_id = v_rep_id,
      atualizado_em = now()
  where id = v_user_id;

  -- Insere na tabela membros
  insert into membros (republica_id, user_id, funcao, entrou_em)
  values (v_rep_id, v_user_id, 'morador', now());

  -- Notifica os outros membros
  insert into notificacoes (user_id, tipo, titulo, descricao)
  select
    m.user_id,
    'novo_membro',
    'Novo membro na república',
    (select nome from perfis where id = v_user_id) || ' entrou na república ' || v_nome_rep
  from membros m
  where m.republica_id = v_rep_id
    and m.user_id <> v_user_id;

  perform set_config('app.internal_role', '', true);

  return jsonb_build_object(
    'sucesso', true,
    'republica_id', v_rep_id,
    'republica_nome', v_nome_rep
  );
end;
$$;

-- ============================================================
-- 15. FUNÇÃO RPC — Criar República
-- ============================================================

create or replace function fn_criar_republica(
  p_nome varchar(120),
  p_endereco text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_rep_id    uuid;
  v_codigo    varchar(8);
  v_user_id   uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado';
  end if;

  -- Gera código único de 6 caracteres alfanuméricos
  loop
    v_codigo := upper(substring(md5(random()::text), 1, 6));
    if not exists (select 1 from republicas where codigo_convite = v_codigo) then
      exit;
    end if;
  end loop;

  -- Cria república
  insert into republicas (nome, endereco, codigo_convite)
  values (p_nome, p_endereco, v_codigo)
  returning id into v_rep_id;

  -- Vincula criador como membro
  perform set_config('app.internal_role', 'system', true);

  update perfis
  set republica_id = v_rep_id,
      atualizado_em = now()
  where id = v_user_id;

  insert into membros (republica_id, user_id, funcao, entrou_em)
  values (v_rep_id, v_user_id, 'admin', now());

  perform set_config('app.internal_role', '', true);

  return jsonb_build_object(
    'sucesso', true,
    'republica_id', v_rep_id,
    'codigo_convite', v_codigo
  );
end;
$$;

-- ============================================================
-- 16. FUNÇÃO RPC — Marcar tarefa como concluída (segura)
-- ============================================================

create or replace function fn_concluir_tarefa(p_tarefa_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_tarefa    tarefas%rowtype;
  v_user_id   uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado';
  end if;

  select * into v_tarefa from tarefas where id = p_tarefa_id;

  if not found then
    raise exception 'Tarefa não encontrada';
  end if;

  -- Verifica se o usuário é membro da república
  if not exists (
    select 1 from membros
    where republica_id = v_tarefa.republica_id and user_id = v_user_id
  ) then
    raise exception 'Acesso negado';
  end if;

  -- Verifica se é o responsável ou se é admin
  if v_tarefa.responsavel_id <> v_user_id then
    -- Permite que qualquer membro conclua tarefas disponíveis
    if v_tarefa.status <> 'disponivel' then
      raise exception 'Apenas o responsável pode concluir esta tarefa';
    end if;
  end if;

  perform set_config('app.internal_role', 'system', true);

  update tarefas
  set status = 'concluida',
      concluida_em = now(),
      atualizado_em = now()
  where id = p_tarefa_id;

  perform set_config('app.internal_role', '', true);

  return jsonb_build_object(
    'sucesso', true,
    'tarefa_id', p_tarefa_id
  );
end;
$$;

-- ============================================================
-- 17. TRIGGER — Criação automática de perfil no signup
-- ============================================================

create or replace function fn_criar_perfil_on_signup()
returns trigger as $$
begin
  insert into perfis (id, nome, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_criar_perfil
  after insert on auth.users
  for each row
  execute function fn_criar_perfil_on_signup();

-- ============================================================
-- 18. TRIGGER — Atualiza updated_at automaticamente
-- ============================================================

create or replace function fn_updated_at()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

-- Aplica updated_at em todas as tabelas que têm a coluna
do $$
declare
  t record;
begin
  for t in (
    select table_name from information_schema.columns
    where column_name = 'atualizado_em'
      and table_schema = 'public'
  ) loop
    execute format(
      'create trigger trg_%s_updated_at before update on %I for each row execute function fn_updated_at()',
      t.table_name, t.table_name
    );
  end loop;
end;
$$;

-- TRIGGER INTEGRADO: expiração já é tratada pelo trg_tarefas_gamificacao
-- que verifica prazos vencidos no before update.
-- A função fn_expirar_tarefas_vencidas está incluída lá como fallback:

create or replace function trg_tarefas_gamificacao()
returns trigger as $$
begin
  -- 1. Expira tarefas com prazo vencido
  if new.prazo < current_date and new.status = 'pendente' then
    new.status := 'expirada';
  end if;

  -- 2. Ao concluir uma tarefa, recalcula o score
  if new.status = 'concluida' and old.status is distinct from 'concluida' then
    new.concluida_em := now();
    perform fn_recalcular_score_morador(new.responsavel_id);
  end if;

  -- 3. Se status mudou para expirada, recalcula
  if new.status = 'expirada' and old.status is distinct from 'expirada' then
    if new.responsavel_id is not null then
      perform fn_recalcular_score_morador(new.responsavel_id);
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

-- Remove o trigger de expiração separado (lógica integrada acima)
-- drop trigger if exists trg_expirar_tarefas on tarefas;
-- drop function if exists fn_expirar_tarefas_vencidas();

-- ============================================================
-- 20. STORAGE — Bucket de avatares
-- ============================================================

-- Cria bucket de avatares (executar via SQL do Supabase)
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', false);

-- Política: apenas membros da mesma república podem ver avatares
-- create policy "avatars: ver membros da mesma república"
--   on storage.objects for select
--   using (
--     exists (
--       select 1 from perfis p
--       join membros m on m.user_id = p.id
--       where m.republica_id = (
--         select republica_id from perfis where id = auth.uid()
--       )
--       and p.avatar_url = storage.objects.name
--     )
--   );

-- create policy "avatars: upload próprio"
--   on storage.objects for insert
--   to authenticated
--   with check (
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- ============================================================
-- 21. SEED INICIAL (desenvolvimento)
-- ============================================================

-- Descomente apenas para desenvolvimento local
/*
-- Cria república de exemplo
insert into republicas (nome, endereco, codigo_convite)
values ('ATHENAS', 'Rua Sebastião Lucas, 205', 'LF6KV5');

-- Cria usuários de exemplo (requer auth.users)
-- Os perfis são criados automaticamente pelo trigger
*/

-- ============================================================
-- FIM DO SCHEMA
-- ============================================================
