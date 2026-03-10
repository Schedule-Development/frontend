import Stripe from 'stripe'

/**
 * Mapear planos para IDs de preço do Stripe.
 * Preços em BRL (Real Brasileiro) configurados em modo test.
 */
const STRIPE_PRICE_IDS: Record<string, { month: string; year: string }> = {
  starter: {
    month: 'price_1T8ujtEQ3nkeGdclwtA5aic2', // R$ 59.00/mês
    year: 'price_1T8uk7EQ3nkeGdclHqewHXt3'   // R$ 590.00/ano
  },
  professional: {
    month: 'price_1T8ukBEQ3nkeGdcljCR86nli', // R$ 89.00/mês
    year: 'price_1T8ukEEQ3nkeGdclVWtkDzl6'   // R$ 890.00/ano
  },
  team: {
    month: 'price_1T8ukHEQ3nkeGdcl62o7eQT5', // R$ 199.00/mês
    year: 'price_1T8ukKEQ3nkeGdclijISqjSN'   // R$ 1990.00/ano
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripeKey = config.stripeSecretKey || process.env.NUXT_STRIPE_SECRET_KEY || ''
  const stripe = new Stripe(stripeKey, { apiVersion: '2026-02-25.clover' })

  try {
    const body = await readBody(event)
    const { planTitle, cycle, email, userId, organizationId } = body
    const cycleNumber = Number(cycle)

    // Validar inputs
    if (!planTitle || typeof cycle === 'undefined') {
      throw createError({
        statusCode: 400,
        statusMessage: 'planTitle e cycle são obrigatórios'
      })
    }

    const planKey = planTitle.toLowerCase()
    const priceIds = STRIPE_PRICE_IDS[planKey]

    if (!priceIds) {
      throw createError({
        statusCode: 400,
        statusMessage: `Plano não encontrado: ${planTitle}`
      })
    }

    const priceId = cycleNumber === 1 ? priceIds.year : priceIds.month

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      client_reference_id: String(organizationId || ''),
      metadata: {
        planTitle: String(planTitle),
        cycle: cycleNumber === 1 ? 'yearly' : 'monthly',
        userId: userId || 'anonymous',
        organizationId: String(organizationId || '')
      },
      subscription_data: {
        metadata: {
          planTitle: String(planTitle),
          cycle: cycleNumber === 1 ? 'yearly' : 'monthly',
          organizationId: String(organizationId || '')
        }
      },
      // URLs de redirecionamento pós-pagamento
      success_url: `${config.public.frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.public.frontendUrl}/checkout/cancel`
    })

    return { url: session.url }
  } catch (error) {
    console.error('Erro ao criar sessão Stripe:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Erro ao criar sessão de checkout'
    })
  }
})
