'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { sendOrderMessageAction } from '@/app/actions/message';

export default function ChatBox({ orderId, initialMessages, currentUserId }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sync prop changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || isPending) return;

    const currentText = text.trim();
    setText('');

    // Optimistic message update
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content: currentText,
      userId: currentUserId,
      createdAt: new Date(),
      user: { name: 'Vous' },
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    startTransition(async () => {
      const res = await sendOrderMessageAction(orderId, currentText);
      if (res.error) {
        // Revert or show error
        alert(res.error);
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      } else if (res.message) {
        // Replace temp with database message
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMessage.id ? res.message : m))
        );
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[450px]">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-900 dark:bg-gray-900/60 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-md shadow-orange-500/20">
            💬
          </div>
          <div>
            <h3 className="font-black text-sm text-white">Chef de projet dédié</h3>
            <p className="text-[10px] text-green-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              En ligne
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-white/10 text-white font-black px-2 py-1 rounded-full uppercase tracking-wider">
          Support Pro
        </span>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-900/20">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <p className="text-3xl mb-2">👋</p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">Démarrer une discussion</p>
            <p className="text-xs text-gray-500 max-w-[200px] mt-1">
              Posez vos questions ou demandez des ajustements sur ce projet.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-gray-500">
                    {isMe ? 'Vous' : msg.user?.name || 'Chef de Projet'}
                  </span>
                  <span className="text-[9px] text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm font-medium ${
                    isMe
                      ? 'bg-orange-500 text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-600 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Votre message ici..."
          className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-white placeholder-gray-400 font-medium"
        />
        <button
          type="submit"
          disabled={!text.trim() || isPending}
          className="px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Envoyer'
          )}
        </button>
      </form>
    </div>
  );
}
