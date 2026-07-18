/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Coins, GraduationCap, ShieldAlert, Users, LogOut } from "lucide-react";
import { Student } from "../types";

interface HeaderProps {
  role: "aluno" | "professor";
  setRole: (role: "aluno" | "professor") => void;
  student: Student;
  currentScreenTitle: string;
  onLogout?: () => void;
  onClickProfile?: () => void;
  onClickCoins?: () => void;
  onClickAccessManagement?: () => void;
}

export function ClassCoinsLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0969DA" />
          <stop offset="100%" stopColor="#033D82" />
        </linearGradient>
        <linearGradient id="logoCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FF9F00" />
        </linearGradient>
      </defs>
      {/* Outer elegant squircle */}
      <rect x="2" y="2" width="96" height="96" rx="24" fill="url(#logoBgGrad)" />
      {/* Inner premium coin ring */}
      <circle cx="50" cy="50" r="30" fill="url(#logoCoinGrad)" stroke="#FFFFFF" strokeWidth="4" />
      {/* Dynamic Graduation Cap overlay inside coin */}
      <path d="M50 32 L72 43 L50 54 L28 43 Z" fill="#033D82" />
      <path d="M38 48.5 V59 C38 62 50 65 50 65 C50 65 62 62 62 59 V48.5" fill="none" stroke="#033D82" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M66 45.5 V59 L69 60.5 V47 Z" fill="#033D82" />
    </svg>
  );
}

export default function Header({
  role,
  setRole,
  student,
  currentScreenTitle,
  onLogout,
  onClickProfile,
  onClickCoins,
  onClickAccessManagement
}: HeaderProps) {
  const isProfessor = role === "professor";

  // Actual avatar URLs from design documents
  const professorAvatar =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuArNAN8JGCS92w1aaTa2YShbaDBgngWQcSTFtohm5PVHDnTjz3ZWBgQBYyG3iXvWeCKX17m0RcbyED3n933dby_hFa4UkOkY-zsHi5vQvFfU1Ohwx76psJkt8YY6lw8dWmfAGLUioXbzjRnpQyQZeGuwdU4v2W8OFYAVPU2LNchVdng13aa4qLVNoZfyVkamaiLmKfEUnayAmZi7xLH8w9jp-VfbyodCc_iH4oVs8ZHzuyHCwWuQLaQc8QziyBqY7XtmVKMZ4xZiA";
  const studentAvatar =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCz3KyOYsNot-SMvcZGX77eVZUoM8KcaHp0sAuylqKfQPsqceVzM-4aAtiLH_0LtHf0N5kUUzjBWEEb6-AYzIWyoNqvEo2JKZl1NvrednDkhE0Oen68nzSpua6C5H8gkpO5j3F61gw8f7pdnsXJQY5b-TzvPMOxRgOs-u0Ag8_4F6FjwKQ57NQ83dRmrtXbBvRzgudr2Quv5HzqBmbV5f-RbJTAuhK-e4Fu3ngaCy0OIyLmAP-pWEbBvvUb9iWyZBLkXet8QPfe4g";

  return (
    <header className="fixed top-0 left-0 right-0 h-12 bg-white border-b border-[#D0D7DE] z-50 px-4 md:px-6 flex justify-between items-center">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Premium Brand Logo */}
        <ClassCoinsLogo className="w-8 h-8 shrink-0 hover:scale-105 transition-all duration-150 cursor-pointer" />
        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-bold text-[#24292F] leading-none">Smart Class</span>
          <span className="block text-[8px] font-mono text-[#57606A] uppercase tracking-wider mt-0.5">Educação Gamificada</span>
        </div>
        <div className="h-5 w-[1px] bg-[#D0D7DE] hidden sm:block mx-1"></div>
        <h1 className="font-sans font-semibold text-xs md:text-sm text-[#24292F] line-clamp-1">
          {currentScreenTitle}
        </h1>
      </div>

      {/* Action center with Selector and Coin Display */}
      <div className="flex items-center gap-2">
        {/* Admin Access Management Quick Link */}
        {student?.is_admin && onClickAccessManagement && (
          <button
            onClick={onClickAccessManagement}
            title="Ambiente de Gestão de Acessos (Admin)"
            className="flex items-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-md text-[11px] font-sans font-bold transition-all shadow-sm cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
            <span className="hidden sm:inline">Gestão de Acessos</span>
          </button>
        )}

        {/* Role toggle switcher */}
        <div className="flex bg-[#F6F8FA] rounded-md p-0.5 border border-[#D0D7DE]">
          <button
            onClick={() => setRole("aluno")}
            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
              !isProfessor
                ? "bg-white text-[#0969DA] border border-[#D0D7DE]/40 shadow-sm"
                : "text-[#57606A] hover:text-[#24292F]"
            }`}
          >
            <GraduationCap className="w-3 h-3" />
            Aluno
          </button>
          <button
            onClick={() => setRole("professor")}
            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
              isProfessor
                ? "bg-white text-[#2DA44E] border border-[#D0D7DE]/40 shadow-sm"
                : "text-[#57606A] hover:text-[#24292F]"
            }`}
          >
            <Users className="w-3 h-3" />
            Professor
          </button>
        </div>

        {/* ClassCoin Chip */}
        <button
          onClick={onClickCoins}
          disabled={isProfessor}
          title={isProfessor ? "Saldo ClassCoins" : "Clique para ir à Loja!"}
          className={`flex items-center bg-[#F6F8FA] px-2.5 py-0.5 rounded-md border border-[#D0D7DE] gap-1.5 transition-all text-left ${
            isProfessor ? "cursor-default" : "hover:bg-[#E7F3FF] hover:border-[#0969DA] cursor-pointer"
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-mono text-[11px] font-bold text-[#24292F] tracking-tight">
            {student.coins_saldo.toFixed(0)} <span className="text-[9px] text-[#57606A] font-sans">CC</span>
          </span>
        </button>

        {/* User avatar */}
        <button
          onClick={onClickProfile}
          disabled={isProfessor}
          title={isProfessor ? "Professor Ricardo" : "Ir para o meu Perfil"}
          className={`w-8 h-8 rounded-md border border-[#D0D7DE] overflow-hidden hidden md:block transition-all ${
            isProfessor ? "cursor-default" : "hover:border-[#0969DA] hover:scale-105 cursor-pointer"
          }`}
        >
          <img
            className="w-full h-full object-cover"
            src={isProfessor ? professorAvatar : studentAvatar}
            alt={isProfessor ? "Professor Ricardo" : "Estudante Ana"}
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Sair do Sistema"
            className="p-1.5 bg-[#FFF5F5] hover:bg-red-50 border border-[#D0D7DE] text-red-500 rounded-md transition-all cursor-pointer flex items-center justify-center"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}
