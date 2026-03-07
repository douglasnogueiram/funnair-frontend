import { BookingDetails, PaymentTransactionDTO } from '../types'
import FlightInfoCard from './FlightInfoCard'
import SeatMapCard from './SeatMapCard'
import PaymentInfoCard from './PaymentInfoCard'
import './ContextPanel.css'

interface Props {
  booking: BookingDetails | null
  recentTransaction: PaymentTransactionDTO | null
  onSeatChange: (newSeat: string) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function ContextPanel({ booking, recentTransaction, onSeatChange, mobileOpen, onMobileClose }: Props) {
  return (
    <>
      {mobileOpen && <div className="context-backdrop" onClick={onMobileClose} />}
      <div className={`context-panel${mobileOpen ? ' context-panel--open' : ''}`}>
        <button className="context-drawer-close" onClick={onMobileClose} aria-label="Fechar">✕</button>
        {!booking ? (
          <div className="context-empty">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="#b0c4d8" aria-hidden="true">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            <p>Consulte uma reserva no chat<br />para ver os detalhes aqui.</p>
          </div>
        ) : (
          <div className="context-cards">
            <FlightInfoCard booking={booking} />
            <SeatMapCard booking={booking} onSeatChange={onSeatChange} />
            {recentTransaction && <PaymentInfoCard transaction={recentTransaction} />}
          </div>
        )}
      </div>
    </>
  )
}
