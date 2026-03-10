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
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 py-16">
    <!-- Header -->
    <div class="text-center mb-10 max-w-xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium mb-4">
        <UIcon name="i-lucide-check-circle" class="size-3.5" />
        Account created successfully!
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Now, choose your plan</h1>
      <p class="text-gray-500 text-sm">Start your 14-day free trial. No credit card required.</p>
    </div>

    <!-- Billing toggle -->
    <div class="flex items-center gap-3 mb-10">
      <span :class="['text-sm font-medium', !isYearly ? 'text-gray-900' : 'text-gray-400']">Monthly</span>
      <button
        class="relative w-12 h-6 rounded-full transition-colors duration-200"
        :class="isYearly ? 'bg-gray-900' : 'bg-gray-300'"
        @click="isYearly = !isYearly"
      >
        <span
          class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
          :class="isYearly ? 'translate-x-6' : 'translate-x-0'"
        />
      </button>
      <span :class="['text-sm font-medium', isYearly ? 'text-gray-900' : 'text-gray-400']">Yearly</span>
      <span v-if="isYearly" class="text-xs px-2 py-0.5 bg-green-100 text-green-700 font-semibold rounded-full">2 months free</span>
    </div>

    <!-- Plan cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
      <div
        v-for="plan in plans"
        :key="plan.title"
        :class="[
          'relative flex flex-col rounded-2xl border p-7 cursor-pointer transition-all duration-200 group',
          plan.highlight
            ? 'bg-gray-900 border-gray-900 text-white shadow-xl scale-[1.03]'
            : 'bg-white border-gray-200 text-gray-900 hover:border-gray-400 hover:shadow-md'
        ]"
        @click="selectPlan(plan)"
      >
        <!-- Highlight badge -->
        <div
          v-if="plan.highlight_text"
          class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-white border border-gray-200 text-gray-800 text-xs font-bold rounded-full shadow-sm whitespace-nowrap tracking-wide uppercase"
        >
          ✦ {{ plan.highlight_text }}
        </div>

        <div class="mb-4">
          <h2 class="text-lg font-bold mb-1">{{ plan.title }}</h2>
          <p :class="['text-sm', plan.highlight ? 'text-gray-300' : 'text-gray-500']">{{ plan.description }}</p>
        </div>

        <div class="mb-6">
          <span class="text-4xl font-extrabold">{{ getPrice(plan) }}</span>
          <span :class="['text-sm ml-1', plan.highlight ? 'text-gray-400' : 'text-gray-400']">/ mês</span>
        </div>

        <ul class="space-y-2 mb-8 flex-1">
          <li
            v-for="feature in plan.features"
            :key="feature"
            class="flex items-start gap-2 text-sm"
          >
            <UIcon
              name="i-lucide-check"
              :class="['size-4 mt-0.5 shrink-0', plan.highlight ? 'text-green-400' : 'text-green-500']"
            />
            <span :class="plan.highlight ? 'text-gray-200' : 'text-gray-600'">{{ feature }}</span>
          </li>
        </ul>

        <button
          :class="[
            'w-full py-3 rounded-xl font-semibold text-sm transition-all duration-150 group-hover:-translate-y-0.5',
            plan.highlight
              ? 'bg-white text-gray-900 hover:bg-gray-100'
              : 'bg-gray-900 text-white hover:bg-black'
          ]"
        >
          {{ plan.button.label }}
          <UIcon name="i-lucide-arrow-right" class="inline ml-1 size-4" />
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
