import React, { useState } from "react";
import { PlusCircle, Edit, Save, X, Book, BookOpen, Calendar, GraduationCap } from "lucide-react";
import { Subject, Class, Discipline, Course, Student } from "../types";

interface ManageCoursesProps {
  courses: Course[];
  disciplines: Discipline[];
  subjects: Subject[];
  classes: Class[];
  onAddCourse: (c: Omit<Course, "id">) => void;
  onUpdateCourse: (c: Course) => void;
  onDeleteCourse: (id: number) => void;
  onAddDiscipline: (c: Omit<Discipline, "id">) => void;
  onUpdateDiscipline: (c: Discipline) => void;
  onDeleteDiscipline: (id: number) => void;
  onAddSubject: (s: Omit<Subject, "id">) => void;
  onUpdateSubject: (s: Subject) => void;
  onDeleteSubject: (id: number) => void;
  onAddClass: (c: Omit<Class, "id">) => void;
  onUpdateClass: (c: Class) => void;
  onDeleteClass: (id: number) => void;
  onGoBack: () => void;
  student: Student;
}

type TabType = "cursos" | "disciplinas" | "assuntos" | "turmas";

export const ManageCourses: React.FC<ManageCoursesProps> = ({
  courses, disciplines, subjects, classes,
  onAddCourse, onUpdateCourse, onDeleteCourse,
  onAddDiscipline, onUpdateDiscipline, onDeleteDiscipline,
  onAddSubject, onUpdateSubject, onDeleteSubject,
  onAddClass, onUpdateClass, onDeleteClass, onGoBack,
  student
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("cursos");

  // Local state for editing forms
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState<Partial<Course>>({});

  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null);
  const [disciplineForm, setDisciplineForm] = useState<Partial<Discipline>>({});

  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectForm, setSubjectForm] = useState<Partial<Subject>>({});

  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [classForm, setClassForm] = useState<Partial<Class>>({});

  // Handlers for Course
  const startEditCourse = (c: Course) => {
    setEditingCourse(c);
    setCourseForm(c);
  };
  const saveCourse = () => {
    if (editingCourse && editingCourse.id !== -1) {
      onUpdateCourse({ ...editingCourse, ...courseForm } as Course);
    } else {
      onAddCourse({ nome: courseForm.nome || "Novo Curso" });
    }
    setEditingCourse(null);
    setCourseForm({});
  };

  // Handlers for Discipline
  const startEditDiscipline = (d: Discipline) => {
    setEditingDiscipline(d);
    setDisciplineForm(d);
  };
  const saveDiscipline = () => {
    if (editingDiscipline && editingDiscipline.id !== -1) {
      onUpdateDiscipline({ ...editingDiscipline, ...disciplineForm } as Discipline);
    } else {
      onAddDiscipline({ 
        nome: disciplineForm.nome || "Nova Disciplina",
        curso_id: disciplineForm.curso_id || 0
      });
    }
    setEditingDiscipline(null);
    setDisciplineForm({});
  };

  // Handlers for Subject
  const startEditSubject = (s: Subject) => {
    setEditingSubject(s);
    setSubjectForm(s);
  };
  const saveSubject = () => {
    if (editingSubject && editingSubject.id !== -1) {
      onUpdateSubject({ ...editingSubject, ...subjectForm } as Subject);
    } else {
      onAddSubject({ 
        nome: subjectForm.nome || "Novo Assunto", 
        disciplina_id: subjectForm.disciplina_id || 0, 
        status: subjectForm.status ?? true,
        criado_por: student.id // Vincula o assunto ao ID do professor criador (RN de Gestão Restrita)
      });
    }
    setEditingSubject(null);
    setSubjectForm({});
  };

  // Handlers for Class (Turma)
  const startEditClass = (c: Class) => {
    setEditingClass(c);
    setClassForm(c);
  };
  const saveClass = () => {
    if (editingClass && editingClass.id !== -1) {
      onUpdateClass({ ...editingClass, ...classForm } as Class);
    } else {
      onAddClass({ 
        curso_id: classForm.curso_id || 0,
        disciplina_id: classForm.disciplina_id || 0,
        ano: classForm.ano || new Date().getFullYear(),
        periodo: classForm.periodo || "1º semestre",
        dia_da_semana: classForm.dia_da_semana || "Segunda-feira",
        horario: classForm.horario || "08:00 - 10:00",
        checkin_ativo: classForm.checkin_ativo ?? false,
        criado_por: student.id // Vincula a turma ao ID do professor criador (RN de Gestão Restrita)
      });
    }
    setEditingClass(null);
    setClassForm({});
  };

  // Filtrar assuntos e turmas para exibir apenas os criados por este professor se ele não for administrador
  const visibleSubjects = student.is_admin 
    ? subjects 
    : subjects.filter(s => !s.criado_por || s.criado_por === student.id);

  const visibleClasses = student.is_admin 
    ? classes 
    : classes.filter(c => !c.criado_por || c.criado_por === student.id);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-md border border-[#D0D7DE]">
        <h2 className="text-base font-bold text-[#24292F]">Gestão de Cursos e Turmas</h2>
        <button onClick={onGoBack} className="text-sm font-bold text-[#0969DA] hover:underline">
          Voltar ao Dashboard
        </button>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex bg-white rounded-md border border-[#D0D7DE] overflow-hidden">
        {(["cursos", "disciplinas", "assuntos", "turmas"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              // reset forms when switching tabs
              setEditingCourse(null);
              setEditingDiscipline(null);
              setEditingSubject(null);
              setEditingClass(null);
            }}
            className={`flex-1 p-3 text-sm font-bold capitalize border-b-2 transition-colors ${
              activeTab === tab 
                ? "border-[#0969DA] text-[#0969DA] bg-blue-50/50" 
                : "border-transparent text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cursos Tab */}
      {activeTab === "cursos" && (
        <section className="bg-white p-5 rounded-md border border-[#D0D7DE]">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 text-[#0969DA]" /> Cursos
          </h3>
          {!student.is_admin && (
            <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-md">
              Apenas Administradores do sistema podem criar, editar ou excluir Cursos.
            </div>
          )}
          {editingCourse ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-2">
              <input 
                value={courseForm.nome || ""} 
                onChange={e => setCourseForm({...courseForm, nome: e.target.value})} 
                className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-[#0969DA] outline-none" 
                placeholder="Nome do curso" 
                disabled={!student.is_admin}
              />
              <div className="flex justify-between gap-2">
                {editingCourse.id !== -1 && student.is_admin ? (
                  <button onClick={() => { onDeleteCourse(editingCourse.id); setEditingCourse(null); }} className="p-1 text-red-600 hover:bg-red-50 rounded font-medium text-sm px-2">Deletar</button>
                ) : <div/>}
                <div className="flex gap-2">
                  <button onClick={() => setEditingCourse(null)} className="p-1 text-gray-500 hover:bg-gray-200 rounded"><X className="w-4 h-4" /></button>
                  {student.is_admin && (
                    <button onClick={saveCourse} className="flex items-center gap-1 px-3 py-1 bg-[#0969DA] text-white rounded font-bold text-xs hover:bg-blue-700"><Save className="w-4 h-4" /> Salvar</button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {courses.map(c => (
                <div key={c.id} className="flex justify-between items-center p-3 bg-[#F6F8FA] rounded border border-transparent hover:border-gray-200">
                  <span className="font-medium text-sm text-gray-800">{c.nome}</span>
                  {student.is_admin && (
                    <button onClick={() => startEditCourse(c)} className="p-1.5 hover:bg-white border shadow-sm rounded text-gray-600"><Edit className="w-3.5 h-3.5"/></button>
                  )}
                </div>
              ))}
              {courses.length === 0 && <p className="text-sm text-gray-500 italic p-2">Nenhum curso cadastrado.</p>}
              {student.is_admin && (
                <button onClick={() => { setEditingCourse({id: -1, nome: ""}); setCourseForm({nome: ""}); }} className="w-full text-xs text-[#0969DA] font-bold flex items-center justify-center gap-1 mt-4 p-2 border border-dashed border-blue-300 rounded hover:bg-blue-50">
                  <PlusCircle className="w-4 h-4" /> Adicionar Curso
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* Disciplinas Tab */}
      {activeTab === "disciplinas" && (
        <section className="bg-white p-5 rounded-md border border-[#D0D7DE]">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <Book className="w-4 h-4 text-[#0969DA]" /> Disciplinas
          </h3>
          {!student.is_admin && (
            <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-md">
              Apenas Administradores do sistema podem criar, editar ou excluir Disciplinas.
            </div>
          )}
          {editingDiscipline ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Nome da Disciplina</label>
                <input 
                  value={disciplineForm.nome || ""} 
                  onChange={e => setDisciplineForm({...disciplineForm, nome: e.target.value})} 
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-[#0969DA] outline-none" 
                  placeholder="Nome da disciplina" 
                  disabled={!student.is_admin}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Curso Vinculado</label>
                <select 
                  value={disciplineForm.curso_id || 0} 
                  onChange={e => setDisciplineForm({...disciplineForm, curso_id: parseInt(e.target.value)})} 
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-[#0969DA] outline-none"
                  disabled={!student.is_admin}
                >
                  <option value={0}>Selecione um curso</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div className="flex justify-between gap-2 pt-2 border-t border-blue-100">
                {editingDiscipline.id !== -1 && student.is_admin ? (
                  <button onClick={() => { onDeleteDiscipline(editingDiscipline.id); setEditingDiscipline(null); }} className="p-1 text-red-600 hover:bg-red-50 rounded font-medium text-sm px-2">Deletar</button>
                ) : <div/>}
                <div className="flex gap-2">
                  <button onClick={() => setEditingDiscipline(null)} className="p-1 text-gray-500 hover:bg-gray-200 rounded"><X className="w-4 h-4" /></button>
                  {student.is_admin && (
                    <button onClick={saveDiscipline} className="flex items-center gap-1 px-3 py-1 bg-[#0969DA] text-white rounded font-bold text-xs hover:bg-blue-700"><Save className="w-4 h-4" /> Salvar</button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {disciplines.map(d => {
                const c = courses.find(c => c.id === d.curso_id);
                return (
                  <div key={d.id} className="flex justify-between items-center p-3 bg-[#F6F8FA] rounded border border-transparent hover:border-gray-200">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-800">{d.nome}</span>
                      <span className="text-xs text-gray-500">{c ? c.nome : 'Sem Curso Vinculado'}</span>
                    </div>
                    {student.is_admin && (
                      <button onClick={() => startEditDiscipline(d)} className="p-1.5 hover:bg-white border shadow-sm rounded text-gray-600"><Edit className="w-3.5 h-3.5"/></button>
                    )}
                  </div>
                );
              })}
              {disciplines.length === 0 && <p className="text-sm text-gray-500 italic p-2">Nenhuma disciplina cadastrada.</p>}
              {student.is_admin && (
                <button onClick={() => { setEditingDiscipline({id: -1, nome: "", curso_id: 0}); setDisciplineForm({nome: "", curso_id: 0}); }} className="w-full text-xs text-[#0969DA] font-bold flex items-center justify-center gap-1 mt-4 p-2 border border-dashed border-blue-300 rounded hover:bg-blue-50">
                  <PlusCircle className="w-4 h-4" /> Adicionar Disciplina
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* Assuntos Tab */}
      {activeTab === "assuntos" && (
        <section className="bg-white p-5 rounded-md border border-[#D0D7DE]">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[#0969DA]" /> Assuntos (por Disciplina)
          </h3>
          {!student.is_admin && (
            <div className="mb-4 p-2.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-md">
              Você está visualizando apenas os Assuntos que criou.
            </div>
          )}
          {editingSubject ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Nome do Assunto</label>
                <input 
                  value={subjectForm.nome || ""} 
                  onChange={e => setSubjectForm({...subjectForm, nome: e.target.value})} 
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-[#0969DA] outline-none" 
                  placeholder="Nome do assunto" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Disciplina Vinculada</label>
                <select 
                  value={subjectForm.disciplina_id || 0} 
                  onChange={e => setSubjectForm({...subjectForm, disciplina_id: parseInt(e.target.value)})} 
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-[#0969DA] outline-none"
                >
                  <option value={0}>Selecione uma disciplina</option>
                  {disciplines.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input type="checkbox" checked={subjectForm.status ?? true} onChange={e => setSubjectForm({...subjectForm, status: e.target.checked})} className="rounded text-[#0969DA] focus:ring-[#0969DA]" />
                Ativo para Quizzes
              </label>
              <div className="flex justify-between gap-2 pt-2 border-t border-blue-100">
                {editingSubject.id !== -1 ? (
                  <button onClick={() => { onDeleteSubject(editingSubject.id); setEditingSubject(null); }} className="p-1 text-red-600 hover:bg-red-50 rounded font-medium text-sm px-2">Deletar</button>
                ) : <div/>}
                <div className="flex gap-2">
                  <button onClick={() => setEditingSubject(null)} className="p-1 text-gray-500 hover:bg-gray-200 rounded"><X className="w-4 h-4" /></button>
                  <button onClick={saveSubject} className="flex items-center gap-1 px-3 py-1 bg-[#0969DA] text-white rounded font-bold text-xs hover:bg-blue-700"><Save className="w-4 h-4" /> Salvar</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {visibleSubjects.map(s => {
                const d = disciplines.find(d => d.id === s.disciplina_id);
                return (
                  <div key={s.id} className="flex justify-between items-center p-3 bg-[#F6F8FA] rounded border border-transparent hover:border-gray-200">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-800">{s.nome}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500">{d?.nome || 'Sem Disciplina'}</span>
                        <span>&bull;</span>
                        <span className={s.status ? 'text-green-600' : 'text-gray-400'}>{s.status ? 'Ativo' : 'Inativo'}</span>
                      </div>
                    </div>
                    <button onClick={() => startEditSubject(s)} className="p-1.5 hover:bg-white border shadow-sm rounded text-gray-600"><Edit className="w-3.5 h-3.5"/></button>
                  </div>
                );
              })}
              {visibleSubjects.length === 0 && <p className="text-sm text-gray-500 italic p-2">Nenhum assunto cadastrado por você.</p>}
              <button onClick={() => { setEditingSubject({id: -1, nome: "", disciplina_id: 0, status: true}); setSubjectForm({nome: "", disciplina_id: 0, status: true}); }} className="w-full text-xs text-[#0969DA] font-bold flex items-center justify-center gap-1 mt-4 p-2 border border-dashed border-blue-300 rounded hover:bg-blue-50">
                <PlusCircle className="w-4 h-4" /> Adicionar Assunto
              </button>
            </div>
          )}
        </section>
      )}

      {/* Turmas Tab */}
      {activeTab === "turmas" && (
        <section className="bg-white p-5 rounded-md border border-[#D0D7DE]">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[#0969DA]" /> Turmas
          </h3>
          {!student.is_admin && (
            <div className="mb-4 p-2.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-md">
              Você está visualizando apenas as Turmas que criou.
            </div>
          )}
          {editingClass ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-3">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Curso</label>
                  <select 
                    value={classForm.curso_id || 0} 
                    onChange={e => setClassForm({...classForm, curso_id: parseInt(e.target.value)})} 
                    className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-[#0969DA] outline-none"
                  >
                    <option value={0}>Selecione um curso</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Disciplina</label>
                  <select 
                    value={classForm.disciplina_id || 0} 
                    onChange={e => setClassForm({...classForm, disciplina_id: parseInt(e.target.value)})} 
                    className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-[#0969DA] outline-none"
                  >
                    <option value={0}>Selecione uma disciplina</option>
                    {disciplines
                      .filter(d => d.curso_id === classForm.curso_id || !classForm.curso_id)
                      .map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                  </select>
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Ano</label>
                  <input 
                    type="number"
                    value={classForm.ano || ""} 
                    onChange={e => setClassForm({...classForm, ano: parseInt(e.target.value)})} 
                    className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-[#0969DA] outline-none" 
                    placeholder="ex: 2024" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Período</label>
                  <select 
                    value={classForm.periodo || "1º semestre"} 
                    onChange={e => setClassForm({...classForm, periodo: e.target.value})} 
                    className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-[#0969DA] outline-none"
                  >
                    <option value="1º semestre">1º Semestre</option>
                    <option value="2º semestre">2º Semestre</option>
                    <option value="1º trimestre">1º Trimestre</option>
                    <option value="2º trimestre">2º Trimestre</option>
                    <option value="3º trimestre">3º Trimestre</option>
                    <option value="4º trimestre">4º Trimestre</option>
                  </select>
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Dia da Semana</label>
                  <select 
                    value={classForm.dia_da_semana || "Segunda-feira"} 
                    onChange={e => setClassForm({...classForm, dia_da_semana: e.target.value})} 
                    className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-[#0969DA] outline-none"
                  >
                    <option value="Segunda-feira">Segunda-feira</option>
                    <option value="Terça-feira">Terça-feira</option>
                    <option value="Quarta-feira">Quarta-feira</option>
                    <option value="Quinta-feira">Quinta-feira</option>
                    <option value="Sexta-feira">Sexta-feira</option>
                    <option value="Sábado">Sábado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Horário</label>
                  <input 
                    value={classForm.horario || ""} 
                    onChange={e => setClassForm({...classForm, horario: e.target.value})} 
                    className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-[#0969DA] outline-none" 
                    placeholder="ex: 08:00 - 10:00" 
                  />
                </div>
              </div>
 
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input type="checkbox" checked={classForm.checkin_ativo ?? false} onChange={e => setClassForm({...classForm, checkin_ativo: e.target.checked})} className="rounded text-[#0969DA] focus:ring-[#0969DA]" />
                Check-in Ativo
              </label>
 
              <div className="flex justify-between gap-2 pt-2 border-t border-blue-100">
                {editingClass.id !== -1 ? (
                  <button onClick={() => { onDeleteClass(editingClass.id); setEditingClass(null); }} className="p-1 text-red-600 hover:bg-red-50 rounded font-medium text-sm px-2">Deletar</button>
                ) : <div/>}
                <div className="flex gap-2">
                  <button onClick={() => setEditingClass(null)} className="p-1 text-gray-500 hover:bg-gray-200 rounded"><X className="w-4 h-4" /></button>
                  <button onClick={saveClass} className="flex items-center gap-1 px-3 py-1 bg-[#0969DA] text-white rounded font-bold text-xs hover:bg-blue-700"><Save className="w-4 h-4" /> Salvar</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {visibleClasses.map(c => {
                const curso = courses.find(cr => cr.id === c.curso_id);
                const disciplina = disciplines.find(d => d.id === c.disciplina_id);
                
                return (
                  <div key={c.id} className="flex justify-between items-start p-3 bg-[#F6F8FA] rounded border border-transparent hover:border-gray-200">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-800">
                        {disciplina?.nome || 'S/ Disciplina'} - {c.ano} ({c.periodo})
                      </span>
                      <span className="text-xs text-gray-600 mt-0.5">
                        {curso?.nome || 'S/ Curso'}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{c.dia_da_semana}</span>
                        <span>&bull;</span>
                        <span>{c.horario}</span>
                        <span>&bull;</span>
                        <span className={c.checkin_ativo ? 'text-green-600 font-bold' : 'text-gray-400'}>
                          {c.checkin_ativo ? 'Check-in Aberto' : 'Check-in Fechado'}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => startEditClass(c)} className="p-1.5 hover:bg-white border shadow-sm rounded text-gray-600 mt-1"><Edit className="w-3.5 h-3.5"/></button>
                  </div>
                );
              })}
              {visibleClasses.length === 0 && <p className="text-sm text-gray-500 italic p-2">Nenhuma turma cadastrada por você.</p>}
              <button onClick={() => { setEditingClass({id: -1, curso_id: 0, disciplina_id: 0, ano: new Date().getFullYear(), periodo: "1º semestre", dia_da_semana: "Segunda-feira", horario: "", checkin_ativo: false}); setClassForm({curso_id: 0, disciplina_id: 0, ano: new Date().getFullYear(), periodo: "1º semestre", dia_da_semana: "Segunda-feira", horario: "", checkin_ativo: false}); }} className="w-full text-xs text-[#0969DA] font-bold flex items-center justify-center gap-1 mt-4 p-2 border border-dashed border-blue-300 rounded hover:bg-blue-50">
                <PlusCircle className="w-4 h-4" /> Adicionar Turma
              </button>
            </div>
          )}
        </section>
      )}

    </div>
  );
};
