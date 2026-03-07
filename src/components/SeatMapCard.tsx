import { useState } from 'react'
import { BookingDetails } from '../types'
import { changeSeat } from '../api/chatApi'
import './SeatMapCard.css'

const ROWS = 30
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function parseSeat(seat: string | null): { row: number; letter: string } | null {
  if (!seat) return null
  const m = seat.match(/^(\d+)([A-Fa-f])$/i)
  if (!m) return null
  return { row: parseInt(m[1]), letter: m[2].toUpperCase() }
}

interface Props {
  booking: BookingDetails
  onSeatChange: (newSeat: string) => void
}

export default function SeatMapCard({ booking, onSeatChange }: Props) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [saving, setSaving] = useState(false)

  const current = parseSeat(booking.seatNumber)

  const handleSeatClick = async (row: number, letter: string) => {
    if (!isSelecting || saving) return
    const seatId = `${row}${letter}`
    if (seatId === booking.seatNumber) return

    setSaving(true)
    const ok = await changeSeat(booking.bookingNumber, booking.firstName, booking.lastName, seatId)
    setSaving(false)
    if (ok) {
      onSeatChange(seatId)
      setIsSelecting(false)
    }
  }

  return (
    <div className="seat-card">
      <div className="seat-header">
        <span className="seat-title">Mapa de Assentos</span>
        <span className="seat-badge">{booking.seatNumber ?? '-'}</span>
        {!isSelecting ? (
          <button className="seat-change-btn" onClick={() => setIsSelecting(true)}>
            Trocar
          </button>
        ) : (
          <button className="seat-cancel-btn" onClick={() => setIsSelecting(false)}>
            Cancelar
          </button>
        )}
      </div>

      {isSelecting && (
        <p className="seat-hint">Clique em um assento para trocar</p>
      )}

      <div className="seat-scroll-area">
        <div className="seat-nose">✈ frente</div>

        {/* Column labels */}
        <div className="seat-col-labels">
          <span className="seat-row-num" />
          {LETTERS.map((l) => (
            <span key={l} className={`seat-col-label${l === 'C' ? ' seat-col-aisle-right' : ''}`}>
              {l}
            </span>
          ))}
        </div>

        {/* Seat grid */}
        <div className="seat-grid">
          {Array.from({ length: ROWS }, (_, i) => i + 1).map((row) => (
            <div key={row} className="seat-row">
              <span className="seat-row-num">{row}</span>
              {LETTERS.map((letter) => {
                const isPassenger = current?.row === row && current?.letter === letter
                const seatId = `${row}${letter}`
                return (
                  <button
                    key={letter}
                    disabled={saving}
                    onClick={() => handleSeatClick(row, letter)}
                    className={[
                      'seat-cell',
                      isPassenger ? 'seat-cell--mine' : '',
                      isSelecting && !isPassenger ? 'seat-cell--selectable' : '',
                      letter === 'C' ? 'seat-cell--aisle-right' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    title={isPassenger ? 'Seu assento' : seatId}
                  >
                    {isPassenger ? letter : ''}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="seat-legend">
        <span className="legend-mine" /> Seu assento
        <span className="legend-free" style={{ marginLeft: 12 }} /> Disponível
      </div>
    </div>
  )
}
