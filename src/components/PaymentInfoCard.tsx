import { PaymentTransactionDTO } from '../types'
import './PaymentInfoCard.css'

interface Props { transaction: PaymentTransactionDTO }

export default function PaymentInfoCard({ transaction: tx }: Props) {
  const isSuccess = tx.paymentStatus === 'SUCCESS'
  const isFailed  = tx.paymentStatus === 'FAILED'

  const formattedDate = tx.transactionDate
    ? new Date(tx.transactionDate).toLocaleString('pt-BR')
    : '-'

  const amount = tx.amount != null
    ? tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '-'

  return (
    <div className={`payment-card ${isSuccess ? 'payment-card--success' : isFailed ? 'payment-card--failed' : ''}`}>
      <div className="payment-title">💳 Transação Registrada</div>
      <div className="payment-row">
        <span><b>Tipo:</b> {tx.transactionType ?? '-'}</span>
        <span><b>Valor:</b> {amount}</span>
      </div>
      <div className="payment-row">
        <span><b>Cartão:</b> {tx.cardLastFour ? `**** ${tx.cardLastFour}` : '-'}</span>
        <span
          className={`payment-status ${isSuccess ? 'payment-status--ok' : isFailed ? 'payment-status--fail' : ''}`}
        >
          {tx.paymentStatus ?? '-'}
        </span>
      </div>
      <div className="payment-date">{formattedDate}</div>
    </div>
  )
}
