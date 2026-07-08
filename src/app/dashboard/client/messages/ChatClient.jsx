'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { sendChatMessageAction } from '@/app/actions/chat';

export default function ChatClient({ initialOrders, initialThreads, currentUserId }) {
  const [threads, setThreads] = useState(initialThreads);
  const [selectedOrder, setSelectedOrder] = useState(initialOrders[0] || null);
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState(null);

  const messagesEndRef = useRef(null);

  // Find active thread
  const activeThread = selectedOrder 
    ? threads.find(t => t.orderId === selectedOrder.id) 
    : null;

  const messages = activeThread?.messages || [];

  // Scroll to bottom on load/update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !content.trim()) return;

    setErrorMsg(null);
    const text = content;
    setContent('');

    startTransition(async () => {
      const result = await sendChatMessageAction(
        activeThread?.id || null,
        selectedOrder.id,
        text
      );

      if (result?.success) {
        // Append locally
        const newMsg = result.message;
        setThreads(prev => {
          const threadExists = prev.some(t => t.id === result.threadId);
          if (threadExists) {
            return prev.map(t => t.id === result.threadId 
              ? { ...t, lastMessageAt: new Date(), messages: [...t.messages, newMsg] } 
              : t
            );
          } else {
            return [...prev, {
              id: result.threadId,
              orderId: selectedOrder.id,
              clientId: currentUserId,
              lastMessageAt: new Date(),
              messages: [newMsg]
            }];
          }
        });
      } else {
        setErrorMsg(result?.error || "Erreur d'envoi");
      }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden flex flex-col md:flex-row h-[600px]">
      
      {/* Sidebar List */}
      <div className="w-full md:w-80 border-r border-slate-100 dark:border-slate-750 flex flex-col flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="p-6 border-b border-slate-100 dark:border-slate-750">
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Commandes</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Sélectionnez un projet pour échanger</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/50 dark:divide-slate-750/30">
          {initialOrders.length > 0 ? (
            initialOrders.map(order => {
              const firstItem = order.items?.[0];
              const pName = firstItem?.productName || "Impression personnalisée";
              const isSelected = selectedOrder?.id === order.id;

              // Check last msg
              const thread = threads.find(t => t.orderId === order.id);
              const lastMsg = thread?.messages?.[thread.messages.length - 1]?.content || "Aucun message pour le moment";

              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full text-left p-5 transition-all flex flex-col gap-1.5 focus:outline-none ${
                    isSelected 
                      ? 'bg-orange-50/50 dark:bg-orange-950/10 border-l-4 border-orange-500' 
                      : 'hover:bg-slate-50/20'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wider">
                      #{order.reference || order.id.substring(0,8).toUpperCase()}
                    </span>
                    <span className="text-[9px] font-black uppercase text-slate-450 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {order.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 truncate w-full">
                    {pName}
                  </h4>
                  <p className="text-xs text-slate-450 dark:text-slate-400 truncate w-full">
                    {lastMsg}
                  </p>
                </button>
              );
            })
          ) : (
            <div className="text-center p-8 text-slate-500 text-sm font-medium">
              Aucune commande active.
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
        {selectedOrder ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-750 flex justify-between items-center flex-shrink-0">
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-base">
                  {selectedOrder.items?.[0]?.productName || "Commande personnalisée"}
                </h4>
                <p className="text-xs text-slate-450 mt-0.5">
                  Référence : #{selectedOrder.reference || selectedOrder.id.substring(0,8).toUpperCase()}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-3 py-1 rounded-full border border-orange-200/50">
                Liaison Directe
              </span>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    >
                      <div className={`max-w-[75%] rounded-3xl p-4 text-sm font-bold leading-relaxed shadow-sm ${
                        isMe 
                          ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-br-none' 
                          : 'bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-750 text-slate-800 dark:text-slate-200 rounded-bl-none'
                      }`}>
                        <p>{msg.content}</p>
                        <span className={`text-[9px] block text-right mt-1.5 font-bold ${
                          isMe ? 'text-white/70' : 'text-slate-400'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <span className="text-3xl block mb-2">💬</span>
                  <p className="text-slate-500 dark:text-slate-400 font-bold">Début de la discussion</p>
                  <p className="text-xs text-slate-450 mt-1 max-w-xs">
                    Posez vos questions à propos de la validation de BAT, de la maquette ou de la livraison.
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="px-6 py-2 bg-red-50 text-red-700 text-xs font-bold border-t border-red-100">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-750 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/10 flex-shrink-0">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Votre message..."
                disabled={isPending}
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-bold dark:text-white"
              />
              <button
                type="submit"
                disabled={isPending || !content.trim()}
                className="px-5 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md shadow-orange-500/10 disabled:opacity-50"
              >
                Envoyer
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <span className="text-4xl block mb-3">💬</span>
            <p className="text-slate-500 dark:text-slate-400 font-bold">Aucune commande sélectionnée</p>
            <p className="text-xs text-slate-450 mt-1">Vous devez posséder au moins une commande active pour engager la discussion.</p>
          </div>
        )}
      </div>
    </div>
  );
}
