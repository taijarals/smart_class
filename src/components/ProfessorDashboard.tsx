/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Calendar,
  Users,
  LineChart,
  Activity,
  PlusCircle,
  Eye,
  EyeOff,
  Rocket,
  Edit,
  ClipboardList,
  Layers
} from "lucide-react";
import { Class, Subject, Student } from "../types";
import SupabaseConnectionTest from "./SupabaseConnectionTest";

interface ProfessorDashboardProps {
  classes: Class[];
  subjects: Subject[];
  onToggleCheckin: (classId: number) => void;
  onToggleSubject: (subjectId: number) => void;
  onChangeScreen: (screen: string) => void;
  studentRequestsCount: number;
  student: Student;
}

export default function ProfessorDashboard({
  classes,
  subjects,
  onToggleCheckin,
  onToggleSubject,
  onChangeScreen,
  studentRequestsCount,
  student
}: ProfessorDashboardProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 animate-fade-in">
      {/* Welcome & Primary Action */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h2 className="font-sans font-bold text-lg text-[#24292F] tracking-tight">
            Dashboard do Professor
          </h2>
          <p className="font-sans text-xs text-[#57606A]">Olá, Prof. {student.nome}. Confira as atividades pedagógicas de hoje.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Gestão de Acessos link with pending indicator badge (Admins only) */}
          {student.is_admin && (
            <button
              onClick={() => onChangeScreen("access_management")}
              className="relative bg-[#F6F8FA] border border-[#D0D7DE] text-[#24292F] hover:bg-[#F3F4F6] font-sans font-bold text-xs px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all"
            >
              <ClipboardList className="w-4 h-4 text-[#0969DA]" />
              Gestão de Acessos
              {studentRequestsCount > 0 && (
                <span className="ml-1 bg-[#CF222E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {studentRequestsCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => onChangeScreen("manage_courses")}
            className="bg-[#24292F] hover:bg-[#32383f] text-white font-sans font-bold text-xs px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Layers className="w-4 h-4" />
            Gerenciar Cursos
          </button>
          <button
            onClick={() => onChangeScreen("manage_questions")}
            className="bg-[#0969DA] hover:bg-[#085dc3] text-white font-sans font-bold text-xs px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Edit className="w-4 h-4" />
            Gerenciar Banco de Questões
          </button>
        </div>
      </section>

      {/* Bento Grid Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Presence */}
        <div className="bg-white border border-[#D0D7DE] p-3 rounded-md flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#E7F3FF] flex items-center justify-center text-[#0969DA] border border-[#D0D7DE]/30 shrink-0">
            <Users className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-mono text-[8px] text-[#57606A] font-bold tracking-wider uppercase">Alunos Presentes</span>
            <h3 className="font-sans font-bold text-base text-[#0969DA] leading-none mt-0.5">84%</h3>
          </div>
        </div>

        {/* Stat 2: Grade Average */}
        <div className="bg-white border border-[#D0D7DE] p-3 rounded-md flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#EAF5EC] flex items-center justify-center text-[#2DA44E] border border-[#D0D7DE]/30 shrink-0">
            <LineChart className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-mono text-[8px] text-[#57606A] font-bold tracking-wider uppercase">Média de Acertos</span>
            <h3 className="font-sans font-bold text-base text-[#2DA44E] leading-none mt-0.5">7.2 <span className="text-[10px] font-sans text-[#57606A]">/ 10</span></h3>
          </div>
        </div>

        {/* Stat 3: Active Quizzes */}
        <div className="bg-white border border-[#D0D7DE] p-3 rounded-md flex items-center gap-3 relative overflow-hidden">
          <div className="w-9 h-9 rounded bg-[#FFF5F5] flex items-center justify-center text-red-500 border border-[#D0D7DE]/30 shrink-0">
            <Activity className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-mono text-[8px] text-[#57606A] font-bold tracking-wider uppercase">Quizzes Ativos</span>
            <h3 className="font-sans font-bold text-base text-[#24292F] leading-none mt-0.5">03</h3>
          </div>
        </div>
      </section>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Classes list */}
        <div className="lg:col-span-8 space-y-3">
          <h3 className="font-sans font-bold text-[#24292F] text-sm flex items-center gap-1.5">
            <Calendar className="w-4.5 h-4.5 text-[#0969DA]" />
            Aulas do Dia (Controle de Chamada)
          </h3>

          <div className="space-y-2">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className={`bg-white border rounded-md p-3.5 transition-all ${
                  cls.checkin_ativo ? "border-[#0969DA] bg-[#E7F3FF]/10" : "border-[#D0D7DE]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Date Block */}
                    <div className="w-10 h-10 rounded bg-[#F6F8FA] border border-[#D0D7DE] flex flex-col items-center justify-center text-[#0969DA] font-bold shrink-0">
                      <span className="text-[8px] font-mono tracking-tighter uppercase text-[#57606A] leading-none mb-0.5">
                        {cls.dia_da_semana.substring(0, 3)}
                      </span>
                      <span className="text-sm font-sans leading-none">
                        {cls.horario.split(":")[0]}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-xs text-[#24292F] leading-snug">
                        {cls.dia_da_semana}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#57606A] mt-1 font-sans">
                        <span className="flex items-center gap-1">
                          <ClipboardList className="w-3.5 h-3.5 text-[#57606A]" />
                          {cls.horario}
                        </span>
                        <span>•</span>
                        <span>{cls.periodo} {cls.ano}</span>
                      </div>
                    </div>
                  </div>

                  {/* Switch toggle checkin */}
                  <div className="flex items-center justify-between sm:justify-end bg-[#F6F8FA] sm:bg-transparent p-2 sm:p-0 rounded-md gap-3 border border-[#D0D7DE] sm:border-transparent shrink-0">
                    <span className="font-mono text-[9px] text-[#57606A] font-bold tracking-wider">ATIVAR CHAMADA</span>
                    <label className="relative inline-block w-9 h-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cls.checkin_ativo}
                        onChange={() => onToggleCheckin(cls.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0969DA]" />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects list */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-sans font-bold text-[#24292F] text-sm flex items-center gap-1.5">
            <ClipboardList className="w-4.5 h-4.5 text-[#0969DA]" />
            Assuntos para Quiz
          </h3>

          <div className="bg-white border border-[#D0D7DE] rounded-md overflow-hidden">
            {/* Active List */}
            <div className="p-1 space-y-0.5">
              <span className="block font-mono text-[8px] text-[#57606A] font-bold tracking-wider uppercase px-2 py-1 mt-1">
                ATIVOS NO SORTEIO
              </span>
              {subjects
                .filter((s) => s.status)
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-[#F6F8FA] group cursor-pointer"
                    onClick={() => onToggleSubject(s.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#2DA44E]" />
                      <span className="font-sans text-xs text-[#24292F] font-medium">{s.nome}</span>
                    </div>
                    <EyeOff className="w-3.5 h-3.5 text-[#57606A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
            </div>

            <div className="h-[1px] bg-[#D0D7DE] mx-2" />

            {/* Inactive List */}
            <div className="p-1 space-y-0.5 bg-[#F6F8FA]/30">
              <span className="block font-mono text-[8px] text-[#57606A] font-bold tracking-wider uppercase px-2 py-1">
                INATIVOS / FINALIZADOS
              </span>
              {subjects
                .filter((s) => !s.status)
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-[#F6F8FA] group cursor-pointer opacity-60"
                    onClick={() => onToggleSubject(s.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#57606A]" />
                      <span className="font-sans text-xs text-[#57606A] line-through">{s.nome}</span>
                    </div>
                    <Eye className="w-3.5 h-3.5 text-[#57606A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
            </div>
          </div>

          {/* Supabase Connection Diagnostics (Admins only) */}
          {student.is_admin && <SupabaseConnectionTest />}

          {/* Bottom Motivation Box (High Density styled Alert info box) */}
          <div className="bg-[#E7F3FF] border border-[#D0D7DE] text-[#0969DA] p-4 rounded-md relative overflow-hidden">
            <div className="relative z-10 space-y-1">
              <h4 className="font-sans font-bold text-xs flex items-center gap-1.5">
                Sua Turma está Voando!
                <Rocket className="w-3.5 h-3.5 text-[#0969DA] fill-[#0969DA]/20" />
              </h4>
              <p className="font-sans text-[11px] text-[#0969DA] leading-normal">
                O engajamento subiu <strong>15% esta semana</strong> com as novas questões ativadas de Cálculo Diferencial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
