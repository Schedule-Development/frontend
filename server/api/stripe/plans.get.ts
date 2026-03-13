import Stripe from 'stripe'

export interface StripePlan {
  id: string
  name: string
  description: string | null
  prices: {
    id: string
    currency: string
    amount: number
    interval: 'month' | 'year'
    intervalCount: number
  }[]
  metadata: Record<string, string>
  highlight: boolean
  highlight_text?: string
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const stripeKey = config.stripeSecretKey || process.env.NUXT_STRIPE_SECRET_KEY || ''

  if (!stripeKey || stripeKey.length < 10) {
    // Retorna planos estáticos quando não há chave Stripe configurada
    return { plans: [] }
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2026-02-25.clover' })

  try {
    // Busca todos os produtos ativos com as preços associados
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    })

    // Busca todos os preços ativos
    const prices = await stripe.prices.list({
      active: true,
      type: 'recurring',
      limit: 100
    })

    const plans: StripePlan[] = products.data
      .filter(p => p.active)
      .map(product => {
        const productPrices = prices.data
          .filter(price => price.product === product.id)
          .map(price => ({
            id: price.id,
            currency: price.currency,
            amount: price.unit_amount ?? 0,
            interval: price.recurring!.interval as 'month' | 'year',
            intervalCount: price.recurring!.interval_count
          }))
          .sort((a, b) => {
            // mensal antes de anual
            const order = { month: 0, year: 1 }
            return (order[a.interval] ?? 2) - (order[b.interval] ?? 2)
          })

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          prices: productPrices,
          marketing_features: product.marketing_features?.map(f => f.name) || [],
          metadata: product.metadata as Record<string, string>,
          highlight: product.metadata.highlight === 'true',
          highlight_text: product.metadata.highlight_text || undefined
        }
      })
      // Ordenar pela ordem definida nos metadados, ou por preço mensal
      .sort((a, b) => {
        const orderA = parseInt(a.metadata.order ?? '99')
        const orderB = parseInt(b.metadata.order ?? '99')
        if (orderA !== orderB) return orderA - orderB
        const priceA = a.prices.find(p => p.interval === 'month')?.amount ?? 0
        const priceB = b.prices.find(p => p.interval === 'month')?.amount ?? 0
        return priceA - priceB
      })

    return { plans }
  } catch (error) {
    // Nunca lança 500 — retorna array vazio para o fallback estático funcionar
    console.error('[Stripe Plans] Error fetching plans:', error)
    return {
      plans: [],
      error: error instanceof Error ? error.message : 'Error fetching Stripe plans'
    }
  }
})
