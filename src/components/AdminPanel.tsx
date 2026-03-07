import { useEffect, useState } from 'react'
import { BookingDetails, CustomerDTO } from '../types'
import { getBookings, getCustomers } from '../api/chatApi'
import './AdminPanel.css'

export default function AdminPanel() {
  const [bookings, setBookings] = useState<BookingDetails[]>([])
  const [customers, setCustomers] = useState<CustomerDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getBookings(), getCustomers()]).then(([b, c]) => {
      setBookings(b)
      setCustomers(c)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="admin-loading">Carregando…</div>

  return (
    <div className="admin-panel">
      <section>
        <h3 className="admin-title">Clientes</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Nome</th><th>Sobrenome</th></tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td><td>{c.firstName}</td><td>{c.lastName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="admin-title">Reservas</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nº</th><th>Nome</th><th>Sobrenome</th><th>Data</th>
                <th>Origem</th><th>Destino</th><th>Assento</th><th>Classe</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingNumber}>
                  <td>{b.bookingNumber}</td>
                  <td>{b.firstName}</td>
                  <td>{b.lastName}</td>
                  <td>{b.date ? new Date(b.date).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>{b.from}</td>
                  <td>{b.to}</td>
                  <td>{b.seatNumber}</td>
                  <td>{b.bookingClass}</td>
                  <td>
                    <span className={`status-badge status-badge--${b.bookingStatus?.toLowerCase()}`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
