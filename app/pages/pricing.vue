<script setup lang="ts">
const { data: page } = await useAsyncData('pricing', () => queryCollection('pricing').first())

// --- SEO ---
const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

// --- Lógica de Estado ---
const isYearly = ref('0')
const tabItems = [
  { label: 'Monthly', value: '0' },
  { label: 'Yearly', value: '1' }
]

type PricePeriod = { month: string, year: string }
type Plan = {
  title: string
  description?: string
  price: PricePeriod
  button?: Record<string, unknown>
  highlight?: boolean
}

// 2. Dados para os CARDS (UPricingPlans)
const cardPlans = computed(() => {
  return page.value?.plans.map((plan: Plan) => {
    const priceValue = isYearly.value === '1' ? plan.price.year : plan.price.month
    return {
      ...plan,
      price: priceValue,
      billingCycle: priceValue.toString().includes('Contact') ? '' : (isYearly.value === '1' ? '/year' : '/month')
    }
  })
})
</script>

<template>
  <div
    v-if="page"
    class="space-y-24 mb-24"
  >
    <UPageHero
      :title="page.title"
      :description="page.description"
    />
    <UDivider label="OR" />

    <UContainer>
      <div class="flex justify-center -mt-8 mb-6">
        <UTabs
          v-model="isYearly"
          :items="tabItems"
          class="w-48"
        />
      </div>
      <UPricingPlans
        scale
        :plans="cardPlans"
      />
    </UContainer>

    <UPageSection
      :title="page.faq.title"
      :description="page.faq.description"
    >
      <UAccordion
        :items="page.faq.items"
        class="max-w-3xl mx-auto"
      />
    </UPageSection>
  </div>
</template>
