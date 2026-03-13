<script setup lang="ts">
import { ref } from 'vue'

// --- SEO ---
useSeoMeta({
  title: 'Transparent plans for elite barbers',
  description: 'No hidden fees. Choose the ideal plan to boost your barbershop today.'
})

// --- Toggle mensal / anual ---
const isYearly = ref(false)
const clickingPlan = ref<number | null>(null)

// --- Buscar planos do Stripe (client-side only, evita falha de SSR/prerender) ---
const { data: stripeData, pending } = await useFetch('/api/stripe/plans', {
  server: false,
  default: () => ({ plans: [] })
})

// --- Fallback: planos estáticos do content (caso Stripe não esteja configurado) ---
const { data: contentPage } = await useAsyncData('pricing-content', () =>
  queryCollection('pricing').first()
)

type StripePrice = {
  id: string
  currency: string
  amount: number
  interval: 'month' | 'year'
  intervalCount: number
}

type StripePlan = {
  id: string
  name: string
  description: string | null
  prices: StripePrice[]
  marketing_features?: string[]
  metadata: Record<string, string>
  highlight: boolean
  highlight_text?: string
}

// Decide se usa Stripe ou fallback estático
const useStripePlans = computed(() => {
  return (stripeData.value?.plans?.length ?? 0) > 0
})

const stripePlans = computed<StripePlan[]>(() => stripeData.value?.plans ?? [])

// Retorna o preço formatado para o plano Stripe
function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount / 100)
}

function getStripePrice(plan: StripePlan) {
  const interval = isYearly.value ? 'year' : 'month'
  const price = plan.prices.find(p => p.interval === interval)
  if (!price) {
    // fallback para o primeiro preço disponível
    const fallback = plan.prices[0]
    return fallback ? formatAmount(fallback.amount, fallback.currency) : '—'
  }
  return formatAmount(price.amount, price.currency)
}

function getStripePeriod() {
  return isYearly.value ? 'ano' : 'mês'
}

function getPlanFeatures(plan: StripePlan): string[] {
  // 1. Prioriza marketing_features (campo oficial do Stripe)
  if (plan.marketing_features && plan.marketing_features.length > 0) {
    return plan.marketing_features
  }

  // 2. Fallback: features no metadata: feature1, feature2...
  const features: string[] = []
  let i = 1
  while (plan.metadata[`feature${i}`] != null) {
    const feat = plan.metadata[`feature${i}`]
    if (feat) features.push(feat)
    i++
  }
  if (features.length > 0) return features

  // 3. Fallback: metadata.features separado por |
  if (plan.metadata.features) {
    return plan.metadata.features.split('|').map(f => f.trim())
  }
  return []
}

// --- Fallback content (YAML) ---
function getContentDisplayPrice(plan: { price: { month: string | number; year: string | number } }) {
  return isYearly.value ? plan.price.year : plan.price.month
}

// --- Click nos planos → google.com ---
const openGoogle = () => {
  window.open('https://google.com', '_blank')
}

const handlePlanClick = async (index: number) => {
  clickingPlan.value = index
  await new Promise(r => setTimeout(r, 150))
  openGoogle()
  clickingPlan.value = null
}

// --- Animações ---
const baseMotion = {
  initial: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 900, easing: [0.16, 1, 0.3, 1] } }
}

const cardMotion = (index: number) => ({
  initial: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1100,
      delay: 200 + (index * 120),
      easing: [0.16, 1, 0.3, 1]
    }
  }
})
</script>


<style scoped>
/* Transição do preço: desliza para cima ao sair, vem de baixo ao entrar */
.price-enter-active {
  transition: all 380ms cubic-bezier(0.22, 1, 0.36, 1);
}
.price-leave-active {
  transition: all 220ms cubic-bezier(0.4, 0, 1, 1);
}
.price-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.96);
  filter: blur(3px);
}
.price-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.96);
  filter: blur(3px);
}
.price-enter-to,
.price-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

/* Fade para o badge "Save 2 months" */
.fade-enter-active {
  transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-leave-active {
  transition: all 180ms ease-in;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-6px) scale(0.95);
}
</style>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#0B1F3A] font-sans selection:bg-[#FF6A00] selection:text-white pt-24 pb-20 text-white">
    <div class="absolute inset-0 pointer-events-none -z-10" style="background: radial-gradient(600px circle at 50% 30%, rgba(59,130,246,0.06), transparent 60%);" />

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <!-- Hero Header -->
      <div class="text-center max-w-3xl mx-auto mb-20 mt-10">
        <h1
          v-motion
          :initial="baseMotion.initial"
          :visible-once="baseMotion.visible"
          class="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6"
        >
          {{ contentPage?.title || 'Transparent plans for elite barbers' }}
        </h1>
        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 100, easing: [0.16, 1, 0.3, 1] } }"
          class="text-lg md:text-xl text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto"
        >
          No hidden fees. Choose the ideal plan to boost your barbershop today.
        </p>

        <!-- Toggle Mensal / Anual -->
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.96, y: 14 }"
          :visible-once="{ opacity: 1, scale: 1, y: 0, transition: { duration: 1000, delay: 200, easing: [0.16, 1, 0.3, 1] } }"
          class="mt-14 flex items-center justify-center gap-4"
        >
          <span :class="['text-sm font-semibold transition-colors duration-400', !isYearly ? 'text-white' : 'text-gray-400']">Monthly</span>

          <button
            class="relative inline-flex h-8 w-16 items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            style="transition: all var(--duration-fast) var(--ease-indie);"
            :class="isYearly ? 'bg-[#FF6A00]' : 'bg-[#1F2937] border border-white/10'"
            @click="isYearly = !isYearly"
            aria-label="Toggle billing period"
          >
            <span
              class="inline-block h-6 w-6 transform rounded-full bg-white shadow-sm"
              style="transition: all var(--duration-fast) var(--ease-indie);"
              :class="isYearly ? 'translate-x-[34px]' : 'translate-x-[2px]'"
            />
          </button>

          <div class="relative flex items-center gap-3">
            <span :class="['text-sm font-semibold transition-colors duration-400', isYearly ? 'text-white' : 'text-gray-400']">Yearly</span>
            <Transition name="fade">
              <div v-if="isYearly" class="absolute left-full ml-4 w-max">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold whitespace-nowrap border border-blue-100 shadow-sm relative group cursor-default transition-transform hover:scale-105">
                  <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5" />
                  Save 2 months
                </span>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- === LOADING === -->
      <div v-if="pending" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin" />
          <p class="text-gray-400 text-sm">Loading plans from Stripe...</p>
        </div>
      </div>

      <!-- === ERRO no fetch Stripe (fallback silencioso) === -->

      <!-- === PLANOS DO STRIPE === -->
      <div v-if="!pending && useStripePlans" class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative px-4 md:px-0">
        <template v-for="(plan, index) in stripePlans" :key="plan.id">
          <div
            v-motion
            :initial="cardMotion(index).initial"
            :visible-once="cardMotion(index).visible"
            :class="[
              'relative group rounded-3xl transition-all duration-500 flex flex-col',
              plan.highlight
                ? 'z-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-gray-200/50 hover:-translate-y-0.5'
                : 'mt-0 hover:-translate-y-0.5 shadow-sm hover:shadow-md'
            ]"
          >
            <div
              :class="[
                'relative h-full p-8 md:p-10 rounded-3xl flex flex-col transition-all duration-400',
                'bg-[#1F2937]/50 backdrop-blur-md border border-white/10 text-white'
              ]"
            >
              <!-- Selo de Destaque -->
              <div
                v-if="plan.highlight"
                class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group-hover:scale-105 transition-transform duration-300"
              >
                <span class="bg-[#1F1F20] text-white text-[11px] tracking-widest uppercase font-bold px-4 py-1.5 rounded-full shadow-sm border border-gray-700 relative overflow-hidden flex items-center justify-center">
                  <span class="relative z-10">{{ plan.highlight_text || 'Most Popular' }}</span>
                </span>
              </div>

              <!-- Nome e descrição -->
              <div class="mb-10 relative z-10">
                <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-[#FF6A00] transition-colors">
                  {{ plan.name }}
                </h3>
                <p class="text-sm text-gray-400 min-h-[2.5rem] leading-relaxed md:w-11/12">
                  {{ plan.description || '' }}
                </p>
              </div>

              <!-- Preço com transição -->
              <div class="mb-10 flex items-baseline gap-2 relative z-10 h-16">
                <div class="overflow-hidden flex items-baseline min-w-[120px]">
                  <Transition name="price" mode="out-in">
                    <h4 :key="isYearly ? 'yearly' : 'monthly'" class="text-5xl font-extrabold tracking-tight text-white transition-colors">
                      {{ getStripePrice(plan) }}
                    </h4>
                  </Transition>
                  <span class="text-gray-400 font-medium text-lg ml-2">/ {{ getStripePeriod() }}</span>
                </div>
              </div>

              <!-- Features dos metadados -->
              <div class="flex-1 relative z-10 w-full">
                <ul class="space-y-4 mb-10">
                  <li
                    v-for="(feature, i) in getPlanFeatures(plan)"
                    :key="i"
                    class="flex items-start gap-4 group/item"
                  >
                    <div class="mt-0.5 rounded-full p-1 shrink-0 flex items-center justify-center text-[#FF6A00] bg-orange-500/10 transition-transform duration-400 group-hover/item:scale-110">
                      <UIcon name="i-heroicons-check-solid" class="w-3.5 h-3.5" />
                    </div>
                    <span class="text-[15px] font-medium text-gray-300">{{ feature }}</span>
                  </li>
                  <!-- Fallback se não há features nos metadados -->
                  <li v-if="getPlanFeatures(plan).length === 0" class="text-gray-500 text-sm italic">
                    See all features after subscription.
                  </li>
                </ul>
              </div>

              <!-- Botão -->
              <div class="pt-4 relative z-10 w-full mt-auto">
                <UButton
                  block
                  size="xl"
                  class="rounded-xl tracking-wide transition-all duration-400 w-full h-[52px] flex justify-center items-center"
                  :class="[
                    plan.highlight
                      ? 'bg-[#FF6A00] hover:bg-[#FF8533] text-white font-semibold shadow-[0_4px_14px_rgba(255,106,0,0.15)] hover:shadow-[0_6px_20px_rgba(255,106,0,0.25)] hover:-translate-y-0.5 border-none'
                      : 'bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 shadow-sm hover:-translate-y-0.5',
                    clickingPlan === index ? 'scale-[0.97]' : ''
                  ]"
                  @click="handlePlanClick(index)"
                >
                  {{ plan.metadata.button_label || (plan.highlight ? 'Get Started' : `Choose ${plan.name}`) }}
                </UButton>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- === FALLBACK: PLANOS ESTÁTICOS DO YAML === -->
      <div v-else-if="!pending && !useStripePlans && contentPage?.plans" class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative px-4 md:px-0">
        <template v-for="(plan, index) in contentPage.plans" :key="index">
          <div
            v-motion
            :initial="cardMotion(index).initial"
            :visible-once="cardMotion(index).visible"
            :class="[
              'relative group rounded-3xl transition-all duration-500 flex flex-col',
              plan.highlight ? 'z-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-gray-200/50 hover:-translate-y-0.5' : 'mt-0 hover:-translate-y-0.5 shadow-sm hover:shadow-md'
            ]"
          >
            <div class="relative h-full p-8 md:p-10 rounded-3xl flex flex-col transition-all duration-400 bg-[#1F2937]/50 backdrop-blur-md border border-white/10 text-white">
              <div v-if="plan.highlight" class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group-hover:scale-105 transition-transform duration-300">
                <span class="bg-[#1F1F20] text-white text-[11px] tracking-widest uppercase font-bold px-4 py-1.5 rounded-full shadow-sm border border-gray-700 flex items-center">
                  {{ (plan as any).highlight_text || 'Premium' }}
                </span>
              </div>

              <div class="mb-10 relative z-10">
                <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-[#FF6A00] transition-colors">{{ plan.title }}</h3>
                <p class="text-sm text-gray-400 h-10 leading-relaxed md:w-11/12">{{ plan.description }}</p>
              </div>

              <div class="mb-10 flex items-baseline gap-2 relative z-10 h-16">
                <div class="overflow-hidden flex items-baseline min-w-[120px]">
                  <Transition name="price" mode="out-in">
                    <h4 :key="isYearly ? 'yearly' : 'monthly'" class="text-5xl font-extrabold tracking-tight text-white">
                      {{ getContentDisplayPrice(plan) }}
                    </h4>
                  </Transition>
                  <span class="text-gray-400 font-medium text-lg ml-2">/ {{ isYearly ? 'year' : 'month' }}</span>
                </div>
              </div>

              <div class="flex-1 relative z-10 w-full">
                <ul class="space-y-4 mb-10">
                  <li v-for="(feature, i) in plan.features" :key="i" class="flex items-start gap-4 group/item">
                    <div class="mt-0.5 rounded-full p-1 shrink-0 flex items-center justify-center text-[#FF6A00] bg-orange-500/10 transition-transform duration-400 group-hover/item:scale-110">
                      <UIcon name="i-heroicons-check-solid" class="w-3.5 h-3.5" />
                    </div>
                    <span class="text-[15px] font-medium text-gray-300">{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <div class="pt-4 relative z-10 w-full mt-auto">
                <UButton
                  block size="xl"
                  class="rounded-xl tracking-wide transition-all duration-400 w-full h-[52px] flex justify-center items-center"
                  :class="[
                    plan.highlight
                      ? 'bg-[#FF6A00] hover:bg-[#FF8533] text-white font-semibold shadow-[0_4px_14px_rgba(255,106,0,0.15)] hover:shadow-[0_6px_20px_rgba(255,106,0,0.25)] hover:-translate-y-0.5 border-none'
                      : 'bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 shadow-sm hover:-translate-y-0.5',
                    clickingPlan === index ? 'scale-[0.97]' : ''
                  ]"
                  @click="handlePlanClick(index)"
                >
                  {{ plan.button.label }}
                </UButton>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Microcopy de confiança -->
      <div
        v-if="!pending"
        v-motion
        :initial="{ opacity: 0, y: 18 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 500, easing: [0.16, 1, 0.3, 1] } }"
        class="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-[13px] sm:text-sm font-medium text-[#6B7280]"
      >
        <div class="flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 duration-400 cursor-default">
          <div class="text-gray-400"><UIcon name="i-heroicons-arrow-path" class="w-4 h-4" /></div>
          Cancel anytime
        </div>
        <div class="flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 duration-400 cursor-default">
          <div class="text-gray-400"><UIcon name="i-heroicons-lock-closed" class="w-4 h-4" /></div>
          Secure payment
        </div>
        <div v-if="useStripePlans" class="flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 duration-400 cursor-default">
          <div class="text-gray-400"><UIcon name="i-simple-icons-stripe" class="w-4 h-4" /></div>
          Powered by Stripe
        </div>
      </div>

      <!-- FAQ -->
      <div
        v-if="contentPage?.faq && !pending"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, easing: [0.16, 1, 0.3, 1] } }"
        class="mt-32 max-w-3xl mx-auto px-4 md:px-0"
      >
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-white tracking-tight mb-3">
            {{ contentPage.faq.title || 'Frequently Asked Questions' }}
          </h2>
          <p class="text-gray-400 text-lg">{{ contentPage.faq.description || '' }}</p>
        </div>
        <div class="divide-y divide-white/10">
          <div
            v-for="(faqItem, fi) in contentPage.faq.items ?? []"
            :key="fi"
            class="py-5"
          >
            <p class="text-white font-medium mb-2">{{ faqItem.label }}</p>
            <p class="text-gray-400 text-sm leading-relaxed">{{ faqItem.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
