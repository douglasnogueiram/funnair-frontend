import { useState, useCallback, useRef } from 'react'
import { Message, BookingDetails, PaymentTransactionDTO } from '../types'
import { sendChatMessage, getBookings, getTransactions } from '../api/chatApi'

const BOOKING_REGEX = /\b(1\d{2})\b/

function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  const b = new Uint8Array(16)
  crypto.getRandomValues(b)
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  return [...b].map((v, i) =>
    ([4, 6, 8, 10].includes(i) ? '-' : '') + v.toString(16).padStart(2, '0'),
  ).join('')
}

export function useChat() {
  const chatId = useRef<string>(uuid()).current
  const persistedBookingNumber = useRef<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentBooking, setCurrentBooking] = useState<BookingDetails | null>(null)
  const [recentTransaction, setRecentTransaction] = useState<PaymentTransactionDTO | null>(null)

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return

      const match = text.match(BOOKING_REGEX)
      const bookingHint = match ? match[1] : null
      // Atualiza o booking persistido se a mensagem atual tiver um número novo
      if (bookingHint) persistedBookingNumber.current = bookingHint

      const userMsg: Message = { id: uuid(), role: 'user', content: text }
      const assistantId = uuid()
      const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '' }

      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setIsLoading(true)

      await sendChatMessage(
        chatId,
        text,
        // onToken
        (token) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + token } : m)),
          )
        },
        // onDone
        async (detectedBn) => {
          const bn = detectedBn ?? persistedBookingNumber.current
          if (bn) {
            const bookings = await getBookings()
            const found = bookings.find((b) => b.bookingNumber === bn)
            if (found) {
              setCurrentBooking(found)
              const txs = await getTransactions(bn)
              if (txs.length > 0) {
                const latest = txs[txs.length - 1]
                const age = Date.now() - new Date(latest.transactionDate).getTime()
                setRecentTransaction(age < 2 * 60_000 ? latest : null)
              } else {
                setRecentTransaction(null)
              }
            }
          }
          setIsLoading(false)
        },
        // onError
        (msg) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: `Erro: ${msg}` } : m)),
          )
          setIsLoading(false)
        },
      )
    },
    [chatId, isLoading],
  )

  const updateSeat = useCallback((newSeat: string) => {
    setCurrentBooking((prev) => (prev ? { ...prev, seatNumber: newSeat } : null))
  }, [])

  return { messages, isLoading, currentBooking, recentTransaction, sendMessage, updateSeat }
}
