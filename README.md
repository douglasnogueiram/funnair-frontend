# Funnair Frontend ✈️

React chat interface for the Funnair AI flight booking assistant. Features a real-time chat with the AI agent, a live booking context panel, interactive seat map, and an admin panel for browsing bookings and transactions.

---

## Screenshots

The UI consists of two main areas:

- **Chat panel** — Conversational interface with the AI assistant
- **Context panel** — Real-time booking details, seat map, and payment transaction history (appears automatically when a booking is referenced)

---

## Features

- Real-time streaming chat with the AI agent
- Automatic booking context panel (updates as the conversation progresses)
- Interactive seat map (30 rows × 6 columns)
- Flight route visualization with Leaflet maps
- Payment transaction history per booking
- Admin panel: browse all bookings and customers
- Responsive layout (mobile drawer for context panel)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 · TypeScript |
| Build | Vite 5 |
| Maps | React Leaflet · Leaflet |
| Styling | Plain CSS (no framework) |
| Production server | Nginx (Alpine) |
| Container | Docker multi-stage build |

---

## Getting Started

This frontend is designed to run as part of the full Funnair stack. See **[funnair-backend](https://github.com/douglasnogueiram/funnair-backend)** for the complete Docker Compose setup.

### Run with Docker Compose (recommended)

```bash
# From funnair-backend directory
docker compose up --build
```

UI available at: **http://localhost:3001**

### Run locally (development)

```bash
npm install
npm run dev
```

UI available at: **http://localhost:5173**

> Requires the backend running on `http://localhost:8080`

---

## Environment & Proxy

### Development (Vite dev server)
The Vite proxy in `vite.config.ts` forwards all `/api/*` calls to the backend at `localhost:8080` with Basic Auth credentials injected automatically.

### Production (Docker / Nginx)
Nginx handles the proxy. The config in `nginx.conf` forwards `/api/*` to `http://funnair-backend:8080` with the required Authorization header.

No `.env` file is needed — the backend URL is resolved via Docker networking in production.

---

## Project Structure

```
funnair-frontend/
├── src/
│   ├── api/
│   │   └── chatApi.ts          # API calls to backend
│   ├── components/
│   │   ├── ChatPanel.tsx        # Message list + input
│   │   ├── ContextPanel.tsx     # Booking details sidebar
│   │   ├── FlightInfoCard.tsx   # Route map (Leaflet)
│   │   ├── SeatMapCard.tsx      # Interactive seat map
│   │   ├── PaymentInfoCard.tsx  # Transaction history
│   │   ├── AdminPanel.tsx       # Bookings / customers table
│   │   └── Header.tsx           # App header
│   ├── hooks/
│   │   └── useChat.ts           # Chat state management
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── App.tsx                  # Root component + tab routing
│   └── main.tsx                 # Entry point
├── nginx.conf                   # Production Nginx config
├── Dockerfile                   # Multi-stage build (node → nginx)
└── vite.config.ts               # Dev server + proxy config
```

---

## API Integration

The frontend communicates with the backend via two endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/message` | POST | Send a message, receive AI response |
| `/api/chat/bookings` | GET | Fetch all bookings (admin panel) |
| `/api/chat/customers` | GET | Fetch all customers (admin panel) |
| `/api/chat/transactions/{bookingNumber}` | GET | Fetch transactions for a booking |

The chat endpoint returns structured data alongside the text response, allowing the UI to automatically update the booking context panel.

---

## Chat Flow

```
User types message
       │
       ▼
POST /api/chat/message
       │
       ▼
Response: { message, booking?, recentTransaction? }
       │
       ├─ message ──► Appended to chat panel
       ├─ booking ──► Context panel updated with booking details
       └─ recentTransaction ──► Payment info card shown
```

---

## Related Repositories

- [funnair-backend](https://github.com/douglasnogueiram/funnair-backend) — AI backend + Docker Compose + full setup guide
- [funnair-payment-service](https://github.com/douglasnogueiram/funnair-payment-service) — MCP payment server

---

## License

MIT
