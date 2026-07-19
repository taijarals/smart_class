import { Router } from "express";
import bcrypt from "bcrypt";
import { getSupabaseAdmin } from "../lib/server-supabase";

const router = Router();

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Configuração do Supabase ausente" });
  }

  const { data: user, error } = await supabaseAdmin
    .from("sc_usuarios")
    .select("id, nome, email, usuario, senha, role, approved, is_admin")
    .or(`usuario.eq.${identifier},email.eq.${identifier.toLowerCase()}`)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: "Usuário ou senha inválidos" });
  }

  // Verify password using bcrypt
  const validPassword = await bcrypt.compare(password, user.senha);
  if (!validPassword) {
    return res.status(401).json({ error: "Usuário ou senha inválidos" });
  }

  if (!user.approved) {
    return res.status(403).json({ error: "Cadastro pendente de aprovação" });
  }

  // Fetch profile and balance
  const { data: perfil } = await supabaseAdmin
    .from("sc_perfis_academicos")
    .select("*")
    .eq("usuario_id", user.id)
    .single();
    
  const { data: saldo } = await supabaseAdmin
    .from("sc_saldos")
    .select("*")
    .eq("usuario_id", user.id)
    .single();

  res.json({
    ...user,
    matricula: perfil?.matricula,
    xp: perfil?.xp,
    level: perfil?.level,
    completed_quizzes_count: perfil?.completed_quizzes_count,
    coins_saldo: saldo?.coins_saldo
  });
});

router.post("/upsert-student", async (req, res) => {
  const student = req.body;
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Configuração do Supabase ausente" });
  }
  
  // 1. Upsert sc_usuarios
  let hashedSenha = student.senha || "";
  if (hashedSenha && !hashedSenha.startsWith("$2b$")) { // Very basic check if not already hashed
    hashedSenha = await bcrypt.hash(hashedSenha, 10);
  }

  const { error: userError } = await supabaseAdmin
    .from("sc_usuarios")
    .upsert({
      id: student.id,
      nome: student.nome,
      email: student.email,
      usuario: student.usuario || student.email?.split("@")[0] || "",
      senha: hashedSenha,
      role: student.role || "aluno",
      approved: student.approved ?? false,
      is_admin: student.is_admin ?? false
    });

  if (userError) {
    return res.status(500).json({ error: userError.message });
  }

  // 2. Upsert sc_perfis_academicos
  const { error: perfilError } = await supabaseAdmin
    .from("sc_perfis_academicos")
    .upsert({
      usuario_id: student.id,
      matricula: student.matricula || "",
      xp: student.xp ?? 0,
      level: student.level ?? 1,
      completed_quizzes_count: student.completed_quizzes_count ?? 0
    });

  if (perfilError) {
    return res.status(500).json({ error: perfilError.message });
  }

  // 3. Upsert sc_saldos
  const { error: saldoError } = await supabaseAdmin
    .from("sc_saldos")
    .upsert({
      usuario_id: student.id,
      coins_saldo: student.coins_saldo ?? 150
    });

  if (saldoError) {
    return res.status(500).json({ error: saldoError.message });
  }

  res.json({ success: true });
});

export default router;
