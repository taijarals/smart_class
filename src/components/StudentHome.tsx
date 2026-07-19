/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Clock,
  Code,
  Database,
  Flame,
  Award,
  Brain,
  Lock,
  ChevronRight,
  BookOpen,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Student, Class } from "../types";

interface StudentHomeProps {
  student: Student;
  classes: Class[];
  onStartQuiz: (classId: number) => void;
  onGoToProfile?: () => void;
}

export default function StudentHome({ student, classes, onStartQuiz, onGoToProfile }: StudentHomeProps) {
  // Find if there is an active class for checkin, otherwise default to first class
  const activeClass = classes.find((c) => c.checkin_ativo) || classes[0];
  const isCheckinActive = activeClass?.checkin_ativo;

  return (
    <div className="space-y-4 max-w-2xl mx-auto py-2">
      {/* Welcome Greeting */}
      <section className="animate-fade-in px-1">
        <h2 className="font-sans font-bold text-xl text-[#24292F]">Olá, {student.nome}!</h2>
        <p className="font-sans text-xs text-[#57606A]">Continue sua jornada acadêmica de hoje e garanta suas presenças.</p>
      </section>

      {/* Next Class Highlight Card (Bento Focus - High Density Style) */}
      <section className="relative overflow-hidden bg-white border border-[#D0D7DE] rounded-md p-4">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <BookOpen className="w-32 h-32 text-[#0969DA]" />
        </div>
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-[#0969DA] font-mono text-[10px] font-bold tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            PRÓXIMA AULA COM CHECK-IN
          </div>

          <div>
            <h3 className="font-sans font-bold text-lg text-[#24292F] leading-tight">
              {activeClass?.dia_da_semana ? `Turma de ${activeClass.dia_da_semana}` : "Sem Aulas Hoje"}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#57606A]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#57606A]" />
                {activeClass?.horario || "Sem horário"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#57606A]" />
                {activeClass?.periodo} {activeClass?.ano}
              </span>
            </div>
          </div>

          {isCheckinActive ? (
            <button
              onClick={() => onStartQuiz(activeClass.id)}
              className="w-full bg-[#2DA44E] text-white hover:bg-[#2c974b] py-2 rounded-md font-sans font-bold text-xs tracking-wide transition-all shadow-sm"
            >
              Iniciar Check-in Gamificado (5m)
            </button>
          ) : (
            <div className="bg-[#FBF0DB] border border-[#D4A72C] rounded-md p-3 flex gap-2.5 items-start">
              <AlertCircle className="w-4 h-4 text-[#9A6700] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-sans font-bold text-xs text-[#9A6700]">Check-in Pendente</h4>
                <p className="font-sans text-[11px] text-[#9A6700] leading-normal">
                  O professor ainda não abriu o período de chamada para esta aula. Mude para a visão de{" "}
                  <strong>Professor</strong> no topo e ative o interruptor para simular a abertura!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Weekly Progress Section */}
      <section className="space-y-3">
        <h3 className="font-sans font-bold text-[#24292F] flex items-center gap-1.5 text-xs uppercase tracking-wider">
          <Award className="w-4 h-4 text-[#0969DA]" />
          Progresso Semanal
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Quizzes Stat Card */}
          <div className="bg-white border border-[#D0D7DE] rounded-md p-3 flex flex-col gap-1.5">
            <span className="font-mono text-[9px] text-[#57606A] font-bold tracking-wider">QUIZZES CONCLUÍDOS</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-sans font-bold text-[#24292F]">
                {student.completed_quizzes_count}
              </span>
              <span className="text-[10px] font-semibold text-[#2DA44E] bg-[#EAF5EC] px-1 rounded">+3</span>
            </div>
            <div className="w-full bg-[#E1E4E8] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#0969DA] h-full w-[70%]" style={{ width: `${Math.min(100, student.completed_quizzes_count * 20)}%` }}></div>
            </div>
          </div>

          {/* XP / Level Card */}
          <div className="bg-white border border-[#D0D7DE] rounded-md p-3 flex flex-col gap-1.5">
            <span className="font-mono text-[9px] text-[#57606A] font-bold tracking-wider">NÍVEL {student.level}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-sans font-bold text-[#24292F]">
                {(student.xp / 1000).toFixed(1)}k
              </span>
              <span className="text-[10px] text-[#57606A]">XP</span>
            </div>
            <div className="w-full bg-[#E1E4E8] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#2DA44E] h-full w-[45%]" style={{ width: `${Math.min(100, (student.xp % 1000) / 10)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="bg-white border border-[#D0D7DE] rounded-md p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[9px] text-[#57606A] font-bold tracking-wider uppercase">CONQUISTAS RECENTES</span>
            <button
              onClick={onGoToProfile}
              className="text-[#0969DA] hover:text-[#033D82] font-mono text-[10px] font-bold cursor-pointer hover:underline bg-none border-none p-0"
            >
              Ver Todas
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {/* Badge 1 */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-[#F6F8FA] flex items-center justify-center border border-[#D0D7DE]">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              </div>
              <span className="text-[9px] font-sans font-medium text-[#57606A] text-center">7 Dias de Fogo</span>
            </div>
            {/* Badge 2 */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-[#E7F3FF] flex items-center justify-center border border-[#D0D7DE]">
                <Award className="w-5 h-5 text-[#0969DA]" />
              </div>
              <span className="text-[9px] font-sans font-medium text-[#57606A] text-center">Top #1 do Mês</span>
            </div>
            {/* Badge 3 */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-[#EAF5EC] flex items-center justify-center border border-[#D0D7DE]">
                <Brain className="w-5 h-5 text-[#2DA44E]" />
              </div>
              <span className="text-[9px] font-sans font-medium text-[#57606A] text-center">Mestre de Cálculo</span>
            </div>
            {/* Badge 4 - Locked */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1 opacity-50">
              <div className="w-10 h-10 rounded-full bg-[#F6F8FA] flex items-center justify-center border border-dashed border-[#D0D7DE]">
                <Lock className="w-4 h-4 text-[#57606A]" />
              </div>
              <span className="text-[9px] font-sans font-medium text-[#57606A] text-center">Bloqueado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <section className="space-y-2">
        <h3 className="font-sans font-bold text-[#24292F] text-xs uppercase tracking-wider">Meus Cursos</h3>
        <div className="space-y-2">
          {/* Course 1 */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-md border border-[#D0D7DE] hover:bg-[#F6F8FA] transition-all cursor-pointer group">
            <div className="w-9 h-9 bg-[#E7F3FF] text-[#0969DA] rounded flex items-center justify-center border border-[#D0D7DE]/50">
              <Code className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-sans font-bold text-xs text-[#24292F]">Estrutura de Dados Avançada</h4>
              <p className="text-[11px] text-[#57606A]">Próxima aula: Terça-feira • 19:00</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0969DA] transition-colors" />
          </div>

          {/* Course 2 */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-md border border-[#D0D7DE] hover:bg-[#F6F8FA] transition-all cursor-pointer group">
            <div className="w-9 h-9 bg-[#EAF5EC] text-[#2DA44E] rounded flex items-center justify-center border border-[#D0D7DE]/50">
              <Database className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-sans font-bold text-xs text-[#24292F]">Modelagem de Banco de Dados II</h4>
              <p className="text-[11px] text-[#57606A]">Próxima aula: Amanhã • 08:30</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#2DA44E] transition-colors" />
          </div>
        </div>
      </section>
    </div>
  );
}
