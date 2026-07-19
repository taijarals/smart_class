/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Subject, Class, Question, EnrollmentRequest, ShopItem } from "./types";

export const INITIAL_STUDENT: Student = {
  id: "st-1",
  matricula: "20240551-0",
  nome: "Ana Luíza Costa",
  email: "ana.costa@universidade.edu.br",
  coins_saldo: 540,
  xp: 2400,
  level: 8,
  completed_quizzes_count: 12,
  role: "aluno",
  approved: true,
  is_admin: true
};

export const INITIAL_SUBJECTS: Subject[] = [];

export const INITIAL_CLASSES: Class[] = [];

export const INITIAL_ENROLLMENT_REQUESTS: EnrollmentRequest[] = [
  {
    id: "req-1",
    aluno_nome: "Ricardo Mendonça",
    aluno_matricula: "20240982-1",
    turmas_solicitadas: ["Cálculo Diferencial III", "Física II"],
    status: "PENDENTE"
  },
  {
    id: "req-2",
    aluno_nome: "Ana Luíza Costa",
    aluno_matricula: "20240551-0",
    turmas_solicitadas: ["Design Thinking"],
    status: "PENDENTE"
  },
  {
    id: "req-3",
    aluno_nome: "Bruno Oliveira",
    aluno_matricula: "20231104-9",
    turmas_solicitadas: ["Probabilidade Avançada"],
    status: "PENDENTE"
  }
];

export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  {
    id: "item-1",
    titulo: "+0.5 na P1",
    descricao: "Aumento direto na nota da primeira prova semestral. Válido para qualquer matéria.",
    custo: 20,
    iconName: "Grade",
    category: "grade",
    locked: false
  },
  {
    id: "item-2",
    titulo: "Abono de 1 Falta",
    descricao: "Justificativa automática para uma ausência registrada no portal acadêmico do aluno.",
    custo: 50,
    iconName: "FileX",
    category: "event",
    locked: false
  },
  {
    id: "item-3",
    titulo: "Consultoria Individual",
    descricao: "Sessão de 30 minutos com o tutor do laboratório para revisão de conteúdo ou mentoria de carreira.",
    custo: 100,
    iconName: "Users",
    category: "mentor",
    locked: false
  },
  {
    id: "item-4",
    titulo: "Certificado Premium",
    descricao: "Emissão de certificado de horas complementares com selo acadêmico de distinção e assinatura digital.",
    custo: 1500,
    iconName: "Award",
    category: "other",
    locked: true
  }
];

export const INITIAL_QUESTIONS: Question[] = [];
