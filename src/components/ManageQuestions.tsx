/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Trash, Eye, EyeOff, Save, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { Question, Subject } from "../types";

interface ManageQuestionsProps {
  questions: Question[];
  subjects: Subject[];
  onAddQuestion: (q: Omit<Question, "id">) => void;
  onToggleQuestionStatus: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  onGoBack: () => void;
}

export default function ManageQuestions({
  questions,
  subjects,
  onAddQuestion,
  onToggleQuestionStatus,
  onDeleteQuestion,
  onGoBack
}: ManageQuestionsProps) {
  const [filterSubject, setFilterSubject] = useState<number | "all">("all");
  const [filterNivel, setFilterNivel] = useState<string | "all">("all");

  // Add question state
  const [enunciado, setEnunciado] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [optE, setOptE] = useState("");
  const [respostaCorreta, setRespostaCorreta] = useState("A");
  const [nivel, setNivel] = useState<"Facil" | "Medio" | "Dificil">("Medio");
  const [assuntoId, setAssuntoId] = useState<number>(subjects[0]?.id || 1);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!enunciado.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim() || !optE.trim()) {
      setErrorMsg("Por favor, preencha o enunciado e todas as 5 alternativas (A, B, C, D e E).");
      return;
    }

    onAddQuestion({
      assunto_id: Number(assuntoId),
      enunciado: enunciado.trim(),
      opcoes: {
        A: optA.trim(),
        B: optB.trim(),
        C: optC.trim(),
        D: optD.trim(),
        E: optE.trim()
      },
      resposta_correta: respostaCorreta,
      nivel: nivel,
      status: true
    });

    // Reset fields
    setEnunciado("");
    setOptA("");
    setOptB("");
    setOptC("");
    setOptD("");
    setOptE("");
    setSuccessMsg("Questão cadastrada com sucesso no banco inteligente!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchSubject = filterSubject === "all" || q.assunto_id === Number(filterSubject);
    const matchNivel = filterNivel === "all" || q.nivel === filterNivel;
    return matchSubject && matchNivel;
  });

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-4 animate-fade-in">
      {/* Title & Navigation */}
      <div className="flex items-center justify-between border-b border-[#D0D7DE] pb-3">
        <div>
          <h2 className="font-sans font-bold text-lg text-[#24292F] tracking-tight">
            Banco de Questões Inteligente
          </h2>
          <p className="font-sans text-xs text-[#57606A]">Adicione, edite ou desative questões do quiz gamificado.</p>
        </div>
        <button
          onClick={onGoBack}
          className="text-xs font-bold text-[#0969DA] hover:underline font-sans cursor-pointer"
        >
          &larr; Voltar ao Painel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Create Form */}
        <div className="lg:col-span-5 bg-white border border-[#D0D7DE] rounded-md p-4 space-y-3">
          <div className="flex items-center gap-2 pb-1.5 border-b border-[#D0D7DE]">
            <Plus className="w-4.5 h-4.5 text-[#0969DA]" />
            <h3 className="font-sans font-bold text-[#24292F] text-xs uppercase tracking-wider">Nova Questão Objetiva</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 font-sans text-xs text-[#24292F]">
            {errorMsg && (
              <div className="p-2.5 bg-[#FFF5F5] text-red-600 text-xs rounded-md border border-[#FEB2B2] flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-2.5 bg-[#EAF5EC] text-[#2DA44E] text-xs rounded-md border border-[#D0D7DE]/40 flex items-start gap-1.5">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#2DA44E]" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Select Subject */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#57606A] uppercase font-mono">Assunto Relacionado</label>
              <select
                value={assuntoId}
                onChange={(e) => setAssuntoId(Number(e.target.value))}
                className="w-full bg-white border border-[#D0D7DE] rounded-md p-1.5 text-xs focus:border-[#0969DA] outline-none"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nome} {!sub.status && "(Inativo)"}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Difficulty & Correct Answer */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#57606A] uppercase font-mono">Dificuldade</label>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value as any)}
                  className="w-full bg-white border border-[#D0D7DE] rounded-md p-1.5 text-xs focus:border-[#0969DA] outline-none"
                >
                  <option value="Facil">Fácil</option>
                  <option value="Medio">Médio</option>
                  <option value="Dificil">Difícil</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#57606A] uppercase font-mono">Gabarito</label>
                <select
                  value={respostaCorreta}
                  onChange={(e) => setRespostaCorreta(e.target.value)}
                  className="w-full bg-white border border-[#D0D7DE] rounded-md p-1.5 text-xs focus:border-[#0969DA] outline-none"
                >
                  <option value="A">Alternativa A</option>
                  <option value="B">Alternativa B</option>
                  <option value="C">Alternativa C</option>
                  <option value="D">Alternativa D</option>
                  <option value="E">Alternativa E</option>
                </select>
              </div>
            </div>

            {/* Enunciado */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#57606A] uppercase font-mono">Enunciado</label>
              <textarea
                value={enunciado}
                onChange={(e) => setEnunciado(e.target.value)}
                placeholder="Ex: Qual é a definição clássica de entropia..."
                className="w-full border border-[#D0D7DE] rounded-md p-2 h-16 text-xs focus:border-[#0969DA] outline-none"
              />
            </div>

            {/* Alternatives */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#57606A] uppercase font-mono">Alternativas (Opções)</label>
              <div className="space-y-1.5">
                {["A", "B", "C", "D", "E"].map((letter) => {
                  const val = letter === "A" ? optA : letter === "B" ? optB : letter === "C" ? optC : letter === "D" ? optD : optE;
                  const setVal = letter === "A" ? setOptA : letter === "B" ? setOptB : letter === "C" ? setOptC : letter === "D" ? setOptD : setOptE;
                  return (
                    <div key={letter} className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0969DA] w-4 text-center">{letter}</span>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        placeholder={`Opção ${letter}`}
                        className="flex-1 border border-[#D0D7DE] rounded-md p-1 px-2 text-xs focus:border-[#0969DA] outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0969DA] hover:bg-[#085dc3] text-white py-1.5 rounded-md font-sans font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Nova Questão
            </button>
          </form>
        </div>

        {/* Right Side: Questions Bank Directory */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <h3 className="font-sans font-bold text-[#24292F] text-xs uppercase tracking-wider">Questões Cadastradas ({filteredQuestions.length})</h3>

            {/* Quick Filter Controls */}
            <div className="flex gap-1.5 font-sans text-xs">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="bg-white border border-[#D0D7DE] rounded-md p-1 text-xs outline-none focus:border-[#0969DA]"
              >
                <option value="all">Todos Assuntos</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>

              <select
                value={filterNivel}
                onChange={(e) => setFilterNivel(e.target.value)}
                className="bg-white border border-[#D0D7DE] rounded-md p-1 text-xs outline-none focus:border-[#0969DA]"
              >
                <option value="all">Todos Níveis</option>
                <option value="Facil">Fácil</option>
                <option value="Medio">Médio</option>
                <option value="Dificil">Difícil</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredQuestions.length === 0 ? (
              <div className="bg-white border border-[#D0D7DE] rounded-md p-6 text-center text-[#57606A] text-xs font-sans">
                Nenhuma questão corresponde aos filtros selecionados.
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const associatedSubject = subjects.find((s) => s.id === q.assunto_id);
                return (
                  <div
                    key={q.id}
                    className={`bg-white border rounded-md p-3.5 space-y-2.5 transition-all relative ${
                      q.status ? "border-[#D0D7DE]" : "border-[#D0D7DE] bg-[#F6F8FA]/50 opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[8px] font-mono font-bold bg-[#E7F3FF] text-[#0969DA] px-1.5 py-0.2 rounded border border-[#D0D7DE]/30 uppercase tracking-wider">
                            Nível {q.nivel}
                          </span>
                          <span className="text-[8px] font-mono font-bold bg-[#F6F8FA] text-[#57606A] px-1.5 py-0.2 rounded border border-[#D0D7DE]/30 uppercase tracking-wider">
                            {associatedSubject?.nome || "Cálculo"}
                          </span>
                          {!q.status && (
                            <span className="text-[8px] font-mono font-bold bg-[#F6F8FA] text-red-500 px-1.5 py-0.2 rounded border border-[#D0D7DE]/30 uppercase tracking-wider">
                              Inativa
                            </span>
                          )}
                        </div>
                        <p className="font-sans font-bold text-xs text-[#24292F] leading-relaxed pr-6">
                          {q.enunciado}
                        </p>
                      </div>

                      {/* Side controls (Toggle Status, Delete) */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onToggleQuestionStatus(q.id)}
                          title={q.status ? "Desativar Questão" : "Ativar Questão"}
                          className={`p-1 rounded-md border transition-all cursor-pointer ${
                            q.status
                              ? "bg-[#EAF5EC] border-[#D0D7DE] text-[#2DA44E] hover:bg-gray-100"
                              : "bg-[#F6F8FA] border-[#D0D7DE] text-[#57606A] hover:bg-gray-100"
                          }`}
                        >
                          {q.status ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onDeleteQuestion(q.id)}
                          title="Excluir Questão"
                          className="p-1 bg-[#FFF5F5] border border-red-200 rounded-md text-red-500 hover:bg-red-100 transition-all cursor-pointer"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Display Options in collapsible details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 border-t border-[#D0D7DE]">
                      {Object.entries(q.opcoes).map(([key, value]) => {
                        const isCorrect = q.resposta_correta === key;
                        return (
                          <div
                            key={key}
                            className={`flex gap-1.5 items-start p-1 px-2 rounded border text-[11px] font-sans ${
                              isCorrect
                                ? "bg-[#EAF5EC] border-[#D0D7DE] text-[#2DA44E] font-bold"
                                : "border-[#D0D7DE]/30 text-[#57606A]"
                            }`}
                          >
                            <span className={`font-mono font-bold text-[10px] ${isCorrect ? "text-[#2DA44E]" : "text-[#57606A]"}`}>
                              {key}:
                            </span>
                            <span className="line-clamp-1">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
