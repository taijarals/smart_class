# Configuração do Banco de Dados Supabase (Smart Class)

Este guia orienta sobre as decisões de arquitetura de banco de dados e fornece o script SQL completo para você rodar no seu painel do Supabase.

---

## 🏛️ Decisão de Arquitetura: Divisão de Usuários em 3 Tabelas Relacionadas (Normalização Completa)

Para garantir as melhores práticas de banco de dados, o aplicativo foi desenhado com **3 tabelas altamente acopladas e normalizadas**, ligadas por chaves estrangeiras no schema padrão/público (`public`), o que evita qualquer erro de "Invalid Schema" (`PGRST106`):

1. **`sc_usuarios` (Informações de Perfil e Controle):**
   * Armazena dados essenciais para identificação e controle de acesso.
   * `id`: Chave primária (pode receber o UUID do Supabase Auth).
   * `nome`, `email`, `usuario`.
   * `role`: Define o tipo de acesso (`aluno` ou `professor`).
   * `approved`: Flag de controle para aprovação de contas (RN5.1).
   * `is_admin`: Permissões administrativas globais (RN5.4).

2. **`sc_perfis_academicos` (Dados de Gamificação e Identificação):**
   * Armazena dados acadêmicos e progresso do usuário.
   * `usuario_id`: Chave primária e estrangeira referenciando `sc_usuarios(id)` com cascata (`ON DELETE CASCADE`).
   * `matricula`: Identificador único escolar.
   * `xp`, `level`, `completed_quizzes_count`.

3. **`sc_saldos` (ClassCoins e Finanças):**
   * Armazena o saldo atual da moeda virtual da plataforma.
   * `usuario_id`: Chave primária e estrangeira referenciando `sc_usuarios(id)` com cascata (`ON DELETE CASCADE`).
   * `coins_saldo`: Saldo atual de ClassCoins (inicia com 150 moedas de bônus).

### Benefícios dessa Abordagem:
* **Sem Semântica Conflitante:** Não guardamos professores em uma tabela chamada "estudantes". A tabela central agora se chama `sc_usuarios`.
* **Sem Conflitos de Senha/Autenticação:** As credenciais de acesso, logins e senhas ficam gerenciadas pelo sistema nativo de **Authentication** do Supabase (`auth.users`). Nossa tabela de usuários guarda apenas os metadados do perfil.
* **Schema Público Padrão:** Por usarmos o schema padrão `public`, você não precisa habilitar configurações complexas de schemas expostos na API do Supabase, evitando erros de PostgREST.

---

## 🚀 Script SQL Completo para Reconstruir o Banco do Zero (Schema Customizado)

Como você está dividindo o projeto com outras aplicações, criaremos um schema exclusivo chamado `smartclass`. Para que isso funcione, siga estas duas etapas fundamentais:

### PASSO 1: Expor o Schema na API (IMPORTANTE)
1. No painel do seu Supabase, vá em **Project Settings** (o ícone de engrenagem no menu esquerdo).
2. Clique em **API** no menu lateral de configurações.
3. Na seção **API Settings**, procure pelo campo **Exposed schemas**.
4. Clique no campo, digite `smartclass` e selecione/adicione na lista.
5. Salve as alterações. Se o Supabase não salvar automaticamente, certifique-se de clicar no botão verde de "Save" que aparecerá.

### PASSO 2: Rodar o Script de Banco de Dados
Abra o **SQL Editor** no painel do seu Supabase, cole o bloco de código abaixo e clique em **Run**:

```sql
-- 1. Criação do Schema e Permissões
CREATE SCHEMA IF NOT EXISTS smartclass;
GRANT USAGE ON SCHEMA smartclass TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA smartclass TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA smartclass TO anon, authenticated;

-- 2. Remover tabelas antigas (caso existam) para garantir recriação limpa e sem conflitos
DROP TABLE IF EXISTS smartclass.sc_checkins_quiz CASCADE;
DROP TABLE IF EXISTS smartclass.sc_resgates CASCADE;
DROP TABLE IF EXISTS smartclass.sc_solicitacoes CASCADE;
DROP TABLE IF EXISTS smartclass.sc_questoes CASCADE;
DROP TABLE IF EXISTS smartclass.sc_aulas CASCADE;
DROP TABLE IF EXISTS smartclass.sc_turmas CASCADE;
DROP TABLE IF EXISTS smartclass.sc_assuntos CASCADE;
DROP TABLE IF EXISTS smartclass.sc_disciplinas CASCADE;
DROP TABLE IF EXISTS smartclass.sc_cursos CASCADE;
DROP TABLE IF EXISTS smartclass.sc_saldos CASCADE;
DROP TABLE IF EXISTS smartclass.sc_perfis_academicos CASCADE;
DROP TABLE IF EXISTS smartclass.sc_usuarios CASCADE;

-- 3. Tabela Central de Usuários (Estudantes, Professores e Administradores)
CREATE TABLE smartclass.sc_usuarios (
  id TEXT PRIMARY KEY, -- Recebe o ID do Supabase Auth ou IDs locais
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  usuario TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL, -- Mantida para compatibilidade direta de login local de demonstração
  role TEXT DEFAULT 'aluno' NOT NULL, -- 'aluno' | 'professor'
  approved BOOLEAN DEFAULT false NOT NULL, -- Requer aprovação do Administrador (RN5.1)
  is_admin BOOLEAN DEFAULT false NOT NULL, -- Flag de Administrador global (RN5.4)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Perfis Acadêmicos (1:1 com sc_usuarios)
CREATE TABLE smartclass.sc_perfis_academicos (
  usuario_id TEXT PRIMARY KEY REFERENCES smartclass.sc_usuarios(id) ON DELETE CASCADE,
  matricula TEXT UNIQUE NOT NULL,
  xp INTEGER DEFAULT 0 NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  completed_quizzes_count INTEGER DEFAULT 0 NOT NULL
);

-- 5. Tabela de Saldos e Moedas (1:1 com sc_usuarios)
CREATE TABLE smartclass.sc_saldos (
  usuario_id TEXT PRIMARY KEY REFERENCES smartclass.sc_usuarios(id) ON DELETE CASCADE,
  coins_saldo INTEGER DEFAULT 150 NOT NULL -- Bônus de 150 ClassCoins ao iniciar (RN2.1)
);

-- 5.a Tabela de Cursos
CREATE TABLE smartclass.sc_cursos (
  id BIGINT PRIMARY KEY,
  nome TEXT NOT NULL
);

-- 5.b Tabela de Disciplinas
CREATE TABLE smartclass.sc_disciplinas (
  id BIGINT PRIMARY KEY,
  curso_id BIGINT REFERENCES smartclass.sc_cursos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL
);

-- 6. Tabela de Assuntos das Aulas
CREATE TABLE smartclass.sc_assuntos (
  id BIGINT PRIMARY KEY,
  disciplina_id BIGINT REFERENCES smartclass.sc_disciplinas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  status BOOLEAN DEFAULT true NOT NULL -- Ativo ou Inativo para sorteio
);

-- 7. Tabela de Turmas
CREATE TABLE smartclass.sc_turmas (
  id BIGINT PRIMARY KEY,
  curso_id BIGINT REFERENCES smartclass.sc_cursos(id) ON DELETE CASCADE,
  disciplina_id BIGINT REFERENCES smartclass.sc_disciplinas(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL,
  periodo TEXT NOT NULL,
  dia_da_semana TEXT NOT NULL,
  horario TEXT NOT NULL,
  checkin_ativo BOOLEAN DEFAULT false NOT NULL -- Ativado pelo professor no início da aula
);

-- 8. Tabela de Questões Gamificadas (Quizzes)
CREATE TABLE smartclass.sc_questoes (
  id TEXT PRIMARY KEY,
  assunto_id BIGINT REFERENCES smartclass.sc_assuntos(id) ON DELETE CASCADE,
  enunciado TEXT NOT NULL,
  opcoes JSONB NOT NULL, -- Formato: {"A": "Opção A", "B": "Opção B", ...}
  resposta_correta TEXT NOT NULL, -- 'A' | 'B' | 'C' | 'D' | 'E'
  nivel TEXT NOT NULL, -- 'Facil' | 'Medio' | 'Dificil'
  status BOOLEAN DEFAULT true NOT NULL
);

-- 9. Tabela de Solicitações de Matrículas em Turmas
CREATE TABLE smartclass.sc_solicitacoes (
  id TEXT PRIMARY KEY,
  aluno_nome TEXT NOT NULL,
  aluno_matricula TEXT NOT NULL,
  turmas_solicitadas TEXT[] NOT NULL,
  status TEXT DEFAULT 'PENDENTE' NOT NULL -- 'PENDENTE' | 'APROVADO' | 'RECUSADO'
);

-- 10. Tabela de Resgates de Benefícios na Loja
CREATE TABLE smartclass.sc_resgates (
  id TEXT PRIMARY KEY,
  aluno_id TEXT REFERENCES smartclass.sc_usuarios(id) ON DELETE CASCADE,
  coins_gastos INTEGER NOT NULL,
  beneficio TEXT NOT NULL,
  data_resgate TEXT NOT NULL
);

-- 11. Tabela de Check-ins e Tentativas de Quizzes Realizados
CREATE TABLE smartclass.sc_checkins_quiz (
  id TEXT PRIMARY KEY,
  aluno_id TEXT REFERENCES smartclass.sc_usuarios(id) ON DELETE CASCADE,
  aula_id BIGINT REFERENCES smartclass.sc_turmas(id) ON DELETE CASCADE,
  iniciado_em TEXT NOT NULL,
  finalizado_em TEXT,
  questoes_sorteadas TEXT[] NOT NULL,
  respostas_aluno JSONB DEFAULT '{}'::jsonb NOT NULL,
  acertos INTEGER NOT NULL,
  coins_ganhos INTEGER NOT NULL,
  status TEXT DEFAULT 'concluido' NOT NULL -- 'em_progresso' | 'concluido' | 'expirado'
);

-- 12. Garantir permissões nas tabelas recém criadas
GRANT ALL ON ALL TABLES IN SCHEMA smartclass TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA smartclass TO anon, authenticated;

-- 13. Inserir Massa Inicial de Testes (Professor e Aluno de Exemplo)
-- Inserir nos Usuários
-- Senhas pré-hasheadas ('admin123' e 'aluno123') usando bcrypt com cost 10
INSERT INTO smartclass.sc_usuarios (id, nome, email, usuario, senha, role, approved, is_admin)
VALUES 
('prof-1', 'Dr. Ricardo Veras', 'ricardo.veras@universidade.edu.br', 'ricardo', '$2b$10$Ml2VIcXwfND08x2RxE9YOe3.LX2nP5Msy6Y9BFa3rt3VAg54gXnGW', 'professor', true, true),
('st-1', 'Ana Luíza Costa', 'ana.costa@universidade.edu.br', 'ana', '$2b$10$a.yx1EvtJIKWXHCDZBdly.2WY8.XWJtvyt.1gfqEMasdjqkQiE0XK', 'aluno', true, false)
ON CONFLICT (id) DO NOTHING;

-- Inserir nos Perfis Acadêmicos
INSERT INTO smartclass.sc_perfis_academicos (usuario_id, matricula, xp, level, completed_quizzes_count)
VALUES 
('prof-1', '99999', 10000, 99, 0),
('st-1', '20240551-0', 2400, 8, 12)
ON CONFLICT (usuario_id) DO NOTHING;

-- Inserir nos Saldos
INSERT INTO smartclass.sc_saldos (usuario_id, coins_saldo)
VALUES 
('prof-1', 0),
('st-1', 540)
ON CONFLICT (usuario_id) DO NOTHING;

-- ATENÇÃO: Recarregar o cache do schema do PostgREST para evitar o erro "Could not find the column in the schema cache"
NOTIFY pgrst, reload_schema;
```

---

## 🔒 Segurança e Row Level Security (RLS)

Por padrão, para facilitar seus testes e o desenvolvimento rápido, você pode configurar o acesso anônimo de leitura/escrita para as tabelas no schema `public`. 

Se desejar habilitar o **Row Level Security (RLS)**, siga os passos abaixo no painel do Supabase:
1. Vá em **Database** -> **Policies**.
2. Clique em **Enable RLS** para cada tabela criada.
3. Crie uma política simples do tipo `Enable read and write access for all users` (Permitir acesso completo a anon/autenticados) para que a aplicação consiga ler e gravar os dados perfeitamente.

---

## 🛠️ Auto-Configuração de Administrador (`taijara@gmail.com`)

O código do Smart Class foi implementado de forma inteligente:
* Ao realizar o login utilizando o **Supabase Auth** com o seu e-mail `taijara@gmail.com`, o sistema irá autenticar com sucesso a sua conta.
* Se o seu perfil ainda não existir na tabela `public.sc_usuarios`, o sistema irá **criar automaticamente** o seu registro nas 3 tabelas de banco de dados (`sc_usuarios`, `sc_perfis_academicos`, `sc_saldos`) com os privilégios máximos de **Administrador** (`is_admin: true`) e **Aprovado** (`approved: true`).
* Se o perfil já existir, o sistema garantirá que ele esteja atualizado com as flags de administrador ligadas.
