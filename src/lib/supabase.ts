import { createClient } from "@supabase/supabase-js";
import { Student, Class, Course, Discipline, Subject, Question, EnrollmentRequest, RedemptionLog, QuizAttempt } from "../types";

// Read Supabase credentials from client-side environment variables
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabaseClient: any = null;
try {
  supabaseClient = isSupabaseConfigured
    ? createClient(supabaseUrl!, supabaseAnonKey!, { db: { schema: 'smartclass' } })
    : null;
  if (isSupabaseConfigured) {
    console.log("Supabase initialized with URL:", supabaseUrl);
  }
} catch (e) {
  console.error("Erro ao inicializar Supabase client:", e);
}

export const supabase = supabaseClient;

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase is not yet configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables to enable cloud syncing."
  );
}

/**
 * DATABASE OPERATIONS WITH SEAMLESS LOCALSTORAGE FALLBACKS
 */

export function mapToStudent(u: any): Student {
  const perfil = Array.isArray(u.sc_perfis_academicos) ? u.sc_perfis_academicos[0] : u.sc_perfis_academicos;
  const saldo = Array.isArray(u.sc_saldos) ? u.sc_saldos[0] : u.sc_saldos;
  return {
    id: u.id,
    nome: u.nome,
    email: u.email,
    usuario: u.usuario,
    senha: u.senha,
    role: u.role,
    approved: u.approved,
    is_admin: u.is_admin,
    matricula: perfil?.matricula || "",
    xp: perfil?.xp ?? 0,
    level: perfil?.level ?? 1,
    completed_quizzes_count: perfil?.completed_quizzes_count ?? 0,
    coins_saldo: saldo?.coins_saldo ?? 150
  };
}

export async function getStudent(id: string): Promise<Student | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
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
      .maybeSingle();

    if (error || !data) return null;
    return mapToStudent(data);
  } catch (err) {
    console.error("API exception:", err);
    return null;
  }
}

export async function getStudentByMatricula(matricula: string): Promise<Student | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("sc_perfis_academicos")
      .select("usuario_id")
      .eq("matricula", matricula)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("Error fetching student by matricula:", error);
      return null;
    }
    return getStudent(data.usuario_id);
  } catch (err) {
    console.error("Supabase exception by matricula:", err);
    return null;
  }
}

export async function getStudentByUsuario(usuario: string): Promise<Student | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
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
      .eq("usuario", usuario)
      .maybeSingle();

    if (error) {
      console.error("Error fetching student by usuario from Supabase:", error);
      return null;
    }
    if (!data) return null;
    return mapToStudent(data);
  } catch (err) {
    console.error("Supabase exception by usuario:", err);
    return null;
  }
}

export async function getStudentByUsuarioOrEmail(identifier: string): Promise<Student | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
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
      .or(`usuario.eq.${identifier},email.eq.${identifier}`)
      .maybeSingle();

    if (error) {
      console.error("Error fetching student by identifier from Supabase:", error);
      return null;
    }
    if (!data) return null;
    return mapToStudent(data);
  } catch (err) {
    console.error("Supabase exception by identifier:", err);
    return null;
  }
}

export async function getStudents(): Promise<Student[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
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
      console.error("Error fetching students from Supabase:", error);
      return null;
    }
    return data ? data.map(mapToStudent) : null;
  } catch (err) {
    console.error("Supabase exception getting students:", err);
    return null;
  }
}

export async function upsertStudent(student: Student): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/upsert-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: student.id,
        nome: student.nome,
        email: student.email,
        usuario: student.usuario || student.email?.split("@")[0] || "",
        senha: student.senha || "",
        role: student.role || "aluno",
        approved: student.approved ?? false,
        is_admin: student.is_admin ?? false,
        matricula: student.matricula || "",
        xp: student.xp ?? 0,
        level: student.level ?? 1,
        completed_quizzes_count: student.completed_quizzes_count ?? 0,
        coins_saldo: student.coins_saldo ?? 150
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao persistir cadastro");
    }

    return true;
  } catch (err: any) {
    console.error("Supabase upsert exception details:", err.message, err);
    return false;
  }
}

export async function deleteStudent(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_usuarios")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting student from Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase delete exception:", err);
    return false;
  }
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      message: "Supabase não está configurado. As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram detectadas no ambiente do cliente."
    };
  }
  try {
    // Try to perform a query on a default table or get service health
    const { data, error, status } = await supabase
      .from("sc_usuarios")
      .select("id")
      .limit(1);

    if (error) {
      return {
        success: false,
        message: `Conectado ao Supabase, mas a consulta falhou. Código HTTP: ${status}. Erro: ${error.message}. Verifique se a tabela 'sc_usuarios' foi criada no schema 'smartclass'.`,
        details: error
      };
    }

    return {
      success: true,
      message: `Sucesso! Conexão estabelecida com o Supabase (schema 'smartclass'). Tabela 'sc_usuarios' acessível com status HTTP ${status}.`,
      details: data
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Falha crítica ao conectar com o Supabase: ${err?.message || err}`,
      details: err
    };
  }
}

export async function getClasses(): Promise<Class[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("sc_turmas")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching classes from Supabase:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function upsertClass(cls: Class): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_turmas")
      .upsert(cls);
    if (error) console.error("Error upserting class:", error);
    return !error;
  } catch (err) {
    console.error("Exception upserting class:", err);
    return false;
  }
}

export async function getCourses(): Promise<Course[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("sc_cursos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching courses:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function upsertCourse(c: Course): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_cursos")
      .upsert(c);
    if (error) console.error("Error upserting course:", error);
    return !error;
  } catch (err) {
    console.error("Exception upserting course:", err);
    return false;
  }
}

export async function getDisciplines(): Promise<Discipline[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("sc_disciplinas")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching disciplines:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function upsertDiscipline(d: Discipline): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_disciplinas")
      .upsert(d);
    if (error) console.error("Error upserting discipline:", error);
    return !error;
  } catch (err) {
    console.error("Exception upserting discipline:", err);
    return false;
  }
}

export async function getSubjects(): Promise<Subject[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("sc_assuntos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching subjects from Supabase:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function upsertSubject(sub: Subject): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_assuntos")
      .upsert(sub);
    if (error) console.error("Error upserting subject:", error);
    return !error;
  } catch (err) {
    console.error("Exception upserting subject:", err);
    return false;
  }
}

export async function getQuestions(): Promise<Question[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from("sc_questoes").select("*");
    if (error) {
      console.error("Error getting questions:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Supabase exception getting questions:", err);
    return null;
  }
}

export async function upsertQuestion(q: Question): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_questoes")
      .upsert(q);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteQuestionFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_questoes")
      .delete()
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteCourse(id: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_cursos")
      .delete()
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteDiscipline(id: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_disciplinas")
      .delete()
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSubject(id: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_assuntos")
      .delete()
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteClass(id: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_turmas")
      .delete()
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function getRequests(): Promise<EnrollmentRequest[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from("sc_solicitacoes").select("*");
    if (error) {
      console.error("Error getting requests:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Supabase exception getting requests:", err);
    return null;
  }
}

export async function upsertRequest(req: EnrollmentRequest): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_solicitacoes")
      .upsert(req);
    return !error;
  } catch {
    return false;
  }
}

export async function getRedemptionLogs(): Promise<RedemptionLog[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from("sc_resgates").select("*");
    if (error) {
      console.error("Error getting redemption logs:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Supabase exception getting redemption logs:", err);
    return null;
  }
}

export async function insertRedemptionLog(log: RedemptionLog): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_resgates")
      .insert(log);
    return !error;
  } catch {
    return false;
  }
}

export async function getCompletedQuizzes(): Promise<QuizAttempt[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from("sc_checkins_quiz").select("*");
    if (error) {
      console.error("Error getting completed quizzes:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Supabase exception getting completed quizzes:", err);
    return null;
  }
}

export async function insertCompletedQuiz(quiz: QuizAttempt): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from("sc_checkins_quiz")
      .insert(quiz);
    return !error;
  } catch {
    return false;
  }
}
