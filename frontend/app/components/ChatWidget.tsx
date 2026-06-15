'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

type Action = {
  type: 'navigate'
  url: string
  label: string
}

type Message = {
  role: 'user' | 'assistant'
  content: string
  action?: Action | null
}

const QUICK_PROMPTS = [
  'Какой велосипед выбрать?',
  'Помогите с выбором',
  'Есть ли скидки?',
  'Как оформить заказ?',
  'Есть товары до 3000 сом?',
]

const MAX_CLIENT_MESSAGES = 30

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: 'Привет! Я Макс — консультант SPORTCORE. Помогу подобрать товар и отвечу на вопросы о доставке и оплате. Чем могу помочь?',
}

export default function ChatWidget() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const router    = useRouter()

  // Скролл вниз и фокус на инпут
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }, 120)
    return () => clearTimeout(t)
  }, [open, messages])

  // Блокировка скролла body на мобилках когда чат открыт
  useEffect(() => {
    if (typeof window === 'undefined') return
    const isMobile = window.innerWidth < 768
    if (open && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleNavigate = (url: string) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank')
    } else {
      router.push(url)
      setOpen(false)
    }
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const prevMessages  = messages.slice(-MAX_CLIENT_MESSAGES)
    const newMessages   = [...prevMessages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Что-то пошло не так. Напиши нам напрямую — ответим быстро!',
          action: { type: 'navigate', url: 'https://api.whatsapp.com/send?phone=996774231202&text=Здравствуйте', label: 'Написать в WhatsApp' },
        }])
        return
      }

      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message ?? 'Не смог обработать запрос, попробуй ещё раз.',
        action: data.action ?? null,
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Нет соединения. Проверь интернет или напиши нам в WhatsApp.',
        action: { type: 'navigate', url: 'https://api.whatsapp.com/send?phone=996774231202&text=Здравствуйте', label: 'Написать в WhatsApp' },
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const resetChat = () => {
    setMessages([INITIAL_MESSAGE])
    setInput('')
  }

  const showQuickPrompts = messages.length <= 1

  return (
    <>
      {/* Мобильный backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Кнопка открытия */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-[#1a1f4b] text-white rounded-full shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        aria-label={open ? 'Закрыть чат' : 'Открыть чат с консультантом'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0,   scale: 1 }}
              exit={{ opacity: 0,   rotate: 90,   scale: 0.5 }}
              transition={{ duration: 0.15 }}
              xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ opacity: 0, rotate: 90,  scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0,   scale: 1 }}
              exit={{ opacity: 0,   rotate: -90,  scale: 0.5 }}
              transition={{ duration: 0.15 }}
              xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Чат-окно */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0,   y: 24,  scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="
              fixed z-50 bg-white flex flex-col overflow-hidden shadow-2xl
              inset-0 rounded-none
              md:inset-auto md:bottom-[88px] md:right-5 md:w-96 md:h-[520px] md:rounded-2xl md:border md:border-gray-200
            "
          >
            {/* Шапка */}
            <div className="bg-[#1a1f4b] text-white px-4 py-3 flex items-center gap-3 shrink-0">
              <img
                src="/helper.avif"
                alt="SPORTCORE консультант Макс"
                className="w-9 h-9 rounded-full object-cover shrink-0"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm leading-tight">Макс · SPORTCORE</div>
                <div className="text-xs text-blue-200 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                  Онлайн — отвечаю быстро
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={resetChat}
                  className="text-blue-200 hover:text-white transition-colors text-xs px-2 py-1.5 rounded-lg hover:bg-white/10 min-h-[36px]"
                  title="Начать заново"
                >
                  Сброс
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-blue-200 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="Закрыть чат"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[83%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#1a1f4b] text-white rounded-br-sm'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.action?.type === 'navigate' && (
                    <button
                      onClick={() => handleNavigate(msg.action!.url)}
                      className="mt-2 flex items-center gap-1.5 bg-[#1a1f4b] text-white text-xs px-3.5 py-2 rounded-xl hover:bg-[#2a2f6b] transition-all hover:scale-105 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      {msg.action.label}
                    </button>
                  )}
                </div>
              ))}

              {/* Индикатор набора */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3.5 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                    <div className="flex gap-1.5 items-center h-4">
                      <span className="chat-dot w-2 h-2 bg-gray-400 rounded-full" />
                      <span className="chat-dot w-2 h-2 bg-gray-400 rounded-full" />
                      <span className="chat-dot w-2 h-2 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Быстрые подсказки */}
            {showQuickPrompts && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-3 py-2.5 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-1.5 shrink-0"
              >
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    disabled={loading}
                    className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1.5 rounded-full hover:bg-[#1a1f4b] hover:text-white hover:border-[#1a1f4b] transition-all duration-150 disabled:opacity-40 active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Ввод сообщения */}
            <div className="px-3 py-3 bg-white border-t border-gray-200 flex gap-2 items-center shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Написать сообщение..."
                disabled={loading}
                maxLength={500}
                className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1f4b]/25 disabled:opacity-50 min-h-[44px]"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-11 h-11 bg-[#1a1f4b] text-white rounded-full flex items-center justify-center hover:bg-[#2a2f6b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
