'use client'

// frontend/app/components/ChatWidget.tsx
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  'Как найти товар?',
  'Есть товары до 2000 сом?',
  'Как оформить заказ?',
  'Какие категории есть?',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Привет! 👋 Я ассистент SPORTCORE. Помогу найти нужный товар или разобраться с сайтом. Чем могу помочь?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, messages])

  const handleNavigate = (url: string) => {
    router.push(url)
    setOpen(false)
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const newMessages = [...messages, userMsg]
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
      const data = await res.json()
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.message ?? 'Ошибка ответа',
          action: data.action ?? null,
        },
      ])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Ошибка соединения. Попробуйте ещё раз.' }])
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

  return (
    <>
      {/* Кнопка открытия */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#1a1f4b] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#2a2f6b] transition-all duration-200 hover:scale-110"
        aria-label="Открыть чат"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Виджет чата */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          style={{ height: '500px' }}
        >
          {/* Шапка */}
          <div className="bg-[#1a1f4b] text-white px-4 py-3 flex items-center gap-3">
            <img
              src="/logo.png"
              alt="SPORTCORE"
              className="w-9 h-9 rounded-full object-cover"
              onError={(e) => {
                const t = e.currentTarget
                t.style.display = 'none'
                const fallback = t.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            <div className="bg-[#1a1f4b] text-white px-4 py-3 flex items-center gap-3">
            <img
                src="/helper.avif"
                alt="SPORTCORE"
                className="w-9 h-9 rounded-full object-cover"
              />
            <div>
              <div className="font-semibold text-sm">SPORTCORE Ассистент</div>
            </div>
          </div>
          </div>

          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1a1f4b] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Кнопка перехода если есть action */}
                {msg.action?.type === 'navigate' && (
                  <button
                    onClick={() => handleNavigate(msg.action!.url)}
                    className="mt-2 flex items-center gap-2 bg-[#1a1f4b] text-white text-xs px-3 py-2 rounded-xl hover:bg-[#2a2f6b] transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Перейти: {msg.action.label}
                  </button>
                )}
              </div>
            ))}

            {/* Индикатор загрузки */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Быстрые подсказки */}
          {messages.length === 1 && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-1">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-full hover:bg-[#1a1f4b] hover:text-white hover:border-[#1a1f4b] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Поле ввода */}
          <div className="px-3 py-3 bg-white border-t border-gray-200 flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Написать сообщение..."
              disabled={loading}
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a1f4b] disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-[#1a1f4b] text-white rounded-full flex items-center justify-center hover:bg-[#2a2f6b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
