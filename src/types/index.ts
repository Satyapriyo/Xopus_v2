export interface User {
  id: string
  wallet_address: string
  credits: number
  total_spent: number
  created_at: string
  updated_at: string
}

export interface Query {
  id: string
  user_id: string
  question: string
  answer: string
  cost: number
  payment_hash?: string
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  transaction_hash: string
  status: 'pending' | 'confirmed' | 'failed'
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  cost?: number
  paymentRequired?: boolean
}