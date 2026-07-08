'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { sendChatMessageAction } from '@/app/actions/chat';

export default function AdminChatClient({ initialThreads, currentUserId }) {
  const [threads, setThreads] = useState(initialThreads);
  const [selectedThread, setSelectedThread] = useState(initialThreads[0] || null);
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState(null);

  const messagesEndRef = useRef(null);

  // Reload current selected thread when threads list updates
  const activeThread = selectedThread 
    ? threads.find(t => t.id === selectedThread.id) 
    : null;

  const messages = activeThread?.messages || [];
  const clientName = activeThread?.client?.name || activeThread?.client?.email || "Client";
  const clientCompany = activeThread?.client?.company || "Compte Standard";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!activeThread || !content.trim()) return;

    setErrorMsg(null);
    const text = content;
    setContent('');

    startTransition(async () => {
      const result = await sendChatMessageAction(
        activeThread.id,
        activeThread.orderId || null,
        text
      );

      if (result?.success) {
        const newMsg = result.message;
        setThreads(prev => 
          prev.map(t => t.id === activeThread.id 
            ? { ...t, lastMessageAt: new Date(), messages: [...t.messages, newMsg] } 
            : t
          )
        );
      } else {
        setErrorMsg(result?.error || "Erreur d'envoi");
      }
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col md:flex-row h-[650px]">
      
      {/* Thread list */}
      <div className="w-full md:w-80 border-r border-slate-800 flex flex-col flex-shrink-0 bg-slate-900/50">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Fils de discussion</h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">Échanges clients par projets</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {threads.length > 0 ? (
            threads.map(t => {
              const lastMsg = t.messages?.[t.messages.length - 1]?.content || "Aucun message";
              const isSelected = selectedThread?.id === t.id;
              const name = t.client?.name || t.client?.email?.split('@')[0] || "Client";
              const hasUnread = t.messages?.some(m => !m.isRead && m.senderId !== currentUserId);

              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedThread(t)}
                  className={`w-full text-left p-5 transition-all flex flex-col gap-1.5 focus:outline-none ${
                    isSelected 
                      ? 'bg-indigo-950/20 border-l-4 border-indigo-500' 
                      : 'hover:bg-slate-800/20'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] font-black text-slate-500 tracking-wider">
                      {t.orderId ? `Projet #${t.orderId.substring(0,8).toUpperCase()}` : "Général"}
                    </span>
                    {hasUnread && (
                      <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping"></span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-white truncate w-full flex items-center gap-1.5">
                    {name}
                    {t.client?.company && (
                      <span className="text-[9px] font-bold text-slate-400">({t.client.company})</span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 truncate w-full">
                    {lastMsg}
                  </p>
                </button>
              );
            })
          ) : (
            <div className="text-center p-8 text-slate-500 text-sm font-medium">
              Aucune conversation pour le moment.
            </div>
          )}
        </div>
      </div>

      {/* Main chat pane */}
      <div className="flex-1 flex flex-col bg-slate-950/30">
        {activeThread ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center flex-shrink-0 bg-slate-900/10">
              <div>
                <h4 className="font-black text-white text-base flex items-center gap-2">
                  {clientName}
                  <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                    {clientCompany}
                  </span>
                </h4>
                {activeThread.orderId && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Discussion liée à la commande #{activeThread.orderId.substring(0,8).toUpperCase()}
                  </p>
                )}
              </div>
            </div>

            {/* Messages box */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length > 0 ? (
                messages.map(msg => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    >
                      <div className={`max-w-[75%] rounded-3xl p-4 text-sm font-bold leading-relaxed shadow-sm ${
                        isMe 
                          ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-br-none' 
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}>
                        <p>{msg.content}</p>
                        <span className={`text-[9px] block text-right mt-1.5 font-bold ${
                          isMe ? 'text-white/60' : 'text-slate-500'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <p className="text-slate-500 font-bold">Aucun message</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="px-6 py-2 bg-red-950/20 text-red-400 text-xs font-bold border-t border-red-900/30">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-800 flex items-center gap-3 bg-slate-900/20 flex-shrink-0">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Répondre à ${clientName}...`}
                disabled={isPending}
                className="flex-1 px-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white"
              />
              <button
                type="submit"
                disabled={isPending || !content.trim()}
                className="px-5 py-3.5 bg-gradient-to-r from-indigo-650 to-blue-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md shadow-indigo-950/45 disabled:opacity-50"
              >
                Répondre
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <span className="text-4xl block mb-3">💬</span>
            <h4 className="font-black text-slate-400">Aucune discussion active</h4>
            <p className="text-xs text-slate-600 mt-1">Sélectionnez un fil de discussion dans le panneau latéral.</p>
          </div>
        )}
      </div>

    </div>
  );
}
