/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, CheckCircle, XCircle, Users, BookOpen, ShieldAlert, User, ShieldCheck } from "lucide-react";
import { EnrollmentRequest, Student } from "../types";

interface AccessManagementProps {
  requests: EnrollmentRequest[];
  onProcessRequest: (id: string, action: "APROVADO" | "RECUSADO") => void;
  onGoBack: () => void;
  usersList: Student[];
  onApproveUser: (userId: string, makeAdmin: boolean) => void;
  onRejectUser: (userId: string) => void;
}

export default function AccessManagement({
  requests,
  onProcessRequest,
  onGoBack,
  usersList,
  onApproveUser,
  onRejectUser
}: AccessManagementProps) {
  const [activeTab, setActiveTab] = useState<"users" | "pending_enroll" | "classes">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminGrants, setAdminGrants] = useState<Record<string, boolean>>({});

  // Filter pending user approvals
  const pendingUsers = usersList.filter(
    (u) =>
      u.approved === false &&
      (u.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.matricula.includes(searchQuery) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter pending enrollments
  const pendingRequests = requests.filter(
    (r) =>
      r.status === "PENDENTE" &&
      (r.aluno_nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.aluno_matricula.includes(searchQuery))
  );

  const toggleAdminGrant = (userId: string) => {
    setAdminGrants((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-4 animate-fade-in">
      {/* Page Title with Go Back */}
      <div className="flex items-center justify-between border-b border-[#D0D7DE] pb-3">
        <div>
          <h2 className="font-sans font-bold text-lg text-[#24292F] tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#0969DA]" />
            Gestão de Acessos &amp; Permissões
          </h2>
          <p className="font-sans text-xs text-[#57606A]">
            Aprovação de novos usuários, concessão de nível de Administrador e matrículas em turmas.
          </p>
        </div>
        <button
          onClick={onGoBack}
          className="text-xs font-bold text-[#0969DA] hover:underline font-sans cursor-pointer"
        >
          &larr; Voltar ao Painel
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#D0D7DE] mb-4 bg-white rounded-md border p-1">
        <button
          onClick={() => {
            setActiveTab("users");
            setSearchQuery("");
          }}
          className={`flex-1 py-2 text-center relative font-sans font-bold text-xs transition-all duration-150 rounded-md ${
            activeTab === "users" ? "bg-[#0969DA] text-white shadow-sm" : "text-[#57606A] hover:text-[#24292F]"
          }`}
        >
          Usuários Pendentes ({pendingUsers.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("pending_enroll");
            setSearchQuery("");
          }}
          className={`flex-1 py-2 text-center relative font-sans font-bold text-xs transition-all duration-150 rounded-md ${
            activeTab === "pending_enroll" ? "bg-[#0969DA] text-white shadow-sm" : "text-[#57606A] hover:text-[#24292F]"
          }`}
        >
          Matrícula em Turmas ({pendingRequests.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("classes");
            setSearchQuery("");
          }}
          className={`flex-1 py-2 text-center relative font-sans font-bold text-xs transition-all duration-150 rounded-md ${
            activeTab === "classes" ? "bg-[#0969DA] text-white shadow-sm" : "text-[#57606A] hover:text-[#24292F]"
          }`}
        >
          Turmas Ativas
        </button>
      </div>

      {/* Search Bar */}
      <section className="space-y-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#57606A] w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#D0D7DE] rounded-md focus:border-[#0969DA] outline-none font-sans text-xs"
            placeholder={
              activeTab === "users"
                ? "Buscar cadastro por nome, e-mail ou matrícula..."
                : activeTab === "pending_enroll"
                ? "Buscar solicitação por nome ou matrícula..."
                : "Buscar turma por nome..."
            }
          />
        </div>
      </section>

      {/* Tab 1 Content: Pending User Approvals */}
      {activeTab === "users" && (
        <section className="space-y-3">
          {pendingUsers.length === 0 ? (
            <div className="bg-white border border-[#D0D7DE] rounded-md p-8 text-center text-[#57606A] text-xs">
              <CheckCircle className="w-10 h-10 text-[#2DA44E] mx-auto mb-2" />
              <p className="font-sans font-semibold text-gray-800">Tudo em ordem!</p>
              <p className="text-[11px] text-gray-500 mt-1">Nenhum novo cadastro aguardando aprovação no momento.</p>
            </div>
          ) : (
            pendingUsers.map((user) => {
              const isGrantAdmin = !!adminGrants[user.id];
              return (
                <div
                  key={user.id}
                  className="bg-white border border-[#D0D7DE] rounded-md p-4 hover:border-[#0969DA]/40 transition-all shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E7F3FF] border border-[#0969DA]/20 flex items-center justify-center text-[#0969DA] shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-xs text-[#24292F] flex items-center gap-2">
                          {user.nome}
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold tracking-wide uppercase ${
                              user.role === "professor"
                                ? "bg-purple-100 border border-purple-200 text-purple-700"
                                : "bg-blue-100 border border-blue-200 text-blue-700"
                            }`}
                          >
                            {user.role === "professor" ? "DOCENTE / PROFESSOR" : "ESTUDANTE / ALUNO"}
                          </span>
                        </h4>
                        <p className="font-sans text-[11px] text-[#57606A] mt-0.5">
                          E-mail: <span className="font-medium text-gray-800">{user.email}</span>
                        </p>
                        <p className="font-mono text-[10px] text-[#57606A] font-bold mt-0.5">
                          RA / Identificação: {user.matricula}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-[9px] font-mono font-bold text-amber-700 tracking-wider">
                      AGUARDANDO APROVAÇÃO
                    </span>
                  </div>

                  {/* Toggle admin level selection */}
                  <div className="p-3 bg-[#F6F8FA] rounded-md border border-[#D0D7DE] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={`w-4 h-4 ${isGrantAdmin ? "text-purple-600" : "text-gray-400"}`} />
                      <div>
                        <p className="font-sans font-semibold text-xs text-[#24292F]">Conceder Nível de Administrador</p>
                        <p className="font-sans text-[10px] text-[#57606A]">
                          Permitirá a este usuário aprovar novos cadastros e gerenciar acessos.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-block w-9 h-5 cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={isGrantAdmin}
                        onChange={() => toggleAdminGrant(user.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                    </label>
                  </div>

                  {/* Approve / Reject Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => onApproveUser(user.id, isGrantAdmin)}
                      className="w-full bg-[#2DA44E] border border-[#2c974b] text-white hover:bg-[#2c974b] py-1.5 rounded-md font-sans text-xs font-bold tracking-wide flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      APROVAR ACESSO
                    </button>
                    <button
                      onClick={() => onRejectUser(user.id)}
                      className="w-full bg-white border border-[#CF222E] text-[#CF222E] hover:bg-[#FFF5F5] py-1.5 rounded-md font-sans text-xs font-bold tracking-wide flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      RECUSAR E DELETAR
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      )}

      {/* Tab 2 Content: Pending Class Enrollment Requests */}
      {activeTab === "pending_enroll" && (
        <section className="space-y-3">
          {pendingRequests.length === 0 ? (
            <div className="bg-white border border-[#D0D7DE] rounded-md p-8 text-center text-[#57606A] text-xs">
              <CheckCircle className="w-10 h-10 text-[#2DA44E] mx-auto mb-2" />
              <p className="font-sans font-semibold text-gray-800">Tudo limpo!</p>
              <p className="text-[11px] text-gray-500 mt-1">Nenhuma matrícula em turmas pendente de aprovação.</p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-[#D0D7DE] rounded-md p-4 hover:border-[#0969DA]/40 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded bg-[#F6F8FA] border border-[#D0D7DE] flex items-center justify-center text-[#57606A] shrink-0">
                      <User className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-xs text-[#24292F]">
                        {req.aluno_nome}
                      </h4>
                      <p className="font-mono text-[9px] text-[#57606A] font-bold mt-0.5">
                        RA: {req.aluno_matricula}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-[#FFF8E6] border border-[#FFE0B2] rounded text-[8px] font-mono font-bold text-[#B78103] tracking-wider">
                    MATRÍCULA SOLICITADA
                  </span>
                </div>

                <div className="mb-4 bg-[#F6F8FA] p-3 rounded-md border border-[#D0D7DE]">
                  <span className="block font-mono text-[8px] text-[#57606A] font-bold uppercase tracking-wider mb-1.5">
                    TURMAS SOLICITADAS:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {req.turmas_solicitadas.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 bg-white rounded border border-[#D0D7DE] text-[10px] text-[#0969DA] font-bold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Approve / Reject Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onProcessRequest(req.id, "APROVADO")}
                    className="w-full bg-[#2DA44E] border border-[#2c974b] text-white hover:bg-[#2c974b] py-1.5 rounded-md font-sans text-xs font-bold tracking-wide flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    APROVAR MATRÍCULA
                  </button>
                  <button
                    onClick={() => onProcessRequest(req.id, "RECUSADO")}
                    className="w-full bg-white border border-[#CF222E] text-[#CF222E] hover:bg-[#FFF5F5] py-1.5 rounded-md font-sans text-xs font-bold tracking-wide flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    RECUSAR
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* Tab 3 Content: Active Classes Directory */}
      {activeTab === "classes" && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white border border-[#D0D7DE] border-l-4 border-l-[#0969DA] rounded-md p-4 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-start gap-2 mb-1">
                <h4 className="font-sans font-bold text-[#24292F] text-xs leading-tight">
                  Cálculo Diferencial III
                </h4>
                <span className="font-mono text-[8px] font-bold text-[#0969DA] bg-[#E7F3FF] px-1.5 py-0.5 rounded border border-[#D0D7DE]/30 shrink-0">
                  42 ALUNOS
                </span>
              </div>
              <p className="font-sans text-[11px] text-[#57606A] mb-4">Professor Responsável: Dr. Ricardo Veras</p>
            </div>
            <button className="w-full py-1 bg-[#F6F8FA] text-[#57606A] font-sans text-[10px] font-bold uppercase rounded border border-[#D0D7DE] hover:bg-[#F3F4F6] hover:text-[#24292F] transition-all">
              Ver Detalhes da Turma
            </button>
          </div>

          <div className="bg-white border border-[#D0D7DE] border-l-4 border-l-[#0969DA] rounded-md p-4 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-start gap-2 mb-1">
                <h4 className="font-sans font-bold text-[#24292F] text-xs leading-tight">
                  Design UX/UI Avançado
                </h4>
                <span className="font-mono text-[8px] font-bold text-[#0969DA] bg-[#E7F3FF] px-1.5 py-0.5 rounded border border-[#D0D7DE]/30 shrink-0">
                  28 ALUNOS
                </span>
              </div>
              <p className="font-sans text-[11px] text-[#57606A] mb-4">Professora Responsável: Helena Silveira</p>
            </div>
            <button className="w-full py-1 bg-[#F6F8FA] text-[#57606A] font-sans text-[10px] font-bold uppercase rounded border border-[#D0D7DE] hover:bg-[#F3F4F6] hover:text-[#24292F] transition-all">
              Ver Detalhes da Turma
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
