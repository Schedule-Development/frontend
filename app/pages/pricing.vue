<script setup lang="ts">
const { data: page } = await useAsyncData('pricing', () =>
  queryCollection('pricing').first()
)

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

type ButtonProps = {
  label?: string
  color?: string
  variant?: string
  onClick?: () => void
}

type Plan = {
  title: string
  description?: string
  price: PricePeriod
  button?: ButtonProps
  highlight?: boolean
}

// 2. Dados para os CARDS (UPricingPlans)
const router = useRouter()
const cardPlans = computed(() => {
  return page.value?.plans.map((plan: Plan) => {
    const priceValue
      = isYearly.value === '1' ? plan.price.year : plan.price.month
    const handleClick = () => {
      router.push({ path: '/checkout', query: { plan: plan.title.toLowerCase(), cycle: isYearly.value } })
    }
    const buttonObj: ButtonProps = {
      label: plan.button?.label || 'Choose',
      onClick: handleClick,
      color: plan.button?.color || 'primary',
      variant: plan.button?.variant || 'solid'
    }
    return {
      ...plan,
      price: priceValue,
      billingCycle: priceValue.toString().includes('Contact')
        ? ''
        : isYearly.value === '1'
          ? '/year'
          : '/month',
      button: buttonObj
    }
  })
})
</script>

<template>
  <div
    v-if="page"
    class="pricing-page space-y-8 mb-12"
  >
    <UPageHero
      class="pb-8"
      :title="page.title"
      :description="page.description"
    />
    <UDivider label="OR" />

    <UContainer class="-mt-16">
      <div class="flex justify-center -mt-20 mb-4">
        <UTabs
          v-model="isYearly"
          :items="tabItems"
          class="w-48"
        />
      </div>
      <div class="pricing-plans-tight">
        <UPricingPlans
          scale
          :plans="cardPlans"
        />
      </div>
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
