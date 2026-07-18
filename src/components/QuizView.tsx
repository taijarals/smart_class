/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Coins, Clock, ArrowRight, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import { Student, Question } from "../types";

interface QuizViewProps {
  student: Student;
  questions: Question[];
  onFinishQuiz: (correctAnswers: number, coinsEarned: number) => void;
  onCloseQuiz: () => void;
}

export default function QuizView({ student, questions, onFinishQuiz, onCloseQuiz }: QuizViewProps) {
  // We need exactly 5 questions for a complete exam
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [quizFinished, setQuizFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIdx] || null;

  // Initialize countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Auto submit when time runs out
          setQuizFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optionKey: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionKey
    }));
  };

  const handleNext = () => {
    if (currentIdx < 4) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Compute final results
  const calculateResult = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.resposta_correta) {
        correctCount++;
      }
    });

    // Equation: Coins Ganhas = 1.0 + (Quantidade de Acertos * 0.2)
    const coinsEarned = 1.0 + correctCount * 0.2;
    return {
      correctCount,
      coinsEarned
    };
  };

  const handleComplete = () => {
    const { correctCount, coinsEarned } = calculateResult();
    onFinishQuiz(correctCount, coinsEarned);
  };

  // Timer visualization details
  const progressPercent = (timeLeft / 300) * 100;
  const strokeDashoffset = 440 * (1 - timeLeft / 300);

  // Determine color theme for timer
  let timerColorClass = "text-[#0969DA]";
  let timerProgressColorClass = "bg-[#0969DA]";
  if (timeLeft <= 60) {
    timerColorClass = "text-red-600 animate-pulse";
    timerProgressColorClass = "bg-red-600";
  } else if (timeLeft <= 150) {
    timerColorClass = "text-amber-500";
    timerProgressColorClass = "bg-amber-500";
  }

  if (quizFinished) {
    const { correctCount, coinsEarned } = calculateResult();
    return (
      <div className="max-w-md mx-auto bg-white border border-[#D0D7DE] rounded-md p-5 text-center my-4 animate-fade-in">
        <div className="w-16 h-16 bg-[#EAF5EC] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D0D7DE]">
          <CheckCircle2 className="w-8 h-8 text-[#2DA44E]" />
        </div>
        <h2 className="font-sans font-bold text-xl text-[#24292F] mb-1">Check-in Concluído!</h2>
        <p className="font-sans text-xs text-[#57606A] mb-4 leading-relaxed">
          Sua presença para a aula do dia foi registrada oficialmente no portal acadêmico!
        </p>

        {/* Scoring details */}
        <div className="bg-[#F6F8FA] rounded-md p-4 mb-4 border border-[#D0D7DE] text-left space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#D0D7DE]">
            <span className="font-sans text-xs text-[#57606A]">Nota da Mini-Prova</span>
            <span className="font-sans font-bold text-[#24292F] text-xs">
              {correctCount} / 5 acertos
            </span>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-mono text-[9px] text-[#57606A] font-bold tracking-wider uppercase">DEMONSTRATIVO DE RECOMPENSAS</h4>
            <div className="flex justify-between text-[11px] text-[#57606A]">
              <span>Presença na aula (Fração Fixa)</span>
              <span className="font-semibold text-[#24292F]">+1.00 CC</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#57606A]">
              <span>Fração Desempenho ({correctCount} acertos × 0.2)</span>
              <span className="font-semibold text-[#24292F]">+{ (correctCount * 0.2).toFixed(2) } CC</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-[#2DA44E] pt-2 border-t border-dashed border-[#D0D7DE]">
              <span className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-amber-500" />
                ClassCoins Recebidos
              </span>
              <span>{coinsEarned.toFixed(2)} CC</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleComplete}
          className="w-full bg-[#2DA44E] text-white hover:bg-[#2c974b] py-2 rounded-md font-sans font-bold text-xs tracking-wide transition-all"
        >
          Resgatar Moedas e Sair
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="p-6 text-center bg-white rounded-md border border-red-200">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2" />
        <p className="text-gray-700 text-xs font-medium">Ops! Nenhuma questão encontrada para este sorteio.</p>
        <button onClick={onCloseQuiz} className="mt-3 text-[#0969DA] text-xs font-bold">Voltar</button>
      </div>
    );
  }

  const selectedAnswer = answers[currentQuestion.id] || "";

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center py-2 animate-fade-in select-none">
      {/* Interactive Circular Timer */}
      <div className="relative w-28 h-28 mt-1 mb-3 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            className="text-gray-100"
            cx="56"
            cy="56"
            fill="transparent"
            r="48"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle
            className={`transition-all duration-1000 ease-linear ${timerColorClass}`}
            cx="56"
            cy="56"
            fill="transparent"
            r="48"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="301"
            strokeDashoffset={301 * (1 - timeLeft / 300)}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-mono text-xl font-bold tracking-tighter text-[#24292F]">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[8px] font-mono font-bold text-[#57606A] tracking-wider uppercase">REGRESSIVO</span>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="w-full mb-4">
        <div className="flex justify-between items-end mb-1.5">
          <span className="font-mono text-[9px] font-bold text-[#57606A] uppercase tracking-wider">
            Questão {currentIdx + 1} de 5
          </span>
          <span className="font-mono text-[9px] font-bold text-[#57606A] uppercase tracking-wider">
            {timeLeft <= 60 ? "TEMPO CRÍTICO!" : "TEMPO RESTANTE"}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#F6F8FA] rounded-full overflow-hidden border border-[#D0D7DE]/50">
          <div
            className={`h-full transition-all duration-300 rounded-full ${timerProgressColorClass}`}
            style={{ width: `${((currentIdx + 1) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Question section */}
      <section className="w-full space-y-3">
        <div className="bg-white border border-[#D0D7DE] p-4 rounded-md">
          <span className="inline-block px-2 py-0.5 bg-[#E7F3FF] text-[#0969DA] rounded text-[9px] font-mono font-bold uppercase tracking-wider mb-2 border border-[#D0D7DE]/50">
            Nível {currentQuestion.nivel}
          </span>
          <h3 className="font-sans font-bold text-[#24292F] text-sm md:text-base leading-relaxed">
            {currentQuestion.enunciado}
          </h3>
        </div>

        {/* Options Cards */}
        <div className="space-y-2">
          {Object.entries(currentQuestion.opcoes).map(([key, value]) => {
            const isSelected = selectedAnswer === key;
            return (
              <div
                key={key}
                onClick={() => handleSelectOption(key)}
                className={`group relative flex items-center p-3 bg-white border rounded-md cursor-pointer transition-all select-none ${
                  isSelected
                    ? "border-[#0969DA] bg-[#E7F3FF]/40"
                    : "border-[#D0D7DE] hover:border-[#0969DA] hover:bg-[#F6F8FA]"
                }`}
              >
                <div
                  className={`w-7 h-7 flex-shrink-0 flex items-center justify-center border rounded mr-3 font-mono text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-[#0969DA] border-[#0969DA] text-white"
                      : "border-[#D0D7DE] text-[#57606A] group-hover:border-[#0969DA]"
                  }`}
                >
                  {key}
                </div>
                <span className="font-sans text-xs text-[#24292F] leading-normal flex-1 pr-2">
                  {value}
                </span>
                <div
                  className={`absolute inset-0 border rounded-md pointer-events-none transition-all ${
                    isSelected ? "border-[#0969DA]" : "border-transparent"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer controls */}
      <div className="w-full mt-4">
        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className={`w-full py-2.5 rounded-md font-sans font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all ${
            selectedAnswer
              ? "bg-[#0969DA] text-white hover:bg-[#085dc3] cursor-pointer"
              : "bg-[#F6F8FA] text-[#57606A] border border-[#D0D7DE] cursor-not-allowed"
          }`}
        >
          {currentIdx < 4 ? (
            <>
              Próxima Questão
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            "Finalizar Prova"
          )}
        </button>
      </div>
    </div>
  );
}
