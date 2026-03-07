import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import Markdown from 'react-markdown'
import { Message } from '../types'
import './ChatPanel.css'

interface Props {
  messages: Message[]
  isLoading: boolean
  onSend: (text: string) => void
}

export default function ChatPanel({ messages, isLoading, onSend }: Props) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const submit = () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    onSend(text)
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="chat-panel">
      <div className="message-list">
        {messages.length === 0 && (
          <div className="empty-chat">
            <p>Olá! Sou o assistente da Funnair.</p>
            <p>Como posso ajudar com sua reserva?</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`bubble-wrap bubble-wrap--${msg.role}`}>
            <div className={`bubble bubble--${msg.role}`}>
              {msg.role === 'assistant' ? (
                <Markdown>{msg.content || (isLoading ? '…' : '')}</Markdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="bubble-wrap bubble-wrap--assistant">
            <div className="bubble bubble--assistant bubble--typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-bar">
        <textarea
          className="chat-input"
          rows={1}
          placeholder="Digite sua mensagem… (Enter para enviar)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          disabled={isLoading}
        />
        <button className="send-btn" onClick={submit} disabled={isLoading || !input.trim()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
