/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { User, Coins, Award, ShieldAlert, CheckCircle2, History, CreditCard, ChevronRight } from "lucide-react";
import { Student, RedemptionLog, QuizAttempt } from "../types";
import SupabaseConnectionTest from "./SupabaseConnectionTest";

interface StudentProfileProps {
  student: Student;
  redemptionLogs: RedemptionLog[];
  completedQuizzes: QuizAttempt[];
  classes: any[];
}

export default function StudentProfile({ student, redemptionLogs, completedQuizzes, classes }: StudentProfileProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-4 py-2 animate-fade-in">
      {/* Profile Card Header */}
      <section className="bg-white border border-[#D0D7DE] rounded-md p-4 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <User className="w-24 h-24 text-[#0969DA]" />
        </div>

        <div className="w-16 h-16 rounded border border-[#D0D7DE] overflow-hidden shrink-0">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz3KyOYsNot-SMvcZGX77eVZUoM8KcaHp0sAuylqKfQPsqceVzM-4aAtiLH_0LtHf0N5kUUzjBWEEb6-AYzIWyoNqvEo2JKZl1NvrednDkhE0Oen68nzSpua6C5H8gkpO5j3F61gw8f7pdnsXJQY5b-TzvPMOxRgOs-u0Ag8_4F6FjwKQ57NQ83dRmrtXbBvRzgudr2Quv5HzqBmbV5f-RbJTAuhK-e4Fu3ngaCy0OIyLmAP-pWEbBvvUb9iWyZBLkXet8QPfe4g"
            alt="Ana Luíza Costa"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-sans font-bold text-base text-[#24292F] leading-none">
            {student.nome}
          </h3>
          <p className="font-mono text-[10px] font-bold text-[#57606A]">RA: {student.matricula}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-1">
            <span className="text-[9px] font-sans font-bold bg-[#E7F3FF] text-[#0969DA] border border-[#D0D7DE]/40 px-1.5 py-0.5 rounded uppercase tracking-wide">
              Estudante Ativo
            </span>
            <span className="text-[9px] font-sans font-bold bg-[#EAF5EC] text-[#2DA44E] border border-[#D0D7DE]/40 px-1.5 py-0.5 rounded uppercase tracking-wide">
              Nível {student.level}
            </span>
          </div>
        </div>
      </section>

      {/* Stats Cards Bento */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-[#D0D7DE] p-3 rounded-md text-center space-y-0.5">
          <Coins className="w-4 h-4 text-amber-500 mx-auto" />
          <span className="block font-mono text-[8px] text-[#57606A] font-bold uppercase tracking-wider">Saldo</span>
          <span className="block font-sans font-bold text-xs text-[#24292F]">{student.coins_saldo.toFixed(0)} CC</span>
        </div>

        <div className="bg-white border border-[#D0D7DE] p-3 rounded-md text-center space-y-0.5">
          <Award className="w-4 h-4 text-[#0969DA] mx-auto" />
          <span className="block font-mono text-[8px] text-[#57606A] font-bold uppercase tracking-wider">Acertos</span>
          <span className="block font-sans font-bold text-xs text-[#24292F]">
            {completedQuizzes.reduce((acc, curr) => acc + curr.acertos, 0)} Qs
          </span>
        </div>

        <div className="bg-white border border-[#D0D7DE] p-3 rounded-md text-center space-y-0.5">
          <CheckCircle2 className="w-4 h-4 text-[#2DA44E] mx-auto" />
          <span className="block font-mono text-[8px] text-[#57606A] font-bold uppercase tracking-wider">Presenças</span>
          <span className="block font-sans font-bold text-xs text-[#24292F]">{student.completed_quizzes_count} Aulas</span>
        </div>
      </section>

      {/* Supabase Connection Diagnostics (Admins only) */}
      {student.is_admin && <SupabaseConnectionTest />}

      {/* Main split details logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
        {/* Presences and Quizzes Logs */}
        <div className="bg-white border border-[#D0D7DE] rounded-md p-4 space-y-3">
          <h4 className="font-sans font-bold text-[#24292F] text-xs flex items-center gap-1.5 pb-1.5 border-b border-[#D0D7DE] uppercase tracking-wider">
            <History className="w-4 h-4 text-[#0969DA]" />
            Histórico de Check-ins
          </h4>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {completedQuizzes.length === 0 ? (
              <p className="text-[11px] text-[#57606A] text-center py-4">Nenhum check-in realizado ainda.</p>
            ) : (
              completedQuizzes.map((q) => {
                const matchedClass = classes.find((c) => c.id === q.aula_id);
                return (
                  <div key={q.id} className="p-2 bg-[#F6F8FA] border border-[#D0D7DE] rounded-md flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[#24292F] line-clamp-1">{matchedClass ? `${matchedClass.dia_da_semana} - ${matchedClass.horario}` : "Aula do dia"}</p>
                      <p className="text-[9px] text-[#57606A] font-mono">{q.finalizado_em}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block font-bold text-[#2DA44E]">+{q.coins_ganhos.toFixed(2)} CC</span>
                      <span className="block text-[9px] text-[#57606A]">{q.acertos}/5 acertos</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Store Redemptions log */}
        <div className="bg-white border border-[#D0D7DE] rounded-md p-4 space-y-3">
          <h4 className="font-sans font-bold text-[#24292F] text-xs flex items-center gap-1.5 pb-1.5 border-b border-[#D0D7DE] uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-[#0969DA]" />
            Resgates Efetuados
          </h4>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {redemptionLogs.length === 0 ? (
              <p className="text-[11px] text-[#57606A] text-center py-4">Nenhum benefício resgatado na loja.</p>
            ) : (
              redemptionLogs.map((log) => (
                <div key={log.id} className="p-2 bg-[#F6F8FA] border border-[#D0D7DE] rounded-md flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-[#24292F]">{log.beneficio}</p>
                    <p className="text-[9px] text-[#57606A] font-mono">{log.data_resgate}</p>
                  </div>
                  <span className="font-bold text-red-500 text-right shrink-0">-{log.coins_gastos} CC</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
