/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string;
  matricula: string;
  nome: string;
  email: string;
  usuario?: string;
  senha?: string;
  coins_saldo: number;
  xp: number;
  level: number;
  completed_quizzes_count: number;
  role: "aluno" | "professor";
  approved: boolean;
  is_admin: boolean;
}

export interface Course {
  id: number;
  nome: string;
}

export interface Discipline {
  id: number;
  curso_id: number;
  nome: string;
}

export interface Subject {
  id: number;
  disciplina_id: number; // Linked to discipline
  nome: string;
  status: boolean; // TRUE = Ativo para sorteio
}

export interface Question {
  id: string;
  assunto_id: number;
  enunciado: string;
  opcoes: Record<string, string>; // Ex: {"A": "Opção A", "B": "Opção B", ...}
  resposta_correta: string; // "A" | "B" | "C" | "D" | "E"
  nivel: "Facil" | "Medio" | "Dificil";
  status: boolean; // Se está ativa
}

export interface Class { // This represents Turma
  id: number;
  curso_id: number;
  disciplina_id: number;
  ano: number;
  periodo: string; // "1º semestre", "2º semestre", "1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"
  dia_da_semana: string;
  horario: string; // Ex: "08:30 - 10:10"
  checkin_ativo: boolean; // Ativado pelo professor no início da aula
}

export interface EnrollmentRequest {
  id: string;
  aluno_nome: string;
  aluno_matricula: string;
  turmas_solicitadas: string[];
  status: "PENDENTE" | "APROVADO" | "RECUSADO";
}

export interface ShopItem {
  id: string;
  titulo: string;
  descricao: string;
  custo: number;
  iconName: string; // Lucide icon identifier
  category: "grade" | "event" | "mentor" | "other";
  locked: boolean;
}

export interface QuizAttempt {
  id: string;
  aluno_id: string;
  aula_id: number;
  iniciado_em: string;
  finalizado_em?: string;
  questoes_sorteadas: string[]; // array de IDs de questões
  respostas_aluno: Record<string, string>; // questao_id -> resposta ('A'-'E')
  acertos: number;
  coins_ganhos: number;
  status: "em_progresso" | "concluido" | "expirado";
}

export interface RedemptionLog {
  id: string;
  aluno_id: string;
  coins_gastos: number;
  beneficio: string;
  data_resgate: string;
}
