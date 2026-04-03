import { useState, useEffect } from 'react'
import Header from './components/Header'
import ChatPanel from './components/ChatPanel'
import ContextPanel from './components/ContextPanel'
import AdminPanel from './components/AdminPanel'
import RagPanel from './components/RagPanel'
import VoiceConfigPanel from './components/VoiceConfigPanel'
import AgentConfigPanel from './components/AgentConfigPanel'
import { useChat } from './hooks/useChat'
import { VoiceConfig, DEFAULT_VOICE_CONFIG } from './types'
import { fetchVoiceConfig } from './api/voiceConfigApi'
import './App.css'

type Tab = 'chat' | 'admin' | 'rag' | 'voice' | 'agent'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>(DEFAULT_VOICE_CONFIG)
  const { messages, isLoading, currentBooking, recentTransaction, sendMessage, updateSeat } = useChat()

  useEffect(() => {
    fetchVoiceConfig().then(setVoiceConfig).catch(() => {})
  }, [])

  useEffect(() => {
    if (!currentBooking) setMobileDrawerOpen(false)
  }, [currentBooking])

  return (
    <div className="app">
      <Header />

      <nav className="tab-bar">
        <button
          className={`tab${activeTab === 'chat' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          ✈️ Chat
        </button>
        <button
          className={`tab${activeTab === 'admin' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          🗂️ Consulta &amp; Testes
        </button>
        <button
          className={`tab${activeTab === 'rag' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('rag')}
        >
          🧠 Base de Conhecimento
        </button>
        <button
          className={`tab${activeTab === 'voice' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('voice')}
        >
          🔊 Configuração de Voz
        </button>
        <button
          className={`tab${activeTab === 'agent' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('agent')}
        >
          🤖 Configuração do Agente
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'chat' && (
          <div className="chat-layout">
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              onSend={sendMessage}
              voiceConfig={voiceConfig}
            />
            <ContextPanel
              booking={currentBooking}
              recentTransaction={recentTransaction}
              onSeatChange={updateSeat}
              mobileOpen={mobileDrawerOpen}
              onMobileClose={() => setMobileDrawerOpen(false)}
            />
            {currentBooking && !mobileDrawerOpen && (
              <button
                className="context-fab"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Ver detalhes da reserva"
              >
                ✈ Reserva {currentBooking.bookingNumber}
              </button>
            )}
          </div>
        )}
        {activeTab === 'admin' && <AdminPanel />}
        {activeTab === 'rag' && <RagPanel />}
        {activeTab === 'voice' && (
          <VoiceConfigPanel config={voiceConfig} onChange={setVoiceConfig} />
        )}
        {activeTab === 'agent' && <AgentConfigPanel />}
      </main>
    </div>
  )
}
