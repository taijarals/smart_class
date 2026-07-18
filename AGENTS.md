# Agente de Desenvolvimento SmartClass

## Regras de Projeto
- **Schema**: Todas as tabelas do banco de dados (Supabase) devem residir no schema `smartclass`.
- **Configuração do Supabase**: O cliente do Supabase deve ser inicializado com o parâmetro `db: { schema: 'smartclass' }`.

## Configuração de Permissões de Banco de Dados
Para garantir acesso às tabelas no schema `smartclass`, execute os seguintes comandos no SQL Editor do Supabase:

```sql
GRANT USAGE ON SCHEMA smartclass TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA smartclass
TO anon, authenticated;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA smartclass
TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA smartclass
GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLES TO anon, authenticated;
```
