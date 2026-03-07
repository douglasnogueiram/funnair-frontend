export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface BookingDetails {
  bookingNumber: string
  firstName: string
  lastName: string
  date: string
  bookingStatus: string
  from: string
  to: string
  seatNumber: string
  bookingClass: string
}

export interface CustomerDTO {
  id: number
  firstName: string
  lastName: string
}

export interface PaymentTransactionDTO {
  id: number
  transactionType: string
  paymentId: string
  cardLastFour: string
  amount: number
  paymentStatus: string
  transactionDate: string
}
