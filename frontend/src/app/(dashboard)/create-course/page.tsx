'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/hooks/useCourses';
import { coursesApi } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  BookOpen, Info, List, Settings, ChevronRight, ChevronLeft,
  Upload, Plus, Trash2, Globe, Lock, CheckCircle2,
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Información básica', icon: <Info size={16} /> },
  { id: 2, label: 'Currículum', icon: <List size={16} /> },
  { id: 3, label: 'Configuración', icon: <Settings size={16} /> },
];

interface Module { title: string; description: string; lessons: { title: string; type: string; content: string }[]; }

export default function CreateCoursePage() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', short_description: '',
    category_id: '', level: 'beginner', language: 'es',
    price: '', is_free: true, is_published: false,
  });

  const [modules, setModules] = useState<Module[]>([
    { title: 'Módulo 1: Introducción', description: '', lessons: [{ title: 'Lección 1', type: 'video', content: '' }] }
  ]);

  const updateForm = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const addModule = () => setModules(m => [...m, { title: `Módulo ${m.length + 1}`, description: '', lessons: [{ title: 'Nueva lección', type: 'video', content: '' }] }]);
  const addLesson = (mi: number) => setModules(m => m.map((mod, i) => i === mi ? { ...mod, lessons: [...mod.lessons, { title: 'Nueva lección', type: 'video', content: '' }] } : mod));
  const removeModule = (mi: number) => setModules(m => m.filter((_, i) => i !== mi));
  const removeLesson = (mi: number, li: number) => setModules(m => m.map((mod, i) => i === mi ? { ...mod, lessons: mod.lessons.filter((_, j) => j !== li) } : mod));
  const updateModule = (mi: number, k: string, v: string) => setModules(m => m.map((mod, i) => i === mi ? { ...mod, [k]: v } : mod));
  const updateLesson = (mi: number, li: number, k: string, v: string) => setModules(m => m.map((mod, i) => i === mi ? { ...mod, lessons: mod.lessons.map((l, j) => j === li ? { ...l, [k]: v } : l) } : mod));

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error('El título es requerido'); return; }
    setLoading(true);
    try {
      await coursesApi.create({ ...form, price: form.is_free ? 0 : Number(form.price), modules });
      toast.success('¡Curso creado exitosamente!');
      router.push('/courses');
    } catch {
      toast.error('Error al crear el curso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Crear Nuevo Curso</h1>
        <p className="text-sm text-slate-500 mt-0.5">Comparte tu conocimiento con el mundo</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                step === s.id ? 'bg-primary-600 text-white' :
                step > s.id ? 'bg-emerald-50 text-emerald-700' :
                'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {step > s.id ? <CheckCircle2 size={15} /> : s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && <div className="flex-1 h-0.5 bg-slate-200 mx-2" />}
          </div>
        ))}
      </div>

      {/* Step 1 — Basic info */}
      {step === 1 && (
        <div className="card p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-800">Información del curso</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Título del curso *</label>
              <input
                type="text" placeholder="Ej: Desarrollo Web Completo con React y Node.js"
                value={form.title} onChange={(e) => updateForm('title', e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Descripción corta</label>
              <input
                type="text" placeholder="Resumen en una oración de tu curso"
                value={form.short_description} onChange={(e) => updateForm('short_description', e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Descripción completa</label>
              <textarea
                rows={5} placeholder="Describe en detalle lo que aprenderán los estudiantes..."
                value={form.description} onChange={(e) => updateForm('description', e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Categoría</label>
                <select value={form.category_id} onChange={(e) => updateForm('category_id', e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Sin categoría</option>
                  {(categories ?? []).map((c: { id: number; name: string }) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Nivel</label>
                <select value={form.level} onChange={(e) => updateForm('level', e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="beginner">Básico</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — Curriculum */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="text-base font-semibold text-slate-800 mb-1">Currículum del curso</h2>
            <p className="text-xs text-slate-500">Organiza tu curso en módulos y lecciones</p>
          </div>
          {modules.map((mod, mi) => (
            <div key={mi} className="card overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">{mi + 1}</div>
                <input
                  type="text" placeholder="Título del módulo"
                  value={mod.title} onChange={(e) => updateModule(mi, 'title', e.target.value)}
                  className="flex-1 text-sm font-semibold bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400"
                />
                {modules.length > 1 && (
                  <button onClick={() => removeModule(mi)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-100">
                {mod.lessons.map((lesson, li) => (
                  <div key={li} className="flex items-center gap-3 p-4">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">{li + 1}</div>
                    <input
                      type="text" placeholder="Título de la lección"
                      value={lesson.title} onChange={(e) => updateLesson(mi, li, 'title', e.target.value)}
                      className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <select value={lesson.type} onChange={(e) => updateLesson(mi, li, 'type', e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none">
                      <option value="video">Video</option>
                      <option value="text">Texto</option>
                      <option value="quiz">Quiz</option>
                    </select>
                    {mod.lessons.length > 1 && (
                      <button onClick={() => removeLesson(mi, li)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-100">
                <button onClick={() => addLesson(mi)} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
                  <Plus size={13} /> Agregar lección
                </button>
              </div>
            </div>
          ))}
          <button onClick={addModule} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
            <Plus size={16} /> Agregar módulo
          </button>
        </div>
      )}

      {/* Step 3 — Settings */}
      {step === 3 && (
        <div className="card p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-800">Precio y publicación</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-2">Tipo de acceso</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: true, label: 'Gratis', desc: 'Acceso libre para todos', icon: <Globe size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { value: false, label: 'De pago', desc: 'Precio personalizado', icon: <Lock size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    onClick={() => updateForm('is_free', opt.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.is_free === opt.value ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`${form.is_free === opt.value ? 'text-primary-600' : opt.color}`}>{opt.icon}</span>
                    <p className="text-sm font-semibold text-slate-800 mt-2">{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            {!form.is_free && (
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Precio (CLP)</label>
                <input
                  type="number" placeholder="49990"
                  value={form.price} onChange={(e) => updateForm('price', e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-sm font-medium text-slate-800">Publicar inmediatamente</p>
                <p className="text-xs text-slate-500">El curso estará visible para los estudiantes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={(e) => updateForm('is_published', e.target.checked)} className="sr-only peer" />
                <div className="w-10 h-5 bg-slate-200 peer-checked:bg-primary-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Footer navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-medium"
        >
          <ChevronLeft size={16} /> {step > 1 ? 'Anterior' : 'Cancelar'}
        </button>
        {step < 3 ? (
          <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
            Siguiente <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading} className="bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-70">
            {loading ? 'Creando...' : 'Crear curso'}
          </button>
        )}
      </div>
    </div>
  );
}
