-- ================================================================
--  Mi Vida — Base de datos (Supabase)
--  Copia TODO esto y pégalo en Supabase → SQL Editor → Run
-- ================================================================

-- Una sola fila por usuario, guarda todo tu estado como JSON.
create table if not exists estado (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Seguridad: cada quien solo ve y edita SUS propios datos.
alter table estado enable row level security;

drop policy if exists "leer lo propio"      on estado;
drop policy if exists "insertar lo propio"  on estado;
drop policy if exists "actualizar lo propio" on estado;

create policy "leer lo propio"       on estado for select using (auth.uid() = user_id);
create policy "insertar lo propio"   on estado for insert with check (auth.uid() = user_id);
create policy "actualizar lo propio" on estado for update using (auth.uid() = user_id);
