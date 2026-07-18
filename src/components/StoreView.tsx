/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Coins, GraduationCap, Calendar, Users, Award, ShieldCheck, HelpCircle } from "lucide-react";
import { Student, ShopItem } from "../types";

interface StoreViewProps {
  student: Student;
  shopItems: ShopItem[];
  onRedeem: (itemId: string, cost: number, itemTitle: string) => void;
}

export default function StoreView({ student, shopItems, onRedeem }: StoreViewProps) {
  const [successItem, setSuccessItem] = useState<string | null>(null);

  const handleRedeem = (item: ShopItem) => {
    if (student.coins_saldo >= item.custo && !item.locked) {
      onRedeem(item.id, item.custo, item.titulo);
      setSuccessItem(item.titulo);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Grade":
        return <GraduationCap className="w-6 h-6 text-blue-600" />;
      case "FileX":
        return <Calendar className="w-6 h-6 text-[#712ae2]" />;
      case "Users":
        return <Users className="w-6 h-6 text-emerald-600" />;
      case "Award":
      default:
        return <Award className="w-6 h-6 text-amber-500" />;
    }
  };

  const getBgColor = (iconName: string) => {
    switch (iconName) {
      case "Grade":
        return "bg-blue-50 border border-blue-100";
      case "FileX":
        return "bg-purple-50 border border-purple-100";
      case "Users":
        return "bg-emerald-50 border border-emerald-100";
      case "Award":
      default:
        return "bg-amber-50 border border-amber-100";
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto py-2 animate-fade-in">
      {/* Header Info */}
      <section className="px-1">
        <h2 className="font-sans font-bold text-lg text-[#24292F]">Smart Store</h2>
        <p className="font-sans text-xs text-[#57606A]">Transforme seu empenho acadêmico em vantagens reais para o semestre.</p>
      </section>

      {/* Feature Promo Banner (High Density Style alert layout) */}
      <div className="relative overflow-hidden bg-[#E7F3FF] border border-[#D0D7DE] rounded-md p-4 flex gap-3 items-center">
        <div className="w-8 h-8 rounded bg-[#0969DA] flex items-center justify-center text-white shrink-0">
          <Coins className="w-5 h-5" />
        </div>
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="inline-block px-1.5 py-0.5 bg-[#0969DA] text-white rounded text-[8px] font-mono font-bold uppercase tracking-wider">
              Evento Limitado
            </span>
            <h3 className="font-sans font-bold text-xs text-[#0969DA]">Semana do Câmbio Acadêmico</h3>
          </div>
          <p className="font-sans text-[11px] text-[#0969DA] leading-normal">
            Consiga os benefícios mais procurados com condições especiais de resgate até sexta-feira. Economize suas ClassCoins!
          </p>
        </div>
      </div>

      {/* Store Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopItems.map((item) => {
          const hasBalance = student.coins_saldo >= item.custo;
          const isDisabled = !hasBalance || item.locked;

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-md p-4 flex flex-col justify-between transition-all ${
                item.locked
                  ? "border-[#D0D7DE] border-dashed bg-[#F6F8FA]/50"
                  : "border-[#D0D7DE] hover:border-[#0969DA]/40"
              }`}
            >
              <div>
                {/* Item Icon */}
                <div className={`w-9 h-9 rounded flex items-center justify-center mb-3 ${
                  item.locked ? "bg-[#F6F8FA] border border-[#D0D7DE]" : getBgColor(item.iconName)
                }`}>
                  {item.locked ? (
                     <Award className="w-4 h-4 text-[#57606A]" />
                  ) : (
                    getIcon(item.iconName)
                  )}
                </div>

                <h4 className="font-sans font-bold text-[#24292F] text-sm mb-1 flex items-center gap-1.5">
                  {item.titulo}
                  {item.locked && (
                    <span className="text-[8px] font-mono font-bold bg-[#F6F8FA] text-[#57606A] border border-[#D0D7DE] px-1 py-0.2 rounded uppercase">
                      BLOQUEADO
                    </span>
                  )}
                </h4>
                <p className="font-sans text-[11px] text-[#57606A] leading-normal mb-4">
                  {item.descricao}
                </p>
              </div>

              {/* Action and Cost Block */}
              <div className="flex items-center justify-between pt-2.5 border-t border-[#D0D7DE]">
                <div className="flex items-center gap-1">
                  <Coins className={`w-3.5 h-3.5 ${hasBalance ? "text-amber-500" : "text-red-500"}`} />
                  <span className={`font-mono text-[11px] font-bold ${
                    hasBalance ? "text-[#24292F]" : "text-red-500"
                  }`}>
                    {item.custo} <span className="text-[9px] font-sans text-[#57606A]">CC</span>
                  </span>
                </div>

                <button
                  onClick={() => handleRedeem(item)}
                  disabled={isDisabled}
                  className={`px-3 py-1 rounded font-sans font-bold text-[10px] transition-all border ${
                    item.locked
                      ? "bg-[#F6F8FA] border-[#D0D7DE] text-[#57606A] cursor-not-allowed"
                      : !hasBalance
                      ? "bg-[#FFF5F5] border-[#FEB2B2] text-red-500 cursor-not-allowed"
                      : "bg-[#2DA44E] border-[#2c974b] text-white hover:bg-[#2c974b]"
                  }`}
                >
                  {item.locked ? "Bloqueado" : !hasBalance ? "Saldo Insuficiente" : "Resgatar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Modal Overlay */}
      {successItem && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D0D7DE] p-5 rounded-md w-full max-w-sm text-center shadow-lg animate-fade-in">
            <div className="w-12 h-12 bg-[#EAF5EC] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#D0D7DE]">
              <ShieldCheck className="w-6 h-6 text-[#2DA44E]" />
            </div>
            <h3 className="font-sans font-bold text-lg text-[#24292F] mb-1">Resgate Concluído!</h3>
            <p className="font-sans text-[11px] text-[#57606A] mb-4 leading-relaxed">
              Você adquiriu o benefício <strong className="text-[#24292F]">"{successItem}"</strong> com sucesso. Um cupom digital foi gerado e registrado no seu perfil acadêmico para uso.
            </p>
            <button
              onClick={() => setSuccessItem(null)}
              className="w-full bg-[#2DA44E] text-white hover:bg-[#2c974b] py-2 rounded-md font-sans font-bold text-xs tracking-wide transition-all"
            >
              Voltar à Loja
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
