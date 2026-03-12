import Stripe from 'stripe'

/**
 * Webhook to process Stripe payment events.
 *
 * Handled events:
 * - checkout.session.completed: when a payment succeeds
 * - customer.subscription.updated: when a subscription is renewed/updated
 * - customer.subscription.deleted: when a subscription is cancelled
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2026-02-25.clover' })

  try {
    // Read raw webhook body
    const body = await readRawBody(event)
    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Empty body'
      })
    }

    // Verify webhook signature using the secret
    const signature = getHeader(event, 'stripe-signature')
    if (!signature) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Webhook signature not found'
      })
    }

    let stripeEvent: Stripe.Event
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        body,
        signature,
        config.stripeWebhookSecret
      )
    } catch (err) {
      console.error('Error verifying webhook signature:', err)
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid webhook signature'
      })
    }

    console.log(`[Webhook] Evento recebido: ${stripeEvent.type}`)

    // Processar evento
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(config, stripeEvent.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object as Stripe.Subscription)
        break

      default:
        console.log(`[Webhook] Evento ${stripeEvent.type} ignorado`)
    }

    return { received: true }
  } catch (error) {
    console.error('[Webhook] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Error processing webhook'
    })
  }
})

/**
 * Processa checkout.session.completed
 * - Usuário completou o pagamento
 * - Criar conta ou registrar inscrição no banco de dados
 * - Enviar email de confirmação
 */
async function handleCheckoutSessionCompleted(config: ReturnType<typeof useRuntimeConfig>, session: Stripe.Checkout.Session) {
  try {
    console.log(`[Checkout] Session completed: ${session.id}`)
    console.log(`[Checkout] Email: ${session.customer_email}`)
    console.log(`[Checkout] Metadata:`, session.metadata)

    let planTitle = session.metadata?.planTitle
    let cycle = session.metadata?.cycle
    let userId = session.metadata?.userId
    let organizationId = session.metadata?.organizationId || session.client_reference_id || undefined
    const email = session.customer_email

    // Se metadata incompleto na session, buscar na subscription
    if ((!planTitle || !cycle || !organizationId) && session.subscription) {
      console.log('[Stripe Webhook] Metadata incompleto na session, buscando na subscription...')
      const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2026-02-25.clover' })
      const subscription = await stripe.subscriptions.retrieve(String(session.subscription))

      planTitle = planTitle || subscription.metadata?.planTitle
      cycle = cycle || subscription.metadata?.cycle
      organizationId = organizationId || subscription.metadata?.organizationId

      console.log('[Stripe Webhook] Metadata recuperado da subscription:', {
        planTitle,
        cycle,
        organizationId
      })
    }

    if (!email || !planTitle) {
      console.warn('[Checkout] Session missing email/metadata (common in stripe triggers). Event ignored without fatal error.')
      return
    }

    const payload = {
      provider: 'stripe',
      event: 'checkout.session.completed',
      email,
      planTitle,
      cycle,
      userId,
      organizationId,
      stripeSessionId: session.id,
      stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
      stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : null,
      amountTotal: session.amount_total,
      currency: session.currency
    }

    await relayToNodix(config, payload)

  } catch (error) {
    console.error('[Checkout] Error processing completed session:', error)
    throw error
  }
}

/**
 * Processa customer.subscription.updated
 * - Assinatura foi renovada, cancelada, plano alterado, etc
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log(`[Subscription] Updated: ${subscription.id}`)
    console.log(`[Subscription] Status: ${subscription.status}`)

    // TODO: Implementar lógica
    // 1. Buscar usuário associado ao subscription
    // 2. Atualizar status da inscrição no banco
    // 3. Enviar email se houver mudança importante

  } catch (error) {
    console.error('[Subscription] Error processing update:', error)
  }
}

/**
 * Processa customer.subscription.deleted
 * - Usuário cancelou a assinatura
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log(`[Subscription] Deleted: ${subscription.id}`)

    // TODO: Implementar lógica
    // 1. Marcar inscrição como cancelada no banco
    // 2. Enviar email de confirmação de cancelamento
    // 3. Adicionar à lista de re-engagement

  } catch (error) {
    console.error('[Subscription] Error processing deletion:', error)
  }
}

async function relayToNodix(config: ReturnType<typeof useRuntimeConfig>, payload: Record<string, unknown>) {
  if (!config.nodixStripeWebhookUrl) {
    console.log('[Webhook] NUXT_NODIX_STRIPE_WEBHOOK_URL not configured. Processing payload locally.')
    return
  }

  try {
    await $fetch(config.nodixStripeWebhookUrl, {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.nodixApiToken}`
      }
    })
    console.log('[Webhook] Payload sent to Nodix successfully')
  } catch (error) {
    console.error('[Webhook] Failed to send payload to Nodix:', error)
    throw error
  }
}
