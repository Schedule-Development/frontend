import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripeKey = config.stripeSecretKey || process.env.NUXT_STRIPE_SECRET_KEY || ''
  const stripe = new Stripe(stripeKey, { apiVersion: '2026-02-25.clover' })

  try {
    const body = await readBody(event)
    const { sessionId } = body

    if (!sessionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'sessionId é obrigatório'
      })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return {
      id: session.id,
      email: session.customer_email,
      planTitle: session.metadata?.planTitle,
      cycle: session.metadata?.cycle,
      status: session.payment_status,
      paymentMethod: session.payment_method_types?.[0]
    }
  } catch (error) {
    console.error('Erro ao recuperar sessão:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Erro ao recuperar sessão'
    })
  }
})
