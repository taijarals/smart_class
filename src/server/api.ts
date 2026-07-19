import { Router } from "express";
import { getSupabaseAdmin } from "../lib/server-supabase";

const router = Router();

router.get("/students", async (req, res) => {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(500).json({ error: "Configuração do Supabase ausente" });
  const { data, error } = await supabaseAdmin
    .from("sc_usuarios")
    .select(`
        id,
        nome,
        email,
        usuario,
        role,
        approved,
        is_admin,
        sc_perfis_academicos (matricula, xp, level, completed_quizzes_count),
        sc_saldos (coins_saldo)
      `);
      
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json(data);
});

router.get("/student/:id", async (req, res) => {
  const { id } = req.params;
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(500).json({ error: "Configuração do Supabase ausente" });
  const { data, error } = await supabaseAdmin
    .from("sc_usuarios")
    .select(`
        id,
        nome,
        email,
        usuario,
        role,
        approved,
        is_admin,
        sc_perfis_academicos (matricula, xp, level, completed_quizzes_count),
        sc_saldos (coins_saldo)
      `)
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

router.get("/questions", async (req, res) => {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(500).json({ error: "Configuração do Supabase ausente" });
  const { data, error } = await supabaseAdmin
    .from("sc_questoes")
    .select("*");
      
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json(data);
});

router.get("/requests", async (req, res) => {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(500).json({ error: "Configuração do Supabase ausente" });
  const { data, error } = await supabaseAdmin
    .from("sc_solicitacoes")
    .select("*");
      
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json(data);
});

router.get("/redemption-logs", async (req, res) => {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(500).json({ error: "Configuração do Supabase ausente" });
  const { data, error } = await supabaseAdmin
    .from("sc_resgates")
    .select("*");
      
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json(data);
});

router.get("/quiz-checkins", async (req, res) => {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(500).json({ error: "Configuração do Supabase ausente" });
  const { data, error } = await supabaseAdmin
    .from("sc_checkins_quiz")
    .select("*");
      
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json(data);
});

router.post("/questions/upsert", async (req, res) => {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(500).json({ error: "Configuração do Supabase ausente" });
  const { data, error } = await supabaseAdmin
    .from("sc_questoes")
    .upsert(req.body);
    
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return res.status(500).json({ error: "Configuração do Supabase ausente" });
  const { error } = await supabaseAdmin
    .from("sc_questoes")
    .delete()
    .eq("id", id);
    
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;
