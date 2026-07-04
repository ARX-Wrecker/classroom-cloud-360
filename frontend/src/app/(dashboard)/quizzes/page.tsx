'use client';

import { useState } from 'react';
import {
  ClipboardList, Plus, Clock, CheckCircle2, XCircle,
  ChevronRight, Play, RotateCcw, Star, Trophy, AlertCircle,
  ChevronDown, ChevronUp,
} from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

const quizzes = [
  {
    id: 1,
    title: 'React Hooks Fundamentales',
    course: 'React Avanzado con TypeScript',
    questions: 10,
    duration: 20,
    attempts: 2,
    maxAttempts: 3,
    status: 'available',
    dueDate: '2026-07-10',
    lastScore: 75,
    passing: 70,
  },
  {
    id: 2,
    title: 'TypeScript Tipos Avanzados',
    course: 'React Avanzado con TypeScript',
    questions: 15,
    duration: 30,
    attempts: 1,
    maxAttempts: 2,
    status: 'passed',
    dueDate: '2026-07-05',
    lastScore: 88,
    passing: 70,
  },
  {
    id: 3,
    title: 'CSS Grid y Flexbox',
    course: 'Diseño UX/UI Profesional',
    questions: 12,
    duration: 25,
    attempts: 0,
    maxAttempts: 3,
    status: 'available',
    dueDate: '2026-07-15',
    lastScore: null,
    passing: 60,
  },
  {
    id: 4,
    title: 'Python Estructuras de Datos',
    course: 'Python para Data Science',
    questions: 20,
    duration: 40,
    attempts: 3,
    maxAttempts: 3,
    status: 'failed',
    dueDate: '2026-06-28',
    lastScore: 52,
    passing: 70,
  },
];

const sampleQuestions: Question[] = [
  {
    id: 1,
    text: '¿Cuál es el hook de React que se usa para manejar estado local en un componente funcional?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    correct: 1,
  },
  {
    id: 2,
    text: '¿Qué devuelve useState()?',
    options: [
      'Un solo valor de estado',
      'Un array con el estado y una función para actualizarlo',
      'Un objeto con propiedades get y set',
      'Una promesa con el valor del estado',
    ],
    correct: 1,
  },
  {
    id: 3,
    text: '¿Cuándo se ejecuta useEffect con un array de dependencias vacío []?',
    options: [
      'En cada render',
      'Solo cuando cambia el estado',
      'Solo una vez, al montar el componente',
      'Cuando el componente se desmonta',
    ],
    correct: 2,
  },
];

type QuizState = 'list' | 'taking' | 'results';

export default function QuizzesPage() {
  const [view, setView] = useState<QuizState>('list');
  const [activeQuiz, setActiveQuiz] = useState<typeof quizzes[0] | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(sampleQuestions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = quizzes.filter(q => filterStatus === 'all' || q.status === filterStatus);

  const startQuiz = (quiz: typeof quizzes[0]) => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setAnswers(Array(sampleQuestions.length).fill(null));
    setTimeLeft(quiz.duration * 60);
    setView('taking');
  };

  const submitQuiz = () => {
    setView('results');
  };

  const score = answers.filter((a, i) => a === sampleQuestions[i].correct).length;
  const pct = Math.round((score / sampleQuestions.length) * 100);

  if (view === 'taking' && activeQuiz) {
    const q = sampleQuestions[currentQ];
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Quiz Header */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">{activeQuiz.title}</h2>
              <p className="text-sm text-gray-500">{activeQuiz.course}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">Pregunta</p>
                <p className="font-bold text-gray-900">{currentQ + 1}/{sampleQuestions.length}</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg">
                <Clock size={14} />
                <span className="text-sm font-medium">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2,'0')}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="h-1.5 bg-gray-200 rounded-full mb-6">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${((currentQ + 1) / sampleQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <p className="text-lg font-medium text-gray-900 mb-6">{q.text}</p>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const newAnswers = [...answers];
                    newAnswers[currentQ] = i;
                    setAnswers(newAnswers);
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[currentQ] === i
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50"
            >
              Anterior
            </button>
            <div className="flex gap-1">
              {sampleQuestions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`w-7 h-7 rounded-full text-xs font-medium ${
                    i === currentQ ? 'bg-blue-600 text-white' :
                    answers[i] !== null ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            {currentQ < sampleQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQ(currentQ + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={submitQuiz}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'results' && activeQuiz) {
    const passed = pct >= activeQuiz.passing;
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-6">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <Trophy size={36} className="text-green-600" />
              ) : (
                <XCircle size={36} className="text-red-500" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {passed ? '¡Aprobado!' : 'No aprobado'}
            </h2>
            <p className="text-gray-500 mb-4">{activeQuiz.title}</p>
            <div className={`text-5xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-500'}`}>
              {pct}%
            </div>
            <p className="text-sm text-gray-500">
              {score} de {sampleQuestions.length} correctas · Mínimo {activeQuiz.passing}%
            </p>
          </div>

          {/* Review */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h3 className="font-semibold text-gray-900 mb-4">Revisión de respuestas</h3>
            <div className="space-y-4">
              {sampleQuestions.map((q, i) => {
                const correct = answers[i] === q.correct;
                return (
                  <div key={i} className={`p-4 rounded-lg border ${correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex gap-2 mb-2">
                      {correct ? <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" /> : <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />}
                      <p className="text-sm font-medium text-gray-900">{q.text}</p>
                    </div>
                    <p className="text-xs text-gray-600 ml-5">
                      Tu respuesta: <span className={correct ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}>
                        {answers[i] !== null ? q.options[answers[i]!] : 'Sin responder'}
                      </span>
                    </p>
                    {!correct && (
                      <p className="text-xs text-gray-600 ml-5">
                        Correcta: <span className="text-green-700 font-medium">{q.options[q.correct]}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setView('list')}
              className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              Volver a quizzes
            </button>
            {!passed && (
              <button
                onClick={() => startQuiz(activeQuiz)}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} /> Reintentar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes & Evaluaciones</h1>
          <p className="text-sm text-gray-500 mt-1">Prueba tu conocimiento en cada módulo</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          <Plus size={16} /> Crear Quiz
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { label: 'Todos', value: 'all' },
          { label: 'Disponibles', value: 'available' },
          { label: 'Aprobados', value: 'passed' },
          { label: 'Reprobados', value: 'failed' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilterStatus(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(quiz => (
          <div key={quiz.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              quiz.status === 'passed' ? 'bg-green-100' :
              quiz.status === 'failed' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {quiz.status === 'passed' ? <CheckCircle2 size={22} className="text-green-600" /> :
               quiz.status === 'failed' ? <XCircle size={22} className="text-red-500" /> :
               <ClipboardList size={22} className="text-blue-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                {quiz.status === 'passed' && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Aprobado</span>
                )}
                {quiz.status === 'failed' && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Reprobado</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">{quiz.course}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><ClipboardList size={11} />{quiz.questions} preguntas</span>
                <span className="flex items-center gap-1"><Clock size={11} />{quiz.duration} min</span>
                <span className="flex items-center gap-1">
                  <AlertCircle size={11} />
                  {quiz.attempts}/{quiz.maxAttempts} intentos
                </span>
                {quiz.lastScore !== null && (
                  <span className="flex items-center gap-1">
                    <Star size={11} />
                    Último: {quiz.lastScore}%
                  </span>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400 mb-2">Vence: {quiz.dueDate}</p>
              {quiz.status !== 'failed' || quiz.attempts < quiz.maxAttempts ? (
                <button
                  onClick={() => startQuiz(quiz)}
                  disabled={quiz.attempts >= quiz.maxAttempts}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Play size={12} />
                  {quiz.attempts === 0 ? 'Comenzar' : 'Reintentar'}
                </button>
              ) : (
                <span className="text-xs text-red-500 font-medium">Sin intentos</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
