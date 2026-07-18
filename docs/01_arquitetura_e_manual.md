# Smart Class - Manual do Sistema e Arquitetura Gamificada

Este documento fornece uma visão geral completa das regras de negócio, arquitetura e fluxo de telas do aplicativo **Smart Class**.

---

## 1. Visão Geral do Sistema

O **Smart Class** é um portal acadêmico gamificado e interativo projetado para aproximar estudantes e docentes através de incentivos práticos e engajamento dinâmico. O sistema incentiva a participação nas aulas presenciais, realização de micro-provas de check-in e resgates de benefícios reais por meio de uma moeda virtual própria chamada **ClassCoins**.

---

## 2. Papéis e Permissões

O sistema possui dois perfis principais de usuários que podem ser alternados dinamicamente no cabeçalho para fins de demonstração e uso contínuo:

### A. Aluno (`aluno`)
* **Início (Home):** Visualiza seu nível atual, progresso de XP, saldo de ClassCoins e a lista de aulas ativas. Se o professor ativar a chamada, o aluno pode realizar o check-in respondendo a uma mini-prova.
* **Quiz:** Área dedicada para responder ao questionário de check-in de 5 questões objetivas de múltipla escolha.
* **Loja (Smart Store):** Vitrine de recompensas acadêmicas e benefícios que podem ser adquiridos em troca de moedas virtuais.
* **Perfil:** Painel individual contendo estatísticas de acertos, histórico de resgates e logs de mini-provas respondidas.

### B. Professor (`professor`)
* **Painel Geral (Dashboard):** Ativa ou desativa chamadas (check-ins) para as aulas do dia, controla assuntos ativos e acessa módulos rápidos.
* **Gestão de Acessos:** Analisa solicitações pendentes de novos estudantes, aprova ou recusa as matrículas e confere turmas ativas.
* **Banco de Questões Inteligente:** Cria novas questões objetivas associadas a cada disciplina, define o gabarito correto, escolhe o nível de dificuldade (Fácil, Médio ou Difícil) e ativa ou desativa perguntas do quiz.

---

## 3. Regras de Negócio Fundamentais

### 💰 ClassCoins e XP
* O saldo de moedas é acumulado ao responder às mini-provas de check-in.
* Cada resposta correta rende **100 XP** adicionais para subir de nível e **ClassCoins** de acordo com a pontuação.
* O check-in presencial confere uma bonificação base fixa de participação.

### 📝 Controle de Check-in e Quizzes
* O quiz de cada aula só fica disponível para o estudante se o professor tiver **ativado o check-in** daquela aula específica em seu painel.
* Cada estudante pode enviar suas respostas para uma aula **apenas uma única vez**. Tentativas adicionais na mesma aula são bloqueadas pelo sistema.
* As questões do quiz são sorteadas dinamicamente com base nos **assuntos que estão ativos** no painel do docente. Se um assunto estiver inativo, suas perguntas não serão selecionadas.

### 🛒 Loja de Recompensas (Smart Store)
* O estudante pode resgatar recompensas caso possua ClassCoins suficientes. Exemplos:
  * **+0.5 na Prova 1:** Custa `20 ClassCoins`
  * **Abono de 1 Falta:** Custa `50 ClassCoins`
  * **Consultoria Individual:** Custa `100 ClassCoins`
  * **Certificado Premium:** Custa `1500 ClassCoins`
* Ao resgatar, o saldo de moedas é deduzido imediatamente e a operação é inserida no **Histórico de Resgates** do perfil do estudante.

---

## 4. Visual & Interface

O aplicativo adota um estilo visual refinado inspirado na alta densidade e clareza de interfaces de desenvolvimento (como GitHub e plataformas modernas de engenharia):
* **Foco em Tipografia:** Uso de fontes altamente legíveis com espaçamentos otimizados.
* **Paleta de Cores de Alta Fidelidade:** Tons de cinza suaves (`#24292F`, `#F6F8FA`), azuis de destaque dinâmico (`#0969DA`) e verdes funcionais de sucesso (`#2DA44E`).
* **Bordas e Dividers Limpos:** Substituição de sombras pesadas por contornos finos de alto contraste.
* **Responsividade Integrada:** Grade adaptável de 1 a 12 colunas no desktop, convertendo-se perfeitamente para barra de navegação flutuante no mobile.
