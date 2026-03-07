import { useState, useEffect } from 'react'
import Header from './components/Header'
import ChatPanel from './components/ChatPanel'
import ContextPanel from './components/ContextPanel'
import AdminPanel from './components/AdminPanel'
import { useChat } from './hooks/useChat'
import './App.css'

type Tab = 'chat' | 'admin'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const { messages, isLoading, currentBooking, recentTransaction, sendMessage, updateSeat } = useChat()

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
      </nav>

      <main className="main-content">
        {activeTab === 'chat' ? (
          <div className="chat-layout">
            <ChatPanel messages={messages} isLoading={isLoading} onSend={sendMessage} />
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
        ) : (
          <AdminPanel />
        )}
      </main>
    </div>
  )
}
