'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Send, Search, MessageSquare } from 'lucide-react';

const MOCK_CONVS = [
  { id: 1, name: 'María González', role: 'Instructora', avatar: '', last: '¿Tienen dudas sobre el módulo 3?', time: '10 min', unread: 2 },
  { id: 2, name: 'Carlos Mendoza', role: 'Instructor', avatar: '', last: 'Revisé tu proyecto, muy buen trabajo.', time: '2h', unread: 0 },
  { id: 3, name: 'Super Admin', role: 'Administrador', avatar: '', last: 'Bienvenido a la plataforma.', time: '1d', unread: 0 },
];

const MOCK_MESSAGES: Record<number, { id: number; from: string; text: string; time: string; mine: boolean }[]> = {
  1: [
    { id: 1, from: 'María González', text: 'Hola, ¿cómo van con el módulo de autenticación?', time: '10:30', mine: false },
    { id: 2, from: 'Tú', text: 'Bien, aunque tengo una duda sobre OAuth2 con Passport.', time: '10:32', mine: true },
    { id: 3, from: 'María González', text: '¿Tienen dudas sobre el módulo 3? Publiqué recursos adicionales.', time: '10:45', mine: false },
  ],
  2: [
    { id: 1, from: 'Carlos Mendoza', text: 'Revisé tu proyecto de marketing, muy buen trabajo.', time: '08:00', mine: false },
    { id: 2, from: 'Tú', text: 'Gracias, trabajé mucho en el análisis de métricas.', time: '08:15', mine: true },
  ],
  3: [
    { id: 1, from: 'Super Admin', text: 'Bienvenido a Classroom Cloud 360. ¡Esperamos que disfrutes tu aprendizaje!', time: 'Ayer', mine: false },
  ],
};

export default function MessagesPage() {
  const { user } = useAuth();
  const [active, setActive] = useState<number | null>(1);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [search, setSearch] = useState('');

  const activeConv = MOCK_CONVS.find(c => c.id === active);
  const activeMessages = active ? (messages[active] ?? []) : [];

  const sendMessage = () => {
    if (!input.trim() || !active) return;
    const newMsg = { id: Date.now(), from: 'Tú', text: input.trim(), time: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }), mine: true };
    setMessages(m => ({ ...m, [active]: [...(m[active] ?? []), newMsg] }));
    setInput('');
  };

  const filtered = MOCK_CONVS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      {/* Conversations list */}
      <div className="w-72 shrink-0 flex flex-col border-r border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Mensajes</h2>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" placeholder="Buscar..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-slate-50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActive(conv.id)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 ${active === conv.id ? 'bg-primary-50 border-l-2 border-l-primary-500' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-sm font-bold text-primary-700">
                {conv.name.charAt(0)}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-800 truncate">{conv.name}</p>
                  <span className="text-[10px] text-slate-400 shrink-0">{conv.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.last}</p>
              </div>
              {conv.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {conv.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
              {activeConv.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{activeConv.name}</p>
              <p className="text-xs text-slate-400">{activeConv.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-3.5 py-2.5 rounded-2xl text-sm ${
                  msg.mine
                    ? 'bg-primary-600 text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.mine ? 'text-primary-200' : 'text-slate-400'} text-right`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="text" placeholder={`Mensaje para ${activeConv.name}...`}
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Selecciona una conversación</p>
          </div>
        </div>
      )}
    </div>
  );
}
