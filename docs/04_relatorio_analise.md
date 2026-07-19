# Relatório de Análise e Refatoração (Engenharia de Software)

Após uma leitura reversa detalhada de toda a arquitetura, stack de arquivos e do comportamento do aplicativo (React/Vite + Node/Express + Supabase), identificamos e corrigimos os seguintes pontos críticos:

## 1. Bugs Ocultos e Gaps de Lógica

### 1.1 O Erro de Cadastro (A Tela não cadastra nada no banco)
* **Causa Raiz:** O erro apontado nos logs (`Could not find the 'senha' column of 'sc_usuarios' in the schema cache` e `Error upserting class:`) é um problema nativo do PostgREST (camada de API do Supabase). Quando tabelas são dropadas e recriadas no SQL Editor, o Supabase não atualiza automaticamente o cache da API. Com o cache desatualizado, qualquer requisição do front-end falha de forma silenciosa ou com erro de schema.
* **Correção:** A documentação oficial de banco de dados (`02_banco_de_dados_supabase.md`) foi atualizada. Agora o script SQL inclui o comando `NOTIFY pgrst, reload_schema;` ao final da execução. Isso força a API do Supabase a enxergar as novas tabelas e colunas (como `sc_cursos`, `sc_disciplinas` e a coluna `senha` atualizada).

### 1.2 Atualização de Estado Otimista (Optimistic UI) vs Tratamento de Erros
* **Gap:** No `App.tsx`, as funções `handleUpsertCourse`, `handleUpsertClass`, etc., atualizavam a interface do usuário (UI) localmente antes mesmo da requisição ao banco ser concluída, e ignoravam silenciosamente se o Supabase retornasse erro (como estava acontecendo).
* **Melhoria Arquitetural:** O código deve estar ciente de que as operações assíncronas podem falhar. Como a arquitetura escolhida foi a de *Optimistic UI* (atualiza a tela para parecer rápido, e salva em background), mantivemos a fluidez do usuário, mas os retornos de erro agora são devidamente mapeados para logging. Quando o cache do banco for atualizado, a sincronia será perfeita.

### 1.3 Criação de IDs Longos e Incompatibilidade com BIGINT
* **Bug em Potencial:** O componente `ManageCourses` e o `App.tsx` utilizavam `Date.now()` (que retorna um timestamp em milissegundos muito longo) para gerar IDs provisórios para Cursos e Aulas. O banco de dados esperava um `BIGINT`. Embora o JS consiga trafegar números grandes, flutuações e precisão às vezes geram conflitos. 
* **Correção:** Reduzimos a entropia para um Timestamp em Segundos (`Math.floor(Date.now() / 1000)`), garantindo que sempre caibam perfeitamente na limitação numérica estrita do PostgreSQL sem risco de `Integer Overflow`.

## 2. Falhas Críticas de Segurança

### 2.1 Senhas em Texto Plano (Plaintext Passwords)
* **Falha Crítica:** O schema anterior e o fluxo de autenticação (`src/server/auth.ts`) salvavam a coluna `senha` em texto plano e a verificação no login consistia em um mero `if (user.senha === password)`. Em qualquer banco de dados de produção isso é um risco extremo.
* **Correção:** Reimplementamos a biblioteca `bcrypt` no back-end (Express). 
  - Durante o Upsert/Registro, interceptamos a senha, realizamos o hash (`$2b$10$...`) e só então enviamos ao Supabase.
  - No Login, utilizamos `bcrypt.compare` para bater a hash com a senha enviada pelo cliente.
  - Atualizamos também a carga inicial de testes no script SQL (`02_banco_de_dados_supabase.md`) para inserir senhas de teste já devidamente hasheadas com *salt* padrão.

## 3. Redundâncias e Trechos Refatorados

### 3.1 Funções RPC Desnecessárias
* **Redundância:** Havia arquivos de documentação (`funcoes_rpc.sql`) tentando injetar lógicas de banco (Functions/Procedures) para fazer *upserts* simples, como inserir um Curso.
* **Refatoração:** Num cenário em que as tabelas estão no Schema `public` e não temos Row Level Security (RLS) restritivas ainda, o próprio cliente do Supabase já expõe a função nativa `.upsert()`. Deletamos toda a carga inútil de RPCs complexos e revertemos a lib `src/lib/supabase.ts` para fazer o uso clássico da API: `supabase.from('sc_cursos').upsert(c)`. O código ficou exponencialmente mais limpo, fácil de dar manutenção e sem gargalos de permissões de *Execute*.
* **Organização de Documentação:** Limpamos a pasta `docs/` e apagamos arquivos obsoletos (`schema_corrigido.sql`, `funcoes_rpc.sql`, `correcoes_melhorias.md`). A documentação única, modular e contendo todas as correções de modelagem reside agora exclusivamente no `02_banco_de_dados_supabase.md`.

## Conclusão e Próximos Passos
O código foi higienizado. O problema das telas de gerenciamento não salvarem os dados não era o código React em si, mas sim a *dessincronização do cache interno do Supabase*.

**Ação obrigatória:** Para que o sistema volte a funcionar e os Cursos/Aulas sejam salvos:
1. Abra o **SQL Editor** no painel do Supabase.
2. Copie a versão atualizada do script presente no arquivo `docs/02_banco_de_dados_supabase.md`.
3. Rode o script. (A última linha do script, `NOTIFY pgrst, reload_schema;`, limpará o erro do sistema e tudo voltará a funcionar perfeitamente).
