'use client';
import { useState } from 'react';
import { MessageCircle, ThumbsUp, Eye, Plus, Search, Pin, BookOpen, User, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const MOCK_POSTS = [
  {
    id: 1, title: '¿Cómo implementar autenticación OAuth2 en Laravel?',
    body: 'Estoy trabajando en mi proyecto final y necesito integrar login con Google. ¿Alguien puede guiarme con el proceso paso a paso usando Laravel Passport o Sanctum?',
    author: 'Diego Herrera', course: 'Desarrollo Web con Laravel 11',
    replies: 8, views: 124, likes: 15, created_at: '2026-07-03', pinned: true, solved: true,
  },
  {
    id: 2, title: 'Error al hacer deploy en producción — "APP_KEY not set"',
    body: 'Cada vez que intento hacer deploy en mi servidor me sale este error. Ya generé la clave con artisan key:generate pero sigue fallando.',
    author: 'Ana López', course: 'Desarrollo Web con Laravel 11',
    replies: 5, views: 87, likes: 7, created_at: '2026-07-02', pinned: false, solved: false,
  },
  {
    id: 3, title: '¿Cuál es la mejor estrategia de SEO para un e-commerce pequeño?',
    body: 'Tengo una tienda online con menos de 100 productos. ¿Vale la pena invertir en SEO o es mejor enfocarse en redes sociales y paid ads?',
    author: 'Valentina Ruiz', course: 'Marketing Digital para Emprendedores',
    replies: 12, views: 203, likes: 23, created_at: '2026-07-01', pinned: false, solved: true,
  },
  {
    id: 4, title: 'Feedback del prototipo de la app de delivery en Figma',
    body: 'Comparto mi prototipo de la tarea 3. Cualquier feedback sobre UX y usabilidad es bienvenido. Principalmente me preocupa el flujo de pago.',
    author: 'Camila Vargas', course: 'Diseño UX/UI con Figma',
    replies: 4, views: 56, likes: 9, created_at: '2026-07-04', pinned: false, solved: false,
  },
];

export default function ForumPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [selected, setSelected] = useState<typeof MOCK_POSTS[0] | null>(null);

  const filtered = MOCK_POSTS.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.course.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });

  if (selected) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelected(null)} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
          ← Volver al foro
        </button>
        <div className="card p-6">
          <div className="flex items-start gap-3 mb-4">
            {selected.pinned && <Pin size={14} className="text-amber-500 shrink-0 mt-1" />}
            <div>
              <h2 className="text-lg font-bold text-slate-800">{selected.title}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-slate-500 flex items-center gap-1"><User size={11} /> {selected.author}</span>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full"><BookOpen size={10} className="inline mr-1" />{selected.course}</span>
                {selected.solved && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">✓ Resuelto</span>}
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{selected.body}</p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary-600 transition-colors">
              <ThumbsUp size={14} /> {selected.likes} Me gusta
            </button>
            <span className="text-xs text-slate-400 flex items-center gap-1"><Eye size={13} /> {selected.views} vistas</span>
          </div>
        </div>
        {/* Reply box */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Escribir respuesta</h3>
          <textarea
            rows={4}
            placeholder="Comparte tu respuesta o comentario..."
            className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
          <div className="flex justify-end mt-3">
            <button className="bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors">
              Publicar respuesta
            </button>
          </div>
        </div>
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-800 mb-3">{selected.replies} respuestas</p>
          <div className="space-y-4">
            {Array.from({ length: Math.min(selected.replies, 3) }).map((_, i) => (
              <div key={i} className="flex gap-3 pb-4 border-b border-slate-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-xs font-bold text-primary-700">
                  {String.fromCharCode(65 + i)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Estudiante {i + 1}</p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {i === 0 ? 'Puedes usar Laravel Passport para OAuth2 completo, o Sanctum si solo necesitas token API. Para Google login específicamente te recomiendo usar el paquete Laravel Socialite.' :
                     i === 1 ? 'Asegúrate de que tu archivo .env tenga APP_KEY generada. Si estás en producción, también verifica que las variables de entorno del servidor estén configuradas.' :
                     'Muy buena pregunta. En mi experiencia, para e-commerce pequeño lo más importante es Google My Business y optimización on-page básica antes de pensar en estrategias más complejas.'}
                  </p>
                  <button className="mt-1 text-xs text-slate-400 hover:text-primary-600 flex items-center gap-1 transition-colors">
                    <ThumbsUp size={11} /> {3 + i} útil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Foro de Discusión</h1>
          <p className="text-sm text-slate-500 mt-0.5">{MOCK_POSTS.length} discusiones activas</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus size={15} /> Nueva pregunta
        </button>
      </div>

      {showNew && (
        <div className="card p-5 border-primary-200 ring-1 ring-primary-200">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Nueva pregunta o discusión</h3>
          <input
            type="text" placeholder="Título de tu pregunta..."
            value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <textarea
            rows={4} placeholder="Describe tu pregunta en detalle..."
            value={newBody} onChange={(e) => setNewBody(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-3"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowNew(false)} className="text-sm text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">Cancelar</button>
            <button className="bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors">Publicar</button>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Buscar en el foro..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(post => (
          <button
            key={post.id}
            onClick={() => setSelected(post)}
            className="w-full card p-5 text-left hover:shadow-card-hover hover:border-slate-300 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0 text-sm font-bold text-primary-700">
                {post.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-800 group-hover:text-primary-700 transition-colors leading-snug line-clamp-2">
                    {post.pinned && <Pin size={12} className="inline text-amber-500 mr-1 -mt-0.5" />}
                    {post.title}
                  </h3>
                  {post.solved && (
                    <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full shrink-0">Resuelto</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{post.body}</p>
                <div className="flex items-center gap-4 mt-2.5">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1"><User size={11} /> {post.author}</span>
                  <span className="text-[11px] text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full font-medium">{post.course}</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto"><MessageCircle size={11} /> {post.replies}</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1"><Eye size={11} /> {post.views}</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1"><ThumbsUp size={11} /> {post.likes}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
