/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Users, 
  BookOpen, 
  ShieldAlert, 
  User, 
  ShieldCheck, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Sparkles, 
  Coins, 
  Award,
  Key
} from "lucide-react";
import { EnrollmentRequest, Student } from "../types";

interface AccessManagementProps {
  requests: EnrollmentRequest[];
  onProcessRequest: (id: string, action: "APROVADO" | "RECUSADO") => void;
  onGoBack: () => void;
  usersList: Student[];
  onApproveUser: (userId: string, makeAdmin: boolean) => void;
  onRejectUser: (userId: string) => void;
  onUpdateUser?: (user: Student) => void;
  student?: Student;
}

export default function AccessManagement({
  requests,
  onProcessRequest,
  onGoBack,
  usersList,
  onApproveUser,
  onRejectUser,
  onUpdateUser,
  student
}: AccessManagementProps) {
  const [activeTab, setActiveTab] = useState<"users" | "pending_enroll" | "classes" | "all_users">(
    student?.is_admin ? "users" : "pending_enroll"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [adminGrants, setAdminGrants] = useState<Record<string, boolean>>({});

  // States for user editing
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Student | null>(null);

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

  // Filter all users for the administrator tab
  const allFilteredUsers = usersList.filter(
    (u) =>
      u.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.matricula.includes(searchQuery) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.usuario.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAdminGrant = (userId: string) => {
    setAdminGrants((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleStartEdit = (user: Student) => {
    setEditingUserId(user.id);
    setEditForm({ ...user });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    if (editForm && onUpdateUser) {
      if (!editForm.nome || !editForm.email || !editForm.matricula) {
        alert("Nome, E-mail e Matrícula são campos obrigatórios.");
        return;
      }
      onUpdateUser(editForm);
      setEditingUserId(null);
      setEditForm(null);
    }
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
            Aprovação de novos usuários, concessão de nível de Administrador, matrículas em turmas e controle de contas.
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
      <div className="flex border-b border-[#D0D7DE] mb-4 bg-white rounded-md border p-1 gap-1 flex-wrap md:flex-nowrap">
        {student?.is_admin && (
          <button
            onClick={() => {
              setActiveTab("users");
              setSearchQuery("");
              handleCancelEdit();
            }}
            className={`flex-1 py-2 text-center relative font-sans font-bold text-xs transition-all duration-150 rounded-md cursor-pointer ${
              activeTab === "users" ? "bg-[#0969DA] text-white shadow-sm" : "text-[#57606A] hover:text-[#24292F]"
            }`}
          >
            Cadastros Pendentes ({pendingUsers.length})
          </button>
        )}
        <button
          onClick={() => {
            setActiveTab("pending_enroll");
            setSearchQuery("");
            handleCancelEdit();
          }}
          className={`flex-1 py-2 text-center relative font-sans font-bold text-xs transition-all duration-150 rounded-md cursor-pointer ${
            activeTab === "pending_enroll" ? "bg-[#0969DA] text-white shadow-sm" : "text-[#57606A] hover:text-[#24292F]"
          }`}
        >
          Matrícula em Turmas ({pendingRequests.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("classes");
            setSearchQuery("");
            handleCancelEdit();
          }}
          className={`flex-1 py-2 text-center relative font-sans font-bold text-xs transition-all duration-150 rounded-md cursor-pointer ${
            activeTab === "classes" ? "bg-[#0969DA] text-white shadow-sm" : "text-[#57606A] hover:text-[#24292F]"
          }`}
        >
          Turmas Ativas
        </button>
        {student?.is_admin && (
          <button
            onClick={() => {
              setActiveTab("all_users");
              setSearchQuery("");
              handleCancelEdit();
            }}
            className={`flex-1 py-2 text-center relative font-sans font-bold text-xs transition-all duration-150 rounded-md cursor-pointer ${
              activeTab === "all_users" ? "bg-[#0969DA] text-white shadow-sm" : "text-[#57606A] hover:text-[#24292F]"
            }`}
          >
            Gerenciar Todos Usuários ({usersList.length})
          </button>
        )}
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
                : activeTab === "classes"
                ? "Buscar turma por nome..."
                : "Buscar usuário por nome, e-mail, usuário ou matrícula..."
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
                  className="bg-white border border-[#D0D7DE] rounded-md p-4 hover:border-[#0969DA]/40 transition-all shadow-sm space-y-4 animate-fade-in"
                >
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E7F3FF] border border-[#0969DA]/20 flex items-center justify-center text-[#0969DA] shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-xs text-[#24292F] flex items-center gap-2 flex-wrap">
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
                    <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-[9px] font-mono font-bold text-amber-700 tracking-wider uppercase shrink-0">
                      AGUARDANDO APROVAÇÃO
                    </span>
                  </div>

                  {/* Toggle admin level selection */}
                  <div className="p-3 bg-[#F6F8FA] rounded-md border border-[#D0D7DE] flex items-center justify-between gap-4">
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
                className="bg-white border border-[#D0D7DE] rounded-md p-4 hover:border-[#0969DA]/40 transition-all shadow-sm animate-fade-in"
              >
                <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
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
                  <span className="px-2 py-0.5 bg-[#FFF8E6] border border-[#FFE0B2] rounded text-[8px] font-mono font-bold text-[#B78103] tracking-wider uppercase shrink-0">
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
                    className="w-full bg-[#2DA44E] border border-[#2c974b] text-white hover:bg-[#2c974b] py-1.5 rounded-md font-sans text-xs font-bold tracking-wide flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    APROVAR MATRÍCULA
                  </button>
                  <button
                    onClick={() => onProcessRequest(req.id, "RECUSADO")}
                    className="w-full bg-white border border-[#CF222E] text-[#CF222E] hover:bg-[#FFF5F5] py-1.5 rounded-md font-sans text-xs font-bold tracking-wide flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
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
          <div className="bg-white border border-[#D0D7DE] border-l-4 border-l-[#0969DA] rounded-md p-4 flex flex-col justify-between shadow-sm animate-fade-in">
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
            <button className="w-full py-1.5 bg-[#F6F8FA] text-[#57606A] font-sans text-[10px] font-bold uppercase rounded border border-[#D0D7DE] hover:bg-[#F3F4F6] hover:text-[#24292F] transition-all cursor-pointer">
              Ver Detalhes da Turma
            </button>
          </div>

          <div className="bg-white border border-[#D0D7DE] border-l-4 border-l-[#0969DA] rounded-md p-4 flex flex-col justify-between shadow-sm animate-fade-in">
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
            <button className="w-full py-1.5 bg-[#F6F8FA] text-[#57606A] font-sans text-[10px] font-bold uppercase rounded border border-[#D0D7DE] hover:bg-[#F3F4F6] hover:text-[#24292F] transition-all cursor-pointer">
              Ver Detalhes da Turma
            </button>
          </div>
        </section>
      )}

      {/* Tab 4 Content: All Registered Users (ADMIN ONLY) */}
      {activeTab === "all_users" && student?.is_admin && (
        <section className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-xs font-sans">
            Você está acessando a central de contas. Como <strong>Administrador</strong>, você pode alterar permissões, cargos, saldos de moedas e aprovar/suspender usuários livremente.
          </div>

          <div className="space-y-3">
            {allFilteredUsers.length === 0 ? (
              <div className="bg-white border border-[#D0D7DE] rounded-md p-8 text-center text-[#57606A] text-xs">
                <p className="font-sans font-semibold text-gray-800">Nenhum usuário encontrado</p>
                <p className="text-[11px] text-gray-500 mt-1">Verifique sua busca ou filtre novamente.</p>
              </div>
            ) : (
              allFilteredUsers.map((user) => {
                const isEditing = editingUserId === user.id;
                const isSelf = user.id === student.id;

                return (
                  <div
                    key={user.id}
                    className={`bg-white border rounded-md transition-all shadow-sm ${
                      isEditing 
                        ? "border-[#0969DA] ring-2 ring-[#0969DA]/10 p-5 space-y-4" 
                        : "border-[#D0D7DE] p-4 hover:border-[#0969DA]/40"
                    }`}
                  >
                    {!isEditing ? (
                      /* Read-Only Mode */
                      <div className="space-y-3">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${
                              user.role === "professor" 
                                ? "bg-purple-50 border-purple-200 text-purple-700" 
                                : "bg-blue-50 border-blue-200 text-blue-700"
                            }`}>
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-sans font-bold text-xs text-[#24292F] flex items-center gap-1.5 flex-wrap">
                                {user.nome} {isSelf && <span className="text-[10px] text-gray-400 font-normal font-sans">(Você)</span>}
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                                  user.role === "professor"
                                    ? "bg-purple-100 border border-purple-200 text-purple-700"
                                    : "bg-blue-100 border border-blue-200 text-blue-700"
                                }`}>
                                  {user.role}
                                </span>
                                {user.is_admin && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-red-100 border border-red-200 text-red-700">
                                    ADMIN
                                  </span>
                                )}
                              </h4>
                              <p className="font-sans text-[11px] text-[#57606A] mt-0.5">
                                Usuário: <span className="font-mono text-[10px] text-gray-800 font-bold">{user.usuario}</span> &bull; E-mail: {user.email}
                              </p>
                              <p className="font-sans text-[11px] text-[#57606A]">
                                Matrícula / ID: <span className="font-mono font-bold">{user.matricula}</span> &bull; Senha: <span className="font-mono font-semibold bg-gray-100 px-1 py-0.2 rounded text-[10px] text-gray-700" title="Senha de Login">{user.senha}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase ${
                              user.approved 
                                ? "bg-green-100 border border-green-200 text-green-700" 
                                : "bg-amber-100 border border-amber-200 text-amber-700"
                            }`}>
                              {user.approved ? "APROVADO / ATIVO" : "PENDENTE"}
                            </span>

                            {user.role === "aluno" && (
                              <div className="flex gap-2 text-[10px] font-mono font-bold text-gray-600">
                                <span className="flex items-center gap-0.5 text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                  <Coins className="w-3 h-3 shrink-0" />
                                  {user.coins_saldo} C$
                                </span>
                                <span className="flex items-center gap-0.5 text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                  <Award className="w-3 h-3 shrink-0" />
                                  {user.xp} XP (Lvl {user.level})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Admin Account Controls */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => handleStartEdit(user)}
                            className="bg-[#F6F8FA] hover:bg-[#EEF1F4] border border-[#D0D7DE] text-[#24292F] font-sans font-bold text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-600" />
                            Editar Dados / Saldo
                          </button>
                          {!isSelf && (
                            <button
                              onClick={() => {
                                if (confirm(`Tem certeza de que deseja deletar a conta de ${user.nome}? Esta ação é irreversível.`)) {
                                  onRejectUser(user.id);
                                }
                              }}
                              className="bg-white hover:bg-red-50 border border-red-200 hover:border-red-300 text-[#CF222E] font-sans font-semibold text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              Excluir Conta
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Active Edit Form Mode */
                      editForm && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-[#D0D7DE] pb-2">
                            <h4 className="font-sans font-bold text-xs text-[#24292F] flex items-center gap-1">
                              <Edit className="w-4 h-4 text-blue-600" />
                              Editando Usuário: {user.nome} {isSelf && "(Você mesmo)"}
                            </h4>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 hover:bg-gray-100 rounded text-gray-500 cursor-pointer"
                              title="Cancelar edição"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Nome */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">Nome Completo</label>
                              <input
                                type="text"
                                value={editForm.nome}
                                onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                                className="w-full p-2 text-xs bg-white border border-[#D0D7DE] rounded-md focus:border-[#0969DA] outline-none"
                              />
                            </div>

                            {/* Email */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">E-mail</label>
                              <input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="w-full p-2 text-xs bg-white border border-[#D0D7DE] rounded-md focus:border-[#0969DA] outline-none"
                              />
                            </div>

                            {/* Matricula */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">Matrícula / RA</label>
                              <input
                                type="text"
                                value={editForm.matricula}
                                onChange={(e) => setEditForm({ ...editForm, matricula: e.target.value })}
                                className="w-full p-2 text-xs bg-white border border-[#D0D7DE] rounded-md focus:border-[#0969DA] outline-none"
                              />
                            </div>

                            {/* Usuario */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">Username (Login)</label>
                              <input
                                type="text"
                                value={editForm.usuario}
                                onChange={(e) => setEditForm({ ...editForm, usuario: e.target.value })}
                                className="w-full p-2 text-xs bg-white border border-[#D0D7DE] rounded-md focus:border-[#0969DA] outline-none"
                              />
                            </div>

                            {/* Senha */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">Senha</label>
                              <input
                                type="text"
                                value={editForm.senha}
                                onChange={(e) => setEditForm({ ...editForm, senha: e.target.value })}
                                className="w-full p-2 text-xs bg-white border border-[#D0D7DE] rounded-md focus:border-[#0969DA] outline-none font-mono"
                              />
                            </div>

                            {/* Role (Cargo) */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">Papel / Função</label>
                              <select
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value as "aluno" | "professor" })}
                                className="w-full p-2 text-xs bg-white border border-[#D0D7DE] rounded-md focus:border-[#0969DA] outline-none"
                              >
                                <option value="aluno">Aluno / Estudante</option>
                                <option value="professor">Professor / Docente</option>
                              </select>
                            </div>

                            {/* Approved Status */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">Status da Conta</label>
                              <select
                                value={editForm.approved ? "true" : "false"}
                                onChange={(e) => setEditForm({ ...editForm, approved: e.target.value === "true" })}
                                className="w-full p-2 text-xs bg-white border border-[#D0D7DE] rounded-md focus:border-[#0969DA] outline-none"
                              >
                                <option value="true">Aprovado (Ativo)</option>
                                <option value="false">Pendente (Acesso de Espera)</option>
                              </select>
                            </div>

                            {/* Is Admin */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#57606A] uppercase mb-1">Permissão Admin</label>
                              <select
                                value={editForm.is_admin ? "true" : "false"}
                                onChange={(e) => setEditForm({ ...editForm, is_admin: e.target.value === "true" })}
                                disabled={isSelf} // Self admin cannot strip themselves of admin easily to prevent accidental lockout
                                className="w-full p-2 text-xs bg-white border border-[#D0D7DE] rounded-md focus:border-[#0969DA] outline-none disabled:bg-gray-100 disabled:text-gray-400"
                              >
                                <option value="false">Não (Usuário Padrão)</option>
                                <option value="true">Sim (Administrador Global)</option>
                              </select>
                            </div>

                            {/* Only show balance / XP fields for student role */}
                            {editForm.role === "aluno" && (
                              <>
                                {/* ClassCoins Balance */}
                                <div>
                                  <label className="block text-[11px] font-bold text-amber-700 uppercase mb-1 flex items-center gap-1">
                                    <Coins className="w-3.5 h-3.5" />
                                    Saldo ClassCoins
                                  </label>
                                  <input
                                    type="number"
                                    value={editForm.coins_saldo}
                                    onChange={(e) => setEditForm({ ...editForm, coins_saldo: Math.max(0, Number(e.target.value)) })}
                                    className="w-full p-2 text-xs bg-amber-50/40 border border-amber-300 rounded-md focus:border-amber-500 outline-none font-bold"
                                  />
                                </div>

                                {/* XP points */}
                                <div>
                                  <label className="block text-[11px] font-bold text-blue-700 uppercase mb-1 flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5" />
                                    Pontos de XP
                                  </label>
                                  <input
                                    type="number"
                                    value={editForm.xp}
                                    onChange={(e) => setEditForm({ ...editForm, xp: Math.max(0, Number(e.target.value)) })}
                                    className="w-full p-2 text-xs bg-blue-50/40 border border-blue-300 rounded-md focus:border-blue-500 outline-none font-bold"
                                  />
                                </div>

                                {/* Level */}
                                <div>
                                  <label className="block text-[11px] font-bold text-blue-700 uppercase mb-1 flex items-center gap-1">
                                    Nível (Level)
                                  </label>
                                  <input
                                    type="number"
                                    value={editForm.level}
                                    onChange={(e) => setEditForm({ ...editForm, level: Math.max(1, Number(e.target.value)) })}
                                    className="w-full p-2 text-xs bg-blue-50/40 border border-blue-300 rounded-md focus:border-blue-500 outline-none font-bold"
                                  />
                                </div>
                              </>
                            )}
                          </div>

                          {isSelf && (
                            <p className="text-[10px] text-amber-700 italic">
                              Atenção: Você está editando suas próprias informações de conta. Alterações incorretas podem afetar seu acesso atual.
                            </p>
                          )}

                          {/* Form Action Buttons */}
                          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                            <button
                              onClick={handleCancelEdit}
                              className="bg-white hover:bg-gray-50 border border-[#D0D7DE] text-[#24292F] font-sans font-bold text-xs px-3 py-1.5 rounded-md cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="bg-[#2DA44E] hover:bg-[#2c974b] border border-[#2c974b] text-white font-sans font-bold text-xs px-4 py-1.5 rounded-md cursor-pointer flex items-center gap-1"
                            >
                              <Save className="w-4 h-4" />
                              Salvar Alterações
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}
    </div>
  );
}
