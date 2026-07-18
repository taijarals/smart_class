import React, { useState } from "react";
import { Subject, Class, Discipline, Course } from "../types";
import { PlusCircle, Edit, BookOpen, Calendar, Save, X, Book, GraduationCap } from "lucide-react";

interface ManageCoursesProps {
  courses: Course[];
  disciplines: Discipline[];
  subjects: Subject[];
  classes: Class[];
  onAddCourse: (c: Omit<Course, "id">) => void;
  onUpdateCourse: (c: Course) => void;
  onAddDiscipline: (d: Omit<Discipline, "id">) => void;
  onUpdateDiscipline: (d: Discipline) => void;
  onAddSubject: (s: Omit<Subject, "id">) => void;
  onUpdateSubject: (s: Subject) => void;
  onAddClass: (c: Omit<Class, "id">) => void;
  onUpdateClass: (c: Class) => void;
  onGoBack: () => void;
}

export default function ManageCourses({ courses, disciplines, subjects, classes, onAddCourse, onUpdateCourse, onAddDiscipline, onUpdateDiscipline, onAddSubject, onUpdateSubject, onAddClass, onUpdateClass, onGoBack }: ManageCoursesProps) {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  
  const [courseForm, setCourseForm] = useState<Partial<Course>>({});
  const [disciplineForm, setDisciplineForm] = useState<Partial<Discipline>>({});
  const [subjectForm, setSubjectForm] = useState<Partial<Subject>>({});
  const [classForm, setClassForm] = useState<Partial<Class>>({});

  const startEditCourse = (c: Course) => {
    setEditingCourse(c);
    setCourseForm(c);
  };

  const saveCourse = () => {
    if (editingCourse) {
      onUpdateCourse({ ...editingCourse, ...courseForm } as Course);
      setEditingCourse(null);
    } else {
      onAddCourse({ nome: courseForm.nome || "Novo Curso" });
    }
    setCourseForm({});
  };

  const startEditDiscipline = (d: Discipline) => {
    setEditingDiscipline(d);
    setDisciplineForm(d);
  };

  const saveDiscipline = () => {
    if (editingDiscipline) {
      onUpdateDiscipline({ ...editingDiscipline, ...disciplineForm } as Discipline);
      setEditingDiscipline(null);
    } else {
      onAddDiscipline({ nome: disciplineForm.nome || "Nova Disciplina" });
    }
    setDisciplineForm({});
  };

  const startEditSubject = (s: Subject) => {
    setEditingSubject(s);
    setSubjectForm(s);
  };

  const saveSubject = () => {
    if (editingSubject) {
      onUpdateSubject({ ...editingSubject, ...subjectForm } as Subject);
      setEditingSubject(null);
    } else {
      onAddSubject({ nome: subjectForm.nome || "Novo Assunto", disciplina_id: subjectForm.disciplina_id || 0, status: subjectForm.status ?? true });
    }
    setSubjectForm({});
  };

  const startEditClass = (c: Class) => {
    setEditingClass(c);
    setClassForm(c);
  };

  const saveClass = () => {
    if (editingClass) {
      onUpdateClass({ ...editingClass, ...classForm } as Class);
      setEditingClass(null);
    } else {
      onAddClass({ 
        titulo: classForm.titulo || "Nova Aula", 
        data_aula: classForm.data_aula || "SET 00", 
        horario: classForm.horario || "00:00", 
        local: classForm.local || "Local", 
        checkin_ativo: classForm.checkin_ativo ?? false 
      });
    }
    setClassForm({});
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={onGoBack} className="text-xs font-bold text-[#0969DA] hover:underline">← Voltar para Dashboard</button>
        <h2 className="text-lg font-bold">Gestão de Cursos e Aulas</h2>
      </div>

      {/* Courses Section */}
      <section className="bg-white p-5 rounded-md border border-[#D0D7DE]">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
          <GraduationCap className="w-4 h-4 text-[#0969DA]" /> Cursos
        </h3>
        {editingCourse ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-2">
            <input value={courseForm.nome || ""} onChange={e => setCourseForm({...courseForm, nome: e.target.value})} className="w-full p-2 text-sm border rounded" placeholder="Nome do curso" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingCourse(null)} className="p-1"><X className="w-4 h-4" /></button>
              <button onClick={saveCourse} className="p-1 text-[#0969DA]"><Save className="w-4 h-4" /></button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {courses.map(c => (
              <div key={c.id} className="flex justify-between items-center p-2 bg-[#F6F8FA] rounded">
                <span>{c.nome}</span>
                <button onClick={() => startEditCourse(c)} className="p-1 hover:bg-gray-200 rounded"><Edit className="w-3.5 h-3.5"/></button>
              </div>
            ))}
            <button onClick={() => { setEditingCourse({id: -1, nome: ""}); setCourseForm({nome: ""}); }} className="w-full text-xs text-[#0969DA] font-bold flex items-center justify-center gap-1 mt-2">
              <PlusCircle className="w-4 h-4" /> Adicionar Curso
            </button>
          </div>
        )}
      </section>

      {/* Disciplines Section */}
      <section className="bg-white p-5 rounded-md border border-[#D0D7DE]">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
          <Book className="w-4 h-4 text-[#0969DA]" /> Disciplinas
        </h3>
        {editingDiscipline ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-2">
            <input value={disciplineForm.nome || ""} onChange={e => setDisciplineForm({...disciplineForm, nome: e.target.value})} className="w-full p-2 text-sm border rounded" placeholder="Nome da disciplina" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingDiscipline(null)} className="p-1"><X className="w-4 h-4" /></button>
              <button onClick={saveDiscipline} className="p-1 text-[#0969DA]"><Save className="w-4 h-4" /></button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {disciplines.map(d => (
              <div key={d.id} className="flex justify-between items-center p-2 bg-[#F6F8FA] rounded">
                <span>{d.nome}</span>
                <button onClick={() => startEditDiscipline(d)} className="p-1 hover:bg-gray-200 rounded"><Edit className="w-3.5 h-3.5"/></button>
              </div>
            ))}
            <button onClick={() => { setEditingDiscipline({id: -1, nome: ""}); setDisciplineForm({nome: ""}); }} className="w-full text-xs text-[#0969DA] font-bold flex items-center justify-center gap-1 mt-2">
              <PlusCircle className="w-4 h-4" /> Adicionar Disciplina
            </button>
          </div>
        )}
      </section>

      {/* Subjects Section */}
      <section className="bg-white p-5 rounded-md border border-[#D0D7DE]">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-[#0969DA]" /> Assuntos (por Disciplina)
        </h3>
        {editingSubject ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-2">
            <input value={subjectForm.nome || ""} onChange={e => setSubjectForm({...subjectForm, nome: e.target.value})} className="w-full p-2 text-sm border rounded" placeholder="Nome do assunto" />
            <select value={subjectForm.disciplina_id || 0} onChange={e => setSubjectForm({...subjectForm, disciplina_id: parseInt(e.target.value)})} className="w-full p-2 text-sm border rounded">
              <option value={0}>Selecione uma disciplina</option>
              {disciplines.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={subjectForm.status ?? true} onChange={e => setSubjectForm({...subjectForm, status: e.target.checked})} />
              Ativo
            </label>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingSubject(null)} className="p-1"><X className="w-4 h-4" /></button>
              <button onClick={saveSubject} className="p-1 text-[#0969DA]"><Save className="w-4 h-4" /></button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {subjects.map(s => {
              const d = disciplines.find(d => d.id === s.disciplina_id);
              return (
                <div key={s.id} className="flex justify-between items-center p-2 bg-[#F6F8FA] rounded">
                  <span>{s.nome} ({d?.nome || 'Sem Disciplina'}) - {s.status ? 'Ativo' : 'Inativo'}</span>
                  <button onClick={() => startEditSubject(s)} className="p-1 hover:bg-gray-200 rounded"><Edit className="w-3.5 h-3.5"/></button>
                </div>
              );
            })}
            <button onClick={() => { setEditingSubject({id: -1, nome: "", disciplina_id: 0, status: true}); setSubjectForm({nome: "", disciplina_id: 0, status: true}); }} className="w-full text-xs text-[#0969DA] font-bold flex items-center justify-center gap-1 mt-2">
              <PlusCircle className="w-4 h-4" /> Adicionar Assunto
            </button>
          </div>
        )}
      </section>

      {/* Classes Section */}
      <section className="bg-white p-5 rounded-md border border-[#D0D7DE]">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#0969DA]" /> Aulas Agendadas
        </h3>
        {editingClass ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-2">
            <input value={classForm.titulo || ""} onChange={e => setClassForm({...classForm, titulo: e.target.value})} className="w-full p-2 text-sm border rounded" placeholder="Título" />
            <input value={classForm.data_aula || ""} onChange={e => setClassForm({...classForm, data_aula: e.target.value})} className="w-full p-2 text-sm border rounded" placeholder="Data (ex: SET 00)" />
            <input value={classForm.horario || ""} onChange={e => setClassForm({...classForm, horario: e.target.value})} className="w-full p-2 text-sm border rounded" placeholder="Horário (ex: 00:00)" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={classForm.checkin_ativo ?? false} onChange={e => setClassForm({...classForm, checkin_ativo: e.target.checked})} />
              Check-in Ativo
            </label>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingClass(null)} className="p-1"><X className="w-4 h-4" /></button>
              <button onClick={saveClass} className="p-1 text-[#0969DA]"><Save className="w-4 h-4" /></button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {classes.map(c => (
              <div key={c.id} className="flex justify-between items-center p-2 bg-[#F6F8FA] rounded">
                <span>{c.titulo} - {c.data_aula} ({c.horario})</span>
                <button onClick={() => startEditClass(c)} className="p-1 hover:bg-gray-200 rounded"><Edit className="w-3.5 h-3.5"/></button>
              </div>
            ))}
            <button onClick={() => { setEditingClass({id: -1, titulo: "", data_aula: "", horario: "", local: "", checkin_ativo: false}); setClassForm({titulo: "", data_aula: "", horario: "", checkin_ativo: false}); }} className="w-full text-xs text-[#0969DA] font-bold flex items-center justify-center gap-1 mt-2">
              <PlusCircle className="w-4 h-4" /> Adicionar Aula
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
