# Regras de Negócio - Smart Class (Portal Acadêmico Gamificado)

Este documento centraliza todas as regras de negócio acordadas para o sistema de gamificação e gestão de acessos do **Smart Class**, identificadas individualmente sob a taxonomia `RN1`, `RN2`, etc., com suas respectivas dependências e ramificações.

---

## RN1 - Presença Acadêmica Gamificada (Check-In de Aula)
O portal automatiza e incentiva a presença dos discentes através de mini-provas de conhecimentos rápidos baseadas nos conteúdos da aula do dia.

*   **RN1.1 - Validação por Questões:** A presença e o check-in em uma aula são validados unicamente após o aluno responder a um conjunto de 5 perguntas de múltipla escolha correspondentes aos assuntos ativos da disciplina.
*   **RN1.2 - Bloqueio de Respostas Duplicadas:** O aluno é impedido de realizar mais de um check-in/quiz para a mesma aula. O histórico de tentativas concluídas é persistido de forma permanente.
*   **RN1.3 - Controle de Janela Ativa:** Um check-in discente só é processado se a aula correspondente estiver marcada com o status de "Presença Ativa" pelo professor.
*   **RN1.4 - Recompensa Base de Presença:** O envio completo das respostas concede automaticamente um bônus base de presença de 100 XP, independente do percentual de acertos.

---

## RN2 - Economia de ClassCoins (Distribuição e Saldos)
O ClassCoin (CC) é a moeda digital corrente do sistema Smart Class, usada como unidade de engajamento e troca acadêmica.

*   **RN2.1 - Bônus de Primeiro Acesso:** Ao efetuar o seu primeiro registro no sistema, o usuário com o papel de Aluno recebe um incentivo de boas-vindas contendo **150 ClassCoins**.
*   **RN2.2 - Proporção de Ganhos por Desempenho:** Cada resposta correta fornecida no quiz de check-in concede ao discente **10 ClassCoins** adicionais e **100 pontos de XP**.
*   **RN2.3 - Restrição de Saldo Negativo:** Nenhuma operação que debite moedas do saldo do aluno poderá ser realizada se o saldo restante for menor que o valor cobrado.

---

## RN3 - Smart Store (Loja de Benefícios Acadêmicos)
A loja virtual permite que os alunos troquem suas moedas ganhas por vantagens e recompensas acadêmicas previamente estipuladas.

*   **RN3.1 - Débito em Tempo Real:** No ato do clique em "Resgatar", o valor do item é imediatamente deduzido do saldo total de ClassCoins do discente no banco de dados.
*   **RN3.2 - Registro de Transações (Logs):** Todo resgate efetuado com sucesso deve gerar uma entrada indelével na tabela de Logs de Resgate, contendo o ID do usuário, o título da recompensa, a data e o valor debitado, visível no perfil do aluno.

---

## RN4 - Gestão de Conteúdos e Aulas pelo Professor
Os docentes possuem autonomia sobre o andamento pedagógico, controle de liberação das presenças e banco de questões do sistema.

*   **RN4.1 - Filtro de Questões Ativas:** O gerador de provas de check-in seleciona de forma dinâmica apenas as perguntas vinculadas a assuntos (tópicos de estudo) marcados como "Ativos" no painel.
*   **RN4.2 - Liberação Autônoma de Aulas:** O professor pode ativar ou desativar a recepção de check-ins para as aulas individualmente, controlando o ritmo do fluxo em sala.

---

## RN5 - Segurança, Gestão de Acessos e Níveis de Permissão
Regras estritas de segurança que controlam quem pode acessar o sistema e como as permissões de administração são atribuídas.

*   **RN5.1 - Bloqueio por Aprovação Pendente:** Qualquer novo cadastro realizado na tela de login (seja aluno ou professor) inicia com o status `approved: false`. O login do usuário é bloqueado com mensagem de aviso descritiva até que a solicitação seja aprovada.
*   **RN5.2 - Concessão de Nível de Administrador:** No momento da liberação e aprovação do acesso, o usuário administrador pode conceder ao novo cadastro o status de Administrador (`is_admin: true`).
*   **RN5.3 - Restrição de Visualização de Gestão de Acessos:** Apenas usuários que possuam privilégios de Administrador (`is_admin: true`) podem visualizar, acessar ou interagir com o ambiente de "Gestão de Acessos" (tanto na interface do professor quanto no cabeçalho geral).
*   **RN5.4 - Universalidade de Admin:** O status de Administrador é independente do papel do usuário. Tanto um Aluno (`role: "aluno"`) quanto um Professor (`role: "professor"`) podem ser promovidos a Administrador e exercer o controle de aprovação e governança.
*   **RN5.5 - Rejeição de Cadastros:** O usuário administrador possui a prerrogativa de rejeitar um cadastro pendente, o que acarreta a exclusão completa e irrevogável do registro do banco de dados (Supabase ou LocalStorage).
*   **RN5.6 - Cadastro e Login Unificado:** Alunos e professores realizam login utilizando o mesmo formulário de Usuário (`usuario`) e Senha (`senha`). O cadastro de ambos os papéis exige o preenchimento obrigatório de Nome Completo, Usuário, Senha, E-mail e Matrícula.
