<script setup lang="ts">
const route = useRoute()
const router = useRouter()

definePageMeta({ layout: false })

const selectedPlanId = computed(() => (route.query.plan as string) || '')
const cycle = computed(() => (route.query.cycle as string) || '0')

const { data: pricePage } = await useAsyncData('pricing', () => queryCollection('pricing').first())

type PlanLite = { title: string, description: string, price: { month: string, year: string }, features: string[] }
const selectedPlan = computed<PlanLite | undefined>(() =>
  pricePage.value?.plans.find((p: PlanLite) => p.title.toLowerCase() === selectedPlanId.value)
)
const isYearly = computed(() => cycle.value === '1')
const priceValue = computed(() => {
  if (!selectedPlan.value) return ''
  return isYearly.value ? selectedPlan.value.price.year : selectedPlan.value.price.month
})

const cardBrands = [
  { label: 'Visa', src: '/card-icons/visa.svg' },
  { label: 'Mastercard', src: '/card-icons/mastercard.svg' },
  { label: 'Elo', src: '/card-icons/elo.svg' },
  { label: 'Amex', src: '/card-icons/amex.svg' }
]

const checkoutSteps = [
  'Click "Pay with Stripe" below',
  'Enter your card on the secure Stripe page',
  `Your plan ${selectedPlan.value?.title || ''} will be activated immediately`
]

const toast = useToast()
const isLoading = ref(false)
const userEmail = ref('')
const organizationId = ref<string | null>(null)
const authLoading = ref(true)

onMounted(async () => {
  if (!selectedPlanId.value) {
    router.replace('/plans')
    return
  }
  try {
    const me = await $fetch<Record<string, any>>('/api/auth/me')
    userEmail.value = me?.email || ''
    organizationId.value = me?.organizationId || me?.organization?.id || null
  } catch {
    // Not authenticated — redirect to login, come back afterwards
    const redirect = `/checkout?plan=${selectedPlanId.value}&cycle=${cycle.value}`
    router.push(`/login?redirect=${encodeURIComponent(redirect)}`)
  } finally {
    authLoading.value = false
  }
})

async function submit() {
  if (!selectedPlan.value) {
    toast.add({ title: 'Error', description: 'Plan not selected', color: 'red' })
    return
  }

  isLoading.value = true
  try {
    const response = await $fetch<{ url: string | null }>('/api/stripe/create-checkout-session', {
      method: 'POST',
      body: {
        planTitle: selectedPlan.value.title,
        cycle: parseInt(cycle.value),
        email: userEmail.value,
        organizationId: organizationId.value
      }
    })

    if (response.url) {
      window.location.href = response.url
    } else {
      throw new Error('URL de checkout não retornada')
    }
  } catch (error) {
    console.error('Error creating Stripe session:', error)
    toast.add({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Error processing payment',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="h-screen overflow-hidden bg-[#0B1F3A] selection:bg-[#FF6A00] selection:text-white flex items-center justify-center">
    <!-- back button -->
      <button
      class="fixed left-5 top-5 z-50 flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
      @click="router.back()"
    >
      <UIcon
        name="i-lucide-arrow-left"
        class="w-3.5 h-3.5"
      />
      Back
    </button>

    <div class="w-full max-w-5xl grid grid-cols-2 gap-5 px-5">
      <!-- LEFT CARD – confirmation -->
      <div class="bg-[#1F2937]/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col gap-5">
        <!-- header -->
        <div>
          <div class="flex items-center gap-2 mb-0.5">
            <UIcon
              name="i-lucide-shield-check"
              class="w-4 h-4 text-[#FF6A00]"
            />
            <h2 class="text-lg font-bold text-white">
              Confirm Subscription
            </h2>
          </div>
          <p class="text-xs text-gray-400">
            You will be redirected to Stripe to pay securely
          </p>
        </div>

        <!-- loading auth -->
        <div
          v-if="authLoading"
          class="flex items-center gap-2 text-xs text-gray-400"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="w-4 h-4 animate-spin text-[#FF6A00]"
          />
          Verifying account...
        </div>

        <!-- user info -->
        <div
          v-else-if="userEmail"
          class="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
        >
          <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <UIcon
              name="i-lucide-user"
              class="w-4 h-4 text-[#FF6A00]"
            />
          </div>
          <div>
              <p class="text-xs text-gray-400">
              Linked account
            </p>
            <p class="text-sm font-medium text-white">
              {{ userEmail }}
            </p>
          </div>
        </div>

        <!-- steps -->
        <div class="space-y-2.5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            How it works
          </p>
          <div
            v-for="(step, i) in checkoutSteps"
            :key="i"
            class="flex items-start gap-2.5 text-xs text-gray-300"
          >
            <div class="w-5 h-5 rounded-full bg-[#1F2937] border border-white/10 flex items-center justify-center shrink-0 mt-px">
              <span class="text-[#FF6A00] font-bold text-[10px]">{{ i + 1 }}</span>
            </div>
            {{ step }}
          </div>
        </div>

        <div class="flex-1" />

        <!-- SSL + Stripe badges -->
        <div class="flex items-center gap-4 text-xs text-gray-400">
          <div class="flex items-center gap-1.5">
            <UIcon
              name="i-lucide-lock"
              class="w-3.5 h-3.5 text-green-500"
            />
            <span>SSL encryption</span>
          </div>
          <div class="flex items-center gap-1.5">
            <UIcon
              name="i-lucide-shield"
              class="w-3.5 h-3.5 text-blue-500"
            />
            <span>Powered by Stripe</span>
          </div>
        </div>

        <!-- submit -->
        <UButton
          class="!bg-[#FF6A00] hover:!bg-[#FF8533] !text-white rounded-xl transition-all duration-400 font-bold shadow-md hover:-translate-y-0.5 mt-4 border-none flex justify-center py-2.5"
          block
          size="md"
          :loading="isLoading"
          :disabled="isLoading || authLoading || !userEmail || !organizationId"
          @click="submit"
        >
          <template v-if="!isLoading">
            <UIcon
              name="i-lucide-external-link"
              class="w-4 h-4 mr-1.5"
            />
            Pay with Stripe · {{ priceValue }}/{{ isYearly ? 'year' : 'month' }}
          </template>
          <span v-else>Creating session...</span>
        </UButton>
      </div>

      <!-- RIGHT CARD – order summary -->
      <div class="bg-[#1F2937]/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col gap-4">
        <!-- header -->
        <div>
          <h3 class="text-lg font-bold text-white">
            Order Summary
          </h3>
          <p class="text-xs text-gray-400">
            Purchase details
          </p>
        </div>

        <!-- plan card -->
        <div class="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
          <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <UIcon
              name="i-lucide-package"
              class="w-5 h-5 text-[#FF6A00]"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm text-white truncate">
              {{ selectedPlan?.title || '—' }}
            </p>
            <p class="text-xs text-gray-400">
              {{ isYearly ? 'Yearly' : 'Monthly' }} · 1 license
            </p>
          </div>
          <span class="font-bold text-sm text-white shrink-0">{{ priceValue }}</span>
        </div>

        <!-- plan description -->
        <p
          v-if="selectedPlan?.description"
          class="text-xs text-gray-400 leading-relaxed"
        >
          {{ selectedPlan.description }}
        </p>

        <!-- features -->
        <ul
          v-if="selectedPlan?.features?.length"
          class="space-y-1.5"
        >
          <li
            v-for="(feat, i) in selectedPlan.features"
            :key="i"
            class="flex items-start gap-2 text-xs text-gray-400"
          >
            <UIcon
              name="i-lucide-check"
              class="w-3.5 h-3.5 text-[#FF6A00] shrink-0 mt-px"
            />
            {{ feat }}
          </li>
        </ul>

        <!-- divider -->
        <div class="border-t border-white/10" />

        <!-- totals -->
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span>{{ priceValue }}</span>
          </div>
          <div class="flex justify-between text-gray-400">
            <span>Discount</span>
            <span class="text-[#10B981]">—</span>
          </div>
          <div class="flex justify-between font-bold text-white pt-1.5 border-t border-white/10">
            <span>Total</span>
            <span>{{ priceValue }}/{{ isYearly ? 'year' : 'month' }}</span>
          </div>
        </div>

        <!-- billing note + accepted methods -->
        <div class="mt-auto space-y-3">
          <p class="text-xs text-gray-500">
            Automatic renewal {{ isYearly ? 'yearly' : 'monthly' }}. Cancel anytime.
          </p>
          <div>
            <p class="text-xs font-medium text-gray-400 mb-1.5">
              Accepted methods:
            </p>
            <div class="flex gap-2 flex-wrap">
              <div
                v-for="brand in cardBrands"
                :key="brand.label"
                class="flex items-center justify-center w-12 h-8 rounded-md bg-[#F6F8FC] border border-white/10 overflow-hidden"
                :title="brand.label"
              >
                <img
                  :src="brand.src"
                  :alt="brand.label"
                  class="w-full h-full object-contain p-0.5"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
