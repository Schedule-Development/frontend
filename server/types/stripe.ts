/**
 * Tipos para integração Stripe
 */

export interface CreateCheckoutSessionRequest {
  planTitle: string
  cycle: 0 | 1 // 0 = mensal, 1 = anual
  email?: string
  userId?: string | null
}

export interface CreateCheckoutSessionResponse {
  url: string | null
}

export interface RetrieveSessionRequest {
  sessionId: string
}

export interface RetrieveSessionResponse {
  id: string
  email: string | null
  planTitle?: string
  cycle?: string
  status: string
  paymentMethod?: string
}

export interface UserSubscription {
  userId: string
  email: string
  planTitle: string
  cycle: 'monthly' | 'yearly'
  stripeSessionId: string
  stripeCustomerId: string | null
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  createdAt: Date
  canceledAt?: Date
}

export interface StripeMetadata {
  planTitle: string
  cycle: 'monthly' | 'yearly'
  userId?: string
}
