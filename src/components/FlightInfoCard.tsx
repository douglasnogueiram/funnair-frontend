import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { BookingDetails } from '../types'
import './FlightInfoCard.css'

// Fix Leaflet default icon in Vite builds
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl })

const AIRPORTS: Record<string, [number, number]> = {
  LAX: [33.9425, -118.4081],
  JFK: [40.6413, -73.7781],
  SFO: [37.6213, -122.379],
  LHR: [51.47, -0.4543],
  CDG: [49.0097, 2.5479],
  FRA: [50.0379, 8.5622],
  MAD: [40.4983, -3.5676],
}

const CITY: Record<string, string> = {
  LAX: 'Los Angeles', JFK: 'Nova York', SFO: 'São Francisco',
  LHR: 'Londres', CDG: 'Paris', FRA: 'Frankfurt', MAD: 'Madri',
}

function makeIcon(code: string, type: 'origin' | 'dest') {
  const bg = type === 'origin' ? '#1a3a5c' : '#f0a500'
  const color = type === 'origin' ? '#fff' : '#1a3a5c'
  return L.divIcon({
    html: `<div style="background:${bg};color:${color};padding:2px 7px;border-radius:4px;font-size:11px;font-weight:700;white-space:nowrap;">${code}</div>`,
    className: '',
    iconAnchor: [20, 10],
  })
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length === 2) {
      map.fitBounds(positions, { padding: [30, 30] })
    }
  }, [map, positions])
  return null
}

interface Props { booking: BookingDetails }

export default function FlightInfoCard({ booking }: Props) {
  const from = booking.from?.toUpperCase() ?? ''
  const to   = booking.to?.toUpperCase() ?? ''
  const fromCoord = AIRPORTS[from]
  const toCoord   = AIRPORTS[to]

  const formattedDate = booking.date
    ? new Date(booking.date).toLocaleDateString('pt-BR')
    : '-'

  const statusColor =
    booking.bookingStatus === 'CONFIRMED' ? '#2e7d32' :
    booking.bookingStatus === 'CANCELLED' ? '#c62828' : '#555'

  return (
    <div className="flight-card">
      {/* Route header */}
      <div className="route-header">
        <div className="airport">
          <span className="airport-code">{from}</span>
          <span className="airport-city">{CITY[from] ?? from}</span>
        </div>
        <div className="route-arrow">──✈──</div>
        <div className="airport airport--right">
          <span className="airport-code">{to}</span>
          <span className="airport-city">{CITY[to] ?? to}</span>
        </div>
      </div>

      {/* Leaflet map */}
      {fromCoord && toCoord && (
        <div className="map-wrap">
          <MapContainer
            key={`${from}-${to}`}
            center={[0, 0]}
            zoom={2}
            style={{ height: '200px', width: '100%' }}
            zoomControl={true}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={fromCoord} icon={makeIcon(from, 'origin')} />
            <Marker position={toCoord}   icon={makeIcon(to, 'dest')} />
            <Polyline
              positions={[fromCoord, toCoord]}
              pathOptions={{ color: '#1a3a5c', weight: 2, dashArray: '6 4' }}
            />
            <FitBounds positions={[fromCoord, toCoord]} />
          </MapContainer>
        </div>
      )}

      {/* Details */}
      <div className="flight-details">
        <span><b>Data:</b> {formattedDate}</span>
        <span><b>Classe:</b> {booking.bookingClass ?? '-'}</span>
        <span><b>Assento:</b> {booking.seatNumber ?? '-'}</span>
      </div>
      <div className="flight-status" style={{ color: statusColor }}>
        Status: {booking.bookingStatus ?? '-'}
      </div>
    </div>
  )
}
