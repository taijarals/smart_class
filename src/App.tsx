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
  getSubjects,
  upsertSubject,
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
  getDisciplines,
  upsertDiscipline
} from "./lib/supabase";

// Extracted Modular Components
import Header from "./components/Header";
import StudentHome from "./components/StudentHome";
import QuizView from "./components/QuizView";
import StoreView from "./components/StoreView";
import ProfessorDashboard from "./components/ProfessorDashboard";
import AccessManagement from "./components/AccessManagement";
import ManageQuestions from "./components/ManageQuestions";
import ManageCourses from "./components/ManageCourses";
import StudentProfile from "./components/StudentProfile";
import LoginView from "./components/LoginView";

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
        if (!hasTaijaraLocal) {
          localUsers.push({
            id: "usr-admin-taijara",
            matricula: "000000-1",
            nome: "Taijara Admin",
            email: "taijara@gmail.com",
            usuario: "taijara",
            senha: "admin123",
            coins_saldo: 0,
            xp: 10000,
            level: 99,
            completed_quizzes_count: 0,
            role: "professor" as const,
            approved: true,
            is_admin: true
          });
        }

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
  const handleProcessRequest = (id: string, action: "APROVADO" | "RECUSADO") => {
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
    if (isSupabaseConfigured) upsertCourse(c);
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
        {isAdminViewActive && student.is_admin ? (
          <AccessManagement
            requests={requests}
            onProcessRequest={handleProcessRequest}
            onGoBack={() => setIsAdminViewActive(false)}
            usersList={usersList}
            onApproveUser={handleApproveUser}
            onRejectUser={handleRejectUser}
          />
        ) : role === "professor" ? (
          /* Professor View Interface Routing */
          <div>
            {professorScreen === "dashboard" && (
              <ProfessorDashboard
                classes={classes}
                subjects={subjects}
                onToggleCheckin={handleToggleCheckin}
                onToggleSubject={handleToggleSubject}
                onChangeScreen={(scr) => {
                  if (scr === "access_management") {
                    setIsAdminViewActive(true);
                  } else {
                    setProfessorScreen(scr as any);
                  }
                }}
                studentRequestsCount={requests.filter((r) => r.status === "PENDENTE").length}
                student={student}
              />
            )}

            {professorScreen === "manage_questions" && (
              <ManageQuestions
                questions={questions}
                subjects={subjects}
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
                onAddCourse={(c) => handleUpsertCourse({ ...c, id: Date.now() })}
                onUpdateCourse={handleUpsertCourse}
                onAddDiscipline={(d) => handleUpsertDiscipline({ ...d, id: Date.now() })}
                onUpdateDiscipline={handleUpsertDiscipline}
                onAddSubject={(s) => handleUpsertSubject({ ...s, id: Date.now() })}
                onUpdateSubject={handleUpsertSubject}
                onAddClass={(c) => handleUpsertClass({ ...c, id: Date.now() })}
                onUpdateClass={handleUpsertClass}
                onGoBack={() => setProfessorScreen("dashboard")}
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
