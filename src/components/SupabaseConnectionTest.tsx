/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Database, Wifi, WifiOff, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { isSupabaseConfigured, testSupabaseConnection } from "../lib/supabase";

export default function SupabaseConnectionTest() {
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "failed">("idle");
  const [testMessage, setTestMessage] = useState("");

  const handleTestConnection = async () => {
    setTestStatus("testing");
    setTestMessage("");
    try {
      const res = await testSupabaseConnection();
      if (res.success) {
        setTestStatus("success");
        setTestMessage(res.message);
      } else {
        setTestStatus("failed");
        setTestMessage(res.message);
      }
    } catch (err: any) {
      setTestStatus("failed");
      setTestMessage(err?.message || "Erro desconhecido ao testar conexão.");
    }
  };

  return (
    <div className="p-4 bg-[#F6F8FA] border border-[#D0D7DE] rounded-md space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#24292F] uppercase tracking-wider">
          <Database className="w-3.5 h-3.5 text-[#0969DA]" />
          Conexão Supabase
        </span>
        {isSupabaseConfigured ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#2DA44E] bg-[#EAF5EC] px-2 py-0.5 rounded border border-[#2DA44E]/20">
            <Wifi className="w-3 h-3" /> CONFIGURADO
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#D1242F] bg-[#FFEBE9] px-2 py-0.5 rounded border border-[#D1242F]/20">
            <WifiOff className="w-3 h-3" /> MODO LOCAL
          </span>
        )}
      </div>

      <p className="text-[11px] text-[#57606A] font-sans leading-relaxed">
        {isSupabaseConfigured
          ? "As chaves de acesso estão presentes. Você pode testar se a autenticação e conexão com as tabelas do schema 'smartclass' estão ativas clicando abaixo."
          : "Sem chaves do Supabase configuradas nas variáveis de ambiente. O aplicativo está rodando em modo LocalStorage."}
      </p>

      {isSupabaseConfigured && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus === "testing"}
            className="w-full bg-white hover:bg-[#F3F4F6] border border-[#D0D7DE] text-[#24292F] py-1.5 px-3 rounded text-xs font-sans font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {testStatus === "testing" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0969DA]" />
                Testando tabelas...
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-[#57606A]" />
                Testar Conexão Supabase
              </>
            )}
          </button>

          {testStatus !== "idle" && (
            <div
              className={`p-2.5 rounded border text-[11px] font-sans leading-relaxed animate-fade-in ${
                testStatus === "success"
                  ? "bg-[#EAF5EC] border-[#2DA44E]/30 text-[#24292F]"
                  : "bg-[#FFEBE9] border-[#D1242F]/30 text-[#24292F]"
              }`}
            >
              <div className="flex items-start gap-1.5">
                {testStatus === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-[#2DA44E] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-[#D1242F] shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block mb-0.5 text-xs">
                    {testStatus === "success" ? "Conectado!" : "Erro na Conexão"}
                  </strong>
                  <p className="font-mono text-[10px] break-words text-[#57606A]">{testMessage}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
