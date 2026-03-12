<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({ title: 'Choose your plan' })

const router = useRouter()
const isYearly = ref(false)

const { data: pricePage } = await useAsyncData('pricing-plans', () =>
  queryCollection('pricing').first()
)

type Plan = {
  title: string
  description: string
  price: { month: string; year: string }
  highlight?: boolean
  highlight_text?: string
  features: string[]
  button: { label: string; variant?: string }
}

const plans = computed<Plan[]>(() => pricePage.value?.plans ?? [])

const getPrice = (plan: Plan) => isYearly.value ? plan.price.year : plan.price.month

function selectPlan(plan: Plan) {
  router.push(`/checkout?plan=${plan.title.toLowerCase()}&cycle=${isYearly.value ? '1' : '0'}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#0B1F3A] flex flex-col items-center justify-center px-4 py-16 selection:bg-[#FF6A00] selection:text-white relative overflow-hidden">
    <!-- Subtle Background Glow -->
    <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FF6A00]/5 blur-[120px] rounded-full pointer-events-none" />
    <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#2B4C7E]/10 blur-[120px] rounded-full pointer-events-none" />

    <!-- Header -->
    <div class="text-center mb-10 max-w-xl relative z-10">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
        <UIcon name="i-lucide-check-circle" class="size-3.5" />
        Account created successfully!
      </div>
      <h1 class="text-3xl font-bold text-white mb-2">Now, choose your plan</h1>
      <p class="text-gray-400 text-sm md:text-base">No hidden fees. Select the plan that fits your business.</p>
    </div>

    <!-- Billing toggle -->
    <div class="flex items-center gap-3 mb-12 relative z-10">
      <span :class="['text-sm font-medium transition-colors', !isYearly ? 'text-white' : 'text-gray-400']">Monthly</span>
      <button
        class="relative w-12 h-6 rounded-full transition-colors duration-200"
        :class="isYearly ? 'bg-[#FF6A00]' : 'bg-[#1F2937] border border-white/10'"
        @click="isYearly = !isYearly"
      >
        <span
          class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
          :class="isYearly ? 'translate-x-6' : 'translate-x-0'"
        />
      </button>
      <span :class="['text-sm font-medium transition-colors', isYearly ? 'text-white' : 'text-gray-400']">Yearly</span>
      <span v-if="isYearly" class="text-xs px-2.5 py-0.5 bg-blue-500/10 text-blue-400 font-bold rounded-full border border-blue-500/20">Save 2 months</span>
    </div>

    <!-- Plan cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl relative z-10">
      <div
        v-for="plan in plans"
        :key="plan.title"
        :class="[
          'relative flex flex-col rounded-3xl border p-8 cursor-pointer transition-all duration-300 group',
          plan.highlight
            ? 'bg-[#1F2937]/60 border-[#FF6A00]/50 text-white shadow-[0_20px_40px_-15px_rgba(255,106,0,0.15)] scale-[1.03]'
            : 'bg-[#1F2937]/40 border-white/5 text-white hover:border-white/10 hover:shadow-xl'
        ]"
        @click="selectPlan(plan)"
      >
        <!-- Highlight badge -->
        <div
          v-if="plan.highlight_text"
          class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#FF6A00] text-white text-[10px] font-black rounded-full shadow-lg whitespace-nowrap tracking-widest uppercase"
        >
          {{ plan.highlight_text }}
        </div>

        <div class="mb-4">
          <h2 class="text-xl font-extrabold mb-1 truncate">{{ plan.title }}</h2>
          <p class="text-gray-400 text-xs leading-relaxed line-clamp-2 h-8">{{ plan.description }}</p>
        </div>

        <div class="mb-8">
          <span class="text-4xl font-black text-white">{{ getPrice(plan) }}</span>
          <span class="text-xs text-gray-400 ml-1.5 uppercase font-bold tracking-wider">/ {{ isYearly ? 'year' : 'month' }}</span>
        </div>

        <ul class="space-y-2 mb-8 flex-1">
          <li
            v-for="feature in plan.features"
            :key="feature"
            class="flex items-start gap-2 text-sm"
          >
            <UIcon
              name="i-lucide-check"
              :class="['size-4 mt-0.5 shrink-0', plan.highlight ? 'text-[#FF6A00]' : 'text-[#FF6A00]']"
            />
            <span :class="plan.highlight ? 'text-white' : 'text-[#1F2937]'">{{ feature }}</span>
          </li>
        </ul>

        <button
          :class="[
            'w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 group-hover:-translate-y-0.5 mt-auto flex items-center justify-center gap-2',
            plan.highlight
              ? 'bg-[#FF6A00] text-white shadow-[0_8px_20px_-6px_rgba(255,106,0,0.4)]'
              : 'bg-white/10 text-white hover:bg-white/20'
          ]"
        >
          {{ plan.button.label }}
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </button>
      </div>
    </div>

    <!-- Skip -->
    <button
      class="mt-8 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
      @click="router.push('/pricing')"
    >
      View full pricing details
    </button>
  </div>
</template>
