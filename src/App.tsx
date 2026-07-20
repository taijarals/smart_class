/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Home,
  HelpCircle,
  ShoppingCart,
  User,
  Activity,
  Layers,
  Sparkles,
  ClipboardList
} from "lucide-react";

// Types & Initial Mock Data
import { Student, Subject, Class, Question, EnrollmentRequest, ShopItem, RedemptionLog, QuizAttempt, Discipline, Course } from "./types";
import {
  INITIAL_STUDENT,
  INITIAL_SUBJECTS,
  INITIAL_CLASSES,
  INITIAL_ENROLLMENT_REQUESTS,
  INITIAL_SHOP_ITEMS,
  INITIAL_QUESTIONS
} from "./data";

// Supabase integrations
import {
  isSupabaseConfigured,
  getStudent,
  getStudents,
  upsertStudent,
  deleteStudent,
  getClasses,
  upsertClass,
  deleteClass,
  getSubjects,
  upsertSubject,
  deleteSubject,
  getQuestions,
  upsertQuestion,
  deleteQuestionFromSupabase,
  getRequests,
  upsertRequest,
  getRedemptionLogs,
  insertRedemptionLog,
  getCompletedQuizzes,
  insertCompletedQuiz,
  getCourses,
  upsertCourse,
  deleteCourse,
  getDisciplines,
  upsertDiscipline,
  deleteDiscipline,
} from "./lib/supabase";

// Extracted Modular Components
import Header from "./components/Header";
import StudentHome from "./components/StudentHome";
import QuizView from "./components/QuizView";
import StoreView from "./components/StoreView";
import ProfessorDashboard from "./components/ProfessorDashboard";
import AccessManagement from "./components/AccessManagement";
import ManageQuestions from "./components/ManageQuestions";
import { ManageCourses } from "./components/ManageCourses";
import StudentProfile from "./components/StudentProfile";
import LoginView from "./components/LoginView";
import WaitingRoom from "./components/WaitingRoom";

export default function App() {
  // Global States (with localStorage backing)
  const [role, setRole] = useState<"aluno" | "professor">("aluno");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("sc_authenticated") === "true";
  });

  const [student, setStudent] = useState<Student>(() => {
    const saved = localStorage.getItem("sc_student");
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });

  const [classes, setClasses] = useState<Class[]>(() => {
    const saved = localStorage.getItem("sc_classes");
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem("sc_subjects");
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [disciplines, setDisciplines] = useState<Discipline[]>(() => {
    const saved = localStorage.getItem("sc_disciplines");
    return saved ? JSON.parse(saved) : [];
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem("sc_courses");
    return saved ? JSON.parse(saved) : [];
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem("sc_questions");
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [requests, setRequests] = useState<EnrollmentRequest[]>(() => {
    const saved = localStorage.getItem("sc_requests");
    return saved ? JSON.parse(saved) : INITIAL_ENROLLMENT_REQUESTS;
  });

  const [redemptionLogs, setRedemptionLogs] = useState<RedemptionLog[]>(() => {
    const saved = localStorage.getItem("sc_redemptions");
    return saved ? JSON.parse(saved) : [];
  });

  const [completedQuizzes, setCompletedQuizzes] = useState<QuizAttempt[]>(() => {
    const saved = localStorage.getItem("sc_completed_quizzes");
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation states
  const [activeStudentTab, setActiveStudentTab] = useState<"inicio" | "quiz" | "loja" | "perfil">("inicio");
  const [professorScreen, setProfessorScreen] = useState<"dashboard" | "access_management" | "manage_questions" | "manage_courses">("dashboard");
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [usersList, setUsersList] = useState<Student[]>([]);
  const [isAdminViewActive, setIsAdminViewActive] = useState<boolean>(false);

  // Load initial data from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const loadData = async () => {
      try {
        const remoteStudent = await getStudent(student.id);
        if (remoteStudent) {
          setStudent(remoteStudent);
        } else {
          if (student && student.id) {
            await upsertStudent(student);
          }
        }

        const remoteClasses = await getClasses();
        if (remoteClasses && remoteClasses.length > 0) {
          setClasses(remoteClasses);
        } else {
          for (const c of INITIAL_CLASSES) {
            await upsertClass(c);
          }
        }

        const remoteSubjects = await getSubjects();
        if (remoteSubjects && remoteSubjects.length > 0) {
          setSubjects(remoteSubjects);
        } else {
          for (const s of INITIAL_SUBJECTS) {
            await upsertSubject(s);
          }
        }

        const remoteQuestions = await getQuestions();
        if (remoteQuestions && remoteQuestions.length > 0) {
          setQuestions(remoteQuestions);
        } else {
          for (const q of INITIAL_QUESTIONS) {
            await upsertQuestion(q);
          }
        }

        const remoteCourses = await getCourses();
        if (remoteCourses && remoteCourses.length > 0) {
          setCourses(remoteCourses);
        }

        const remoteDisciplines = await getDisciplines();
        if (remoteDisciplines && remoteDisciplines.length > 0) {
          setDisciplines(remoteDisciplines);
        }

        const remoteRequests = await getRequests();
        if (remoteRequests && remoteRequests.length > 0) {
          setRequests(remoteRequests);
        } else {
          for (const r of INITIAL_ENROLLMENT_REQUESTS) {
            await upsertRequest(r);
          }
        }

        const remoteLogs = await getRedemptionLogs();
        if (remoteLogs) setRedemptionLogs(remoteLogs);

        const remoteQuizzes = await getCompletedQuizzes();
        if (remoteQuizzes) setCompletedQuizzes(remoteQuizzes);
      } catch (err) {
        console.error("Failed to load initial data from Supabase:", err);
      }
    };

    loadData();
  }, []);

  // Sync state to local storage on changes
  useEffect(() => {
    localStorage.setItem("sc_student", JSON.stringify(student));
    if (isSupabaseConfigured) {
      upsertStudent(student).catch(err => {
        console.error("Silent sync error for student profile:", err);
      });
    }
  }, [student]);

  useEffect(() => {
    localStorage.setItem("sc_classes", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem("sc_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("sc_questions", JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem("sc_requests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("sc_redemptions", JSON.stringify(redemptionLogs));
  }, [redemptionLogs]);

  useEffect(() => {
    localStorage.setItem("sc_completed_quizzes", JSON.stringify(completedQuizzes));
  }, [completedQuizzes]);

  // Load users list
  useEffect(() => {
    const loadUsers = async () => {
      if (isSupabaseConfigured) {
        try {
          const data = await getStudents();
          if (data) {
            setUsersList(data);
          }
        } catch (err) {
          console.error("Failed to load students for access management:", err);
        }
      } else {
        const localUsersStr = localStorage.getItem("sc_local_registered_users");
        let localUsers: Student[] = [];
        if (localUsersStr) {
          localUsers = JSON.parse(localUsersStr);
        } else {
          localUsers = [
            {
              id: "prof-1",
              matricula: "99999",
              nome: "Dr. Ricardo Veras",
              email: "ricardo.veras@universidade.edu.br",
              usuario: "ricardo",
              senha: "admin123",
              coins_saldo: 0,
              xp: 10000,
              level: 99,
              completed_quizzes_count: 0,
              role: "professor" as const,
              approved: true,
              is_admin: true
            },
            {
              id: "st-1",
              matricula: "20240551-0",
              nome: "Ana Luíza Costa",
              email: "ana.costa@universidade.edu.br",
              usuario: "ana",
              senha: "aluno123",
              coins_saldo: 540,
              xp: 2400,
              level: 8,
              completed_quizzes_count: 12,
              role: "aluno" as const,
              approved: true,
              is_admin: false
            }
          ];
        }

        // Ensure taijara@gmail.com is present
        const hasTaijaraLocal = localUsers.some(u => u.email?.toLowerCase() === "taijara@gmail.com");
        // REMOVED HARDCODED BACKDOOR

        localStorage.setItem("sc_local_registered_users", JSON.stringify(localUsers));
        setUsersList(localUsers);
      }
    };
    loadUsers();
  }, [student]);

  const handleApproveUser = async (userId: string, makeAdmin: boolean) => {
    const updatedList = usersList.map((u) => {
      if (u.id === userId) {
        return { ...u, approved: true, is_admin: makeAdmin };
      }
      return u;
    });
    setUsersList(updatedList);

    if (isSupabaseConfigured) {
      const userToUpdate = updatedList.find((u) => u.id === userId);
      if (userToUpdate) {
        try {
          await upsertStudent(userToUpdate);
        } catch (err) {
          console.error("Failed to approve user in Supabase:", err);
        }
      }
    } else {
      localStorage.setItem("sc_local_registered_users", JSON.stringify(updatedList));
    }

    // If approved user is currently logged in user, update state
    if (userId === student.id) {
      setStudent((prev) => ({ ...prev, approved: true, is_admin: makeAdmin }));
    }
  };

  const handleRejectUser = async (userId: string) => {
    const updatedList = usersList.filter((u) => u.id !== userId);
    setUsersList(updatedList);

    if (isSupabaseConfigured) {
      await deleteStudent(userId);
    } else {
      localStorage.setItem("sc_local_registered_users", JSON.stringify(updatedList));
    }
  };

  const handleUpdateUserInList = async (updatedUser: Student) => {
    const updatedList = usersList.map((u) => u.id === updatedUser.id ? updatedUser : u);
    setUsersList(updatedList);

    if (isSupabaseConfigured) {
      try {
        await upsertStudent(updatedUser);
      } catch (err) {
        console.error("Failed to update user in Supabase:", err);
      }
    } else {
      localStorage.setItem("sc_local_registered_users", JSON.stringify(updatedList));
    }

    if (updatedUser.id === student.id) {
      setStudent(updatedUser);
    }
  };

  // Auth handlers
  const handleLoginSuccess = (userRole: "aluno" | "professor", customStudent?: Student) => {
    setRole(userRole);
    if (customStudent) {
      setStudent(customStudent);
    } else {
      setStudent((prev) => ({ ...prev, role: userRole }));
    }
    setIsAuthenticated(true);
    localStorage.setItem("sc_authenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("sc_authenticated");
    setIsQuizActive(false);
  };

  const handleSubmitEnrollmentRequest = (turmaDescricao: string) => {
    const newRequest: EnrollmentRequest = {
      id: `req-${Date.now()}`,
      aluno_nome: student.nome,
      aluno_matricula: student.matricula,
      turmas_solicitadas: [turmaDescricao],
      status: "PENDENTE"
    };

    setRequests((prev) => {
      const filtered = prev.filter((r) => r.aluno_matricula !== student.matricula);
      const updated = [newRequest, ...filtered];
      localStorage.setItem("sc_requests", JSON.stringify(updated));
      return updated;
    });

    if (isSupabaseConfigured) {
      upsertRequest(newRequest);
    }
  };

  // Handler functions

  // 1. Start Check-in Quiz
  const handleStartQuiz = (classId: number) => {
    // If the student already completed a quiz for this class, prevent duplicate attempts (RN3.2)
    const alreadyDone = completedQuizzes.some((q) => q.aula_id === classId);
    if (alreadyDone) {
      alert("Você já enviou suas respostas e concluiu o check-in para esta aula!");
      return;
    }
    setIsQuizActive(true);
    setActiveStudentTab("quiz");
  };

  // 2. Submit Quiz responses and get rewards (RN5 & RN6)
  const handleFinishQuiz = (correctAnswers: number, coinsEarned: number) => {
    // Award ClassCoins, increment counters, add XP
    setStudent((prev) => ({
      ...prev,
      coins_saldo: prev.coins_saldo + coinsEarned,
      xp: prev.xp + correctAnswers * 100 + 100, // 100 per correct answer, 100 for attendance
      completed_quizzes_count: prev.completed_quizzes_count + 1
    }));

    // Record the check-in attempt
    const activeClass = classes.find((c) => c.checkin_ativo) || classes[0];
    const newQuizAttempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      aluno_id: student.id,
      aula_id: activeClass?.id || 1,
      iniciado_em: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      finalizado_em: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      questoes_sorteadas: questions.slice(0, 5).map((q) => q.id),
      respostas_aluno: {},
      acertos: correctAnswers,
      coins_ganhos: coinsEarned,
      status: "concluido"
    };

    setCompletedQuizzes((prev) => [newQuizAttempt, ...prev]);
    if (isSupabaseConfigured) {
      insertCompletedQuiz(newQuizAttempt);
    }
    setIsQuizActive(false);
    setActiveStudentTab("inicio");
  };

  // 3. Redeem Store Item (RN7)
  const handleRedeemItem = (itemId: string, cost: number, itemTitle: string) => {
    if (student.coins_saldo >= cost) {
      // Deduct coins atomically
      setStudent((prev) => ({
        ...prev,
        coins_saldo: prev.coins_saldo - cost
      }));

      // Log purchase
      const newLog: RedemptionLog = {
        id: `redemption-${Date.now()}`,
        aluno_id: student.id,
        coins_gastos: cost,
        beneficio: itemTitle,
        data_resgate: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      };

      setRedemptionLogs((prev) => [newLog, ...prev]);
      if (isSupabaseConfigured) {
        insertRedemptionLog(newLog);
      }
    } else {
      alert("Saldo de ClassCoins insuficiente!");
    }
  };

  // 4. Professor toggles active check-in call (RN2.1)
  const handleToggleCheckin = (classId: number) => {
    setClasses((prev) => {
      const updated = prev.map((c) => {
        if (c.id === classId) {
          return { ...c, checkin_ativo: !c.checkin_ativo };
        }
        return c;
      });
      if (isSupabaseConfigured) {
        const found = updated.find((c) => c.id === classId);
        if (found) upsertClass(found);
      }
      return updated;
    });
  };

  // 5. Professor toggles subject status (RN1.1)
  const handleToggleSubject = (subId: number) => {
    setSubjects((prev) => {
      const updated = prev.map((s) => {
        if (s.id === subId) {
          return { ...s, status: !s.status };
        }
        return s;
      });
      if (isSupabaseConfigured) {
        const found = updated.find((s) => s.id === subId);
        if (found) upsertSubject(found);
      }
      return updated;
    });
  };

  // 6. Professor approves or declines student solicitudes (Enrollment tab)
  const handleProcessRequest = async (id: string, action: "APROVADO" | "RECUSADO") => {
    setRequests((prev) => {
      const updated = prev.map((r) => {
        if (r.id === id) {
          return { ...r, status: action };
        }
        return r;
      });
      if (isSupabaseConfigured) {
        const found = updated.find((r) => r.id === id);
        if (found) upsertRequest(found);
      }
      return updated;
    });

    if (action === "APROVADO") {
      const req = requests.find((r) => r.id === id);
      if (req) {
        const aluno = usersList.find((u) => u.matricula === req.aluno_matricula);
        if (aluno) {
          await handleApproveUser(aluno.id, false);
        }
      }
    }
  };

  // 7. Add question to active pool (RN1)
  const handleAddQuestion = (newQ: Omit<Question, "id">) => {
    const q: Question = {
      ...newQ,
      id: `q-${Date.now()}`
    };
    setQuestions((prev) => [q, ...prev]);
    if (isSupabaseConfigured) {
      upsertQuestion(q);
    }
  };

  // 8. Toggle question individual activation state (RN1.2)
  const handleToggleQuestionStatus = (qId: string) => {
    setQuestions((prev) => {
      const updated = prev.map((q) => {
        if (q.id === qId) {
          return { ...q, status: !q.status };
        }
        return q;
      });
      if (isSupabaseConfigured) {
        const found = updated.find((q) => q.id === qId);
        if (found) upsertQuestion(found);
      }
      return updated;
    });
  };

  // 9. Delete question from database
  const handleDeleteQuestion = (qId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
    if (isSupabaseConfigured) {
      deleteQuestionFromSupabase(qId);
    }
  };

  const handleDeleteCourse = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    if (isSupabaseConfigured) {
      deleteCourse(id);
    }
  };

  const handleDeleteDiscipline = (id: number) => {
    setDisciplines((prev) => prev.filter((d) => d.id !== id));
    if (isSupabaseConfigured) {
      deleteDiscipline(id);
    }
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    if (isSupabaseConfigured) {
      deleteSubject(id);
    }
  };

  const handleDeleteClass = (id: number) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    if (isSupabaseConfigured) {
      deleteClass(id);
    }
  };

  // Handlers for subject/class management
  const handleUpsertSubject = (s: Subject) => {
    setSubjects(prev => {
      const idx = prev.findIndex(item => item.id === s.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = s;
        return next;
      }
      return [...prev, s];
    });
    if (isSupabaseConfigured) upsertSubject(s);
  };

  const handleUpsertDiscipline = (d: Discipline) => {
    setDisciplines(prev => {
      const idx = prev.findIndex(item => item.id === d.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = d;
        return next;
      }
      return [...prev, d];
    });
    if (isSupabaseConfigured) upsertDiscipline(d);
  };

  const handleUpsertCourse = (c: Course) => {
    setCourses(prev => {
      const idx = prev.findIndex(item => item.id === c.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = c;
        return next;
      }
      return [...prev, c];
    });
    if (isSupabaseConfigured) {
      upsertCourse(c).then(success => {
        if (!success) console.error("Failed to save course");
      });
    }
  };

  const handleUpsertClass = (c: Class) => {
    setClasses(prev => {
      const idx = prev.findIndex(item => item.id === c.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = c;
        return next;
      }
      return [...prev, c];
    });
    if (isSupabaseConfigured) upsertClass(c);
  };


  // Compute page headers for student vs professor dashboards
  const getCurrentScreenTitle = () => {
    if (isAdminViewActive) {
      return "Gestão de Acessos";
    }
    if (role === "professor") {
      switch (professorScreen) {
        case "access_management":
          return "Gestão de Acessos";
        case "manage_questions":
          return "Banco de Questões Inteligente";
        case "dashboard":
        default:
          return "Painel do Docente";
      }
    } else {
      switch (activeStudentTab) {
        case "quiz":
          return "Mini-Prova Check-In";
        case "loja":
          return "Smart Store";
        case "perfil":
          return "Perfil do Aluno";
        case "inicio":
        default:
          return "Portal Acadêmico";
      }
    }
  };

  // Garante que alunos fiquem restritos ao papel de aluno, sem poder chavear para professor (RN de Fluxo de Papéis)
  useEffect(() => {
    if (student && student.role === "aluno" && role !== "aluno") {
      setRole("aluno");
    }
  }, [student, role]);

  // Filtragem dos dados de acordo com o papel e autoria (RN de Gestão Restrita para Professores)
  const dashboardClasses = student.is_admin 
    ? classes 
    : classes.filter((c) => !c.criado_por || c.criado_por === student.id);

  const dashboardSubjects = student.is_admin 
    ? subjects 
    : subjects.filter((s) => !s.criado_por || s.criado_por === student.id);

  // No ManageQuestions, filtramos os assuntos criados por ele e as questões que pertencem a estes assuntos
  const questionsSubjects = student.is_admin 
    ? subjects 
    : subjects.filter((s) => !s.criado_por || s.criado_por === student.id);
  const questionsSubjectsIds = questionsSubjects.map((s) => s.id);
  const questionsList = student.is_admin 
    ? questions 
    : questions.filter((q) => questionsSubjectsIds.includes(q.assunto_id));

  // Filtragem de solicitações de matrícula para professores (apenas as turmas criadas por ele) ou tudo se admin
  const allowedRequests = student.is_admin
    ? requests
    : requests.filter((r) => {
        const firstTurma = r.turmas_solicitadas?.[0];
        if (!firstTurma) return false;
        const match = firstTurma.match(/Turma #(\d+)/);
        if (!match) return false;
        const classId = Number(match[1]);
        const cls = classes.find((c) => c.id === classId);
        return cls && cls.criado_por === student.id;
      });

  // Restrict questions pool dynamically to active subjects and questions (RN3)
  const activeSubjectsIds = subjects.filter((s) => s.status).map((s) => s.id);
  const eligibleQuestions = questions.filter(
    (q) => q.status && activeSubjectsIds.includes(q.assunto_id)
  );

  if (!isAuthenticated) {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        currentStudent={student}
      />
    );
  }

  if (role === "aluno" && !student.approved) {
    return (
      <WaitingRoom
        courses={courses}
        disciplines={disciplines}
        classes={classes}
        student={student}
        requests={requests}
        onSubmitRequest={handleSubmitEnrollmentRequest}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen font-sans antialiased pb-24">
      {/* Dynamic Global Header */}
      <Header
        role={role}
        setRole={(r) => {
          setRole(r);
          setIsQuizActive(false); // Reset active quizzes on role swap
          setIsAdminViewActive(false); // Reset admin view on role swap
        }}
        student={student}
        currentScreenTitle={getCurrentScreenTitle()}
        onLogout={handleLogout}
        onClickProfile={() => {
          setIsQuizActive(false);
          setIsAdminViewActive(false);
          setActiveStudentTab("perfil");
        }}
        onClickCoins={() => {
          setIsQuizActive(false);
          setIsAdminViewActive(false);
          setActiveStudentTab("loja");
        }}
        onClickAccessManagement={() => {
          setIsAdminViewActive(!isAdminViewActive);
        }}
      />

      {/* Main Container Viewport */}
      <main className="pt-24 px-4 md:px-8 max-w-7xl mx-auto">
        {isAdminViewActive ? (
          <AccessManagement
            requests={allowedRequests}
            onProcessRequest={handleProcessRequest}
            onGoBack={() => setIsAdminViewActive(false)}
            usersList={usersList}
            onApproveUser={handleApproveUser}
            onRejectUser={handleRejectUser}
            onUpdateUser={handleUpdateUserInList}
            student={student}
          />
        ) : role === "professor" ? (
          /* Professor View Interface Routing */
          <div>
            {professorScreen === "dashboard" && (
              <ProfessorDashboard
                classes={dashboardClasses}
                subjects={dashboardSubjects}
                onToggleCheckin={handleToggleCheckin}
                onToggleSubject={handleToggleSubject}
                onChangeScreen={(scr) => {
                  if (scr === "access_management") {
                    setIsAdminViewActive(true);
                  } else {
                    setProfessorScreen(scr as any);
                  }
                }}
                studentRequestsCount={allowedRequests.filter((r) => r.status === "PENDENTE").length}
                student={student}
              />
            )}

            {professorScreen === "manage_questions" && (
              <ManageQuestions
                questions={questionsList}
                subjects={questionsSubjects}
                onAddQuestion={handleAddQuestion}
                onToggleQuestionStatus={handleToggleQuestionStatus}
                onDeleteQuestion={handleDeleteQuestion}
                onGoBack={() => setProfessorScreen("dashboard")}
              />
            )}

            {professorScreen === "manage_courses" && (
              <ManageCourses
                courses={courses}
                disciplines={disciplines}
                subjects={subjects}
                classes={classes}
                onAddCourse={(c) => handleUpsertCourse({ ...c, id: Math.floor(Date.now() / 1000) })}
                onUpdateCourse={handleUpsertCourse}
                onDeleteCourse={handleDeleteCourse}
                onAddDiscipline={(d) => handleUpsertDiscipline({ ...d, id: Math.floor(Date.now() / 1000) })}
                onUpdateDiscipline={handleUpsertDiscipline}
                onDeleteDiscipline={handleDeleteDiscipline}
                onAddSubject={(s) => handleUpsertSubject({ ...s, id: Math.floor(Date.now() / 1000) })}
                onUpdateSubject={handleUpsertSubject}
                onDeleteSubject={handleDeleteSubject}
                onAddClass={(c) => handleUpsertClass({ ...c, id: Math.floor(Date.now() / 1000) })}
                onUpdateClass={handleUpsertClass}
                onDeleteClass={handleDeleteClass}
                onGoBack={() => setProfessorScreen("dashboard")}
                student={student}
              />
            )}
          </div>
        ) : (
          /* Student View Interface Routing */
          <div>
            {activeStudentTab === "inicio" && (
              <StudentHome
                student={student}
                classes={classes}
                onStartQuiz={handleStartQuiz}
                onGoToProfile={() => setActiveStudentTab("perfil")}
              />
            )}

            {activeStudentTab === "quiz" && (
              <div>
                {isQuizActive ? (
                  <QuizView
                    student={student}
                    questions={eligibleQuestions.length >= 5 ? eligibleQuestions.slice(0, 5) : questions.slice(0, 5)}
                    onFinishQuiz={handleFinishQuiz}
                    onCloseQuiz={() => {
                      setIsQuizActive(false);
                      setActiveStudentTab("inicio");
                    }}
                  />
                ) : (
                  /* Quiz waiting area if no active quiz trigger is engaged */
                  <div className="max-w-md mx-auto bg-white border border-[#E2E8F0] p-6 rounded-2xl text-center shadow-md space-y-4">
                    <HelpCircle className="w-12 h-12 text-blue-500 mx-auto" />
                    <h3 className="font-display font-extrabold text-base text-gray-800">Check-In Chamada Gamificada</h3>
                    <p className="font-sans text-xs text-gray-500 leading-normal">
                      A mini-prova está pronta! Inicie pelo card principal da página inicial ou aguarde a instrução do docente em sala de aula para abrir a prova.
                    </p>
                    <button
                      onClick={() => {
                        const activeC = classes.find((c) => c.checkin_ativo) || classes[0];
                        handleStartQuiz(activeC?.id || 101);
                      }}
                      className="w-full bg-[#712ae2] text-white hover:bg-[#8a4cfc] py-2.5 rounded-xl font-display font-bold text-xs tracking-wider transition-all tactile-btn"
                    >
                      Forçar Início de Quiz para Teste
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeStudentTab === "loja" && (
              <StoreView
                student={student}
                shopItems={INITIAL_SHOP_ITEMS}
                onRedeem={handleRedeemItem}
              />
            )}

            {activeStudentTab === "perfil" && (
              <StudentProfile
                student={student}
                redemptionLogs={redemptionLogs}
                completedQuizzes={completedQuizzes}
                classes={classes}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Interactive Bottom Tab Navigation (Only visible for Student Role) */}
      {role === "aluno" && (
        <nav className="fixed bottom-0 left-0 right-0 h-18 bg-white border-t border-[#E2E8F0] z-50 flex justify-around items-center px-6 shadow-lg rounded-t-2xl max-w-lg mx-auto sm:border-x">
          {/* Home Tab */}
          <button
            onClick={() => {
              setIsQuizActive(false);
              setActiveStudentTab("inicio");
            }}
            className={`flex flex-col items-center justify-center transition-all ${
              activeStudentTab === "inicio"
                ? "text-[#0969DA] scale-105 font-bold"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase tracking-wider mt-1">Início</span>
          </button>

          {/* Quiz Tab */}
          <button
            onClick={() => {
              setActiveStudentTab("quiz");
            }}
            className={`flex flex-col items-center justify-center transition-all ${
              activeStudentTab === "quiz"
                ? "text-[#0969DA] scale-105 font-bold"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase tracking-wider mt-1">Quiz</span>
          </button>

          {/* Store Tab */}
          <button
            onClick={() => {
              setIsQuizActive(false);
              setActiveStudentTab("loja");
            }}
            className={`flex flex-col items-center justify-center transition-all ${
              activeStudentTab === "loja"
                ? "text-[#0969DA] scale-105 font-bold"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase tracking-wider mt-1">Loja</span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => {
              setIsQuizActive(false);
              setActiveStudentTab("perfil");
            }}
            className={`flex flex-col items-center justify-center transition-all ${
              activeStudentTab === "perfil"
                ? "text-[#0969DA] scale-105 font-bold"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase tracking-wider mt-1">Perfil</span>
          </button>
        </nav>
      )}
    </div>
  );
}
