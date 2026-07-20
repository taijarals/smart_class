/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Clock, 
  Send, 
  LogOut, 
  CheckCircle, 
  Hourglass, 
  XCircle, 
  HelpCircle 
} from "lucide-react";
import { Course, Discipline, Class, Student, EnrollmentRequest } from "../types";

interface WaitingRoomProps {
  courses: Course[];
  disciplines: Discipline[];
  classes: Class[];
  student: Student;
  requests: EnrollmentRequest[];
  onSubmitRequest: (turmaDescricao: string) => void;
  onLogout: () => void;
}

export default function WaitingRoom({
  courses,
  disciplines,
  classes,
  student,
  requests,
  onSubmitRequest,
  onLogout
}: WaitingRoomProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<number | "">("");
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<number | "">("");
  const [selectedClassId, setSelectedClassId] = useState<number | "">("");

  // Get active request for this student
  const studentRequest = requests.find(
    (r) => r.aluno_matricula === student.matricula
  );

  // Filter disciplines based on selected course
  const filteredDisciplines = disciplines.filter(
    (d) => selectedCourseId === "" || d.curso_id === Number(selectedCourseId)
  );

  // Filter classes based on selected discipline
  const filteredClasses = classes.filter(
    (c) => selectedDisciplineId === "" || c.disciplina_id === Number(selectedDisciplineId)
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !selectedDisciplineId || !selectedClassId) {
      alert("Por favor, preencha todas as seleções de Curso, Disciplina e Turma.");
      return;
    }

    const course = courses.find((c) => c.id === Number(selectedCourseId));
    const discipline = disciplines.find((d) => d.id === Number(selectedDisciplineId));
    const cls = classes.find((c) => c.id === Number(selectedClassId));

    if (course && discipline && cls) {
      const turmaDescricao = `Turma #${cls.id} - ${discipline.nome} - Turma ${cls.periodo} (${cls.horario}) [${cls.dia_da_semana}]`;
      onSubmitRequest(turmaDescricao);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-[#D0D7DE] rounded-lg shadow-sm overflow-hidden animate-fade-in">
        
        {/* Banner header */}
        <div className="bg-[#24292F] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#32383F] flex items-center justify-center border border-gray-600">
              <GraduationCap className="w-6 h-6 text-[#2DA44E]" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-base leading-none">Portal do Aluno</h1>
              <p className="font-sans text-[11px] text-gray-400 mt-1">ClassCoins Academic System</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sair da conta"
            className="p-1.5 hover:bg-[#32383F] rounded-md transition-all text-gray-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6">
          <div className="border-b border-[#D0D7DE] pb-4">
            <h2 className="font-sans font-bold text-lg text-[#24292F]">Acesso em Espera</h2>
            <p className="font-sans text-xs text-[#57606A] mt-1">
              Olá, <strong className="text-gray-800">{student.nome}</strong> (RA: {student.matricula}). 
              Seu acesso completo ao portal está aguardando aprovação na turma do semestre.
            </p>
          </div>

          {/* Conditional Views based on existing Request Status */}
          {studentRequest && studentRequest.status === "PENDENTE" ? (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 space-y-4">
              <div className="flex gap-3">
                <Hourglass className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-sans font-bold text-sm text-amber-800">Inscrição Pendente</h3>
                  <p className="font-sans text-xs text-amber-700 mt-1">
                    Sua solicitação de matrícula foi enviada com sucesso ao docente responsável pela disciplina.
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded border border-amber-200/60 font-sans text-xs">
                <span className="block font-mono text-[9px] text-[#57606A] font-bold uppercase tracking-wider mb-1">
                  Detalhes da Solicitação:
                </span>
                <p className="font-semibold text-gray-800">
                  {studentRequest.turmas_solicitadas?.[0] || "Turma não especificada"}
                </p>
                <div className="flex items-center gap-1 mt-2 text-amber-600 font-semibold text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Aguardando parecer do professor...</span>
                </div>
              </div>

              <p className="text-[10px] text-gray-500 italic">
                Assim que o professor aprovar sua matrícula na turma, este painel será liberado automaticamente.
              </p>
            </div>
          ) : studentRequest && studentRequest.status === "RECUSADO" ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex gap-3">
                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-sans font-bold text-sm text-red-800">Inscrição Recusada</h3>
                  <p className="font-sans text-xs text-red-700 mt-1">
                    Sua solicitação de matrícula anterior na turma foi recusada. Verifique os dados abaixo e envie uma nova solicitação se necessário.
                  </p>
                </div>
              </div>

              {/* Retry Enrollment Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4 bg-[#F6F8FA] p-4 rounded-md border border-[#D0D7DE]">
                <h3 className="font-sans font-bold text-xs text-gray-800 uppercase tracking-wider mb-2">Enviar Nova Solicitação</h3>
                
                {/* Course Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">1. Curso</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => {
                      setSelectedCourseId(e.target.value ? Number(e.target.value) : "");
                      setSelectedDisciplineId("");
                      setSelectedClassId("");
                    }}
                    className="w-full p-2 text-xs bg-white border border-[#D0D7DE] rounded-md outline-none focus:border-[#0969DA]"
                  >
                    <option value="">Selecione seu curso...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Discipline Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">2. Disciplina</label>
                  <select
                    value={selectedDisciplineId}
                    onChange={(e) => {
                      setSelectedDisciplineId(e.target.value ? Number(e.target.value) : "");
                      setSelectedClassId("");
                    }}
                    disabled={!selectedCourseId}
                    className="w-full p-2 text-xs bg-white border border-[#D0D7DE] rounded-md outline-none focus:border-[#0969DA] disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">Selecione a disciplina...</option>
                    {filteredDisciplines.map((d) => (
                      <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Class Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">3. Turma / Horário</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : "")}
                    disabled={!selectedDisciplineId}
                    className="w-full p-2 text-xs bg-white border border-[#D0D7DE] rounded-md outline-none focus:border-[#0969DA] disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">Selecione a turma...</option>
                    {filteredClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        Turma {c.periodo} ({c.horario}) - {c.dia_da_semana}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!selectedCourseId || !selectedDisciplineId || !selectedClassId}
                  className="w-full bg-[#0969DA] text-white py-2 rounded-md font-sans text-xs font-bold hover:bg-[#085dc3] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Enviar Nova Solicitação de Matrícula
                </button>
              </form>
            </div>
          ) : (
            // Form standard when no request has been submitted yet
            <div className="space-y-4">
              <div className="p-3 bg-[#E7F3FF] border border-[#0969DA]/20 text-[#0969DA] rounded-md text-xs font-sans flex gap-2">
                <HelpCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <p>
                  Para ter acesso total ao Portal, selecione abaixo o seu Curso, Disciplina e a respectiva Turma para a qual deseja solicitar inscrição neste semestre.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Course Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">1. Curso</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => {
                      setSelectedCourseId(e.target.value ? Number(e.target.value) : "");
                      setSelectedDisciplineId("");
                      setSelectedClassId("");
                    }}
                    className="w-full p-2.5 text-xs bg-white border border-[#D0D7DE] rounded-md outline-none focus:border-[#0969DA]"
                  >
                    <option value="">Selecione seu curso...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Discipline Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">2. Disciplina</label>
                  <select
                    value={selectedDisciplineId}
                    onChange={(e) => {
                      setSelectedDisciplineId(e.target.value ? Number(e.target.value) : "");
                      setSelectedClassId("");
                    }}
                    disabled={!selectedCourseId}
                    className="w-full p-2.5 text-xs bg-white border border-[#D0D7DE] rounded-md outline-none focus:border-[#0969DA] disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">Selecione a disciplina...</option>
                    {filteredDisciplines.map((d) => (
                      <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Class Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">3. Turma / Horário</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : "")}
                    disabled={!selectedDisciplineId}
                    className="w-full p-2.5 text-xs bg-white border border-[#D0D7DE] rounded-md outline-none focus:border-[#0969DA] disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">Selecione a turma...</option>
                    {filteredClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        Turma {c.periodo} ({c.horario}) - {c.dia_da_semana}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!selectedCourseId || !selectedDisciplineId || !selectedClassId}
                  className="w-full bg-[#2DA44E] hover:bg-[#2c974b] text-white py-2.5 rounded-md font-sans text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Solicitar Matrícula na Turma
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
