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
  'Clique em "Pagar com Stripe" abaixo',
  'Insira seu cartão na página segura do Stripe',
  `Seu plano ${selectedPlan.value?.title || ''} é ativado imediatamente`
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
    toast.add({ title: 'Erro', description: 'Plano não selecionado', color: 'red' })
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
    console.error('Erro ao criar sessão de checkout:', error)
    toast.add({
      title: 'Erro',
      description: error instanceof Error ? error.message : 'Erro ao processar pagamento',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="h-screen overflow-hidden bg-[var(--ui-bg)] flex items-center justify-center">
    <!-- back button -->
    <button
      class="fixed left-5 top-5 z-50 flex items-center gap-1 text-xs text-[var(--ui-text-muted)] hover:text-[var(--ui-text)] transition-colors"
      @click="router.back()"
    >
      <UIcon
        name="i-lucide-arrow-left"
        class="w-3.5 h-3.5"
      />
      Voltar
    </button>

    <div class="w-full max-w-5xl grid grid-cols-2 gap-5 px-5">
      <!-- LEFT CARD – confirmation -->
      <div class="bg-[var(--ui-bg-elevated)] rounded-2xl p-6 border border-[var(--ui-border)] flex flex-col gap-5">
        <!-- header -->
        <div>
          <div class="flex items-center gap-2 mb-0.5">
            <UIcon
              name="i-lucide-shield-check"
              class="w-4 h-4 text-primary-400"
            />
            <h2 class="text-lg font-bold text-[var(--ui-text)]">
              Confirmar Assinatura
            </h2>
          </div>
          <p class="text-xs text-[var(--ui-text-muted)]">
            Você será redirecionado para o Stripe para pagar com segurança
          </p>
        </div>

        <!-- loading auth -->
        <div
          v-if="authLoading"
          class="flex items-center gap-2 text-xs text-[var(--ui-text-muted)]"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="w-4 h-4 animate-spin"
          />
          Verificando conta...
        </div>

        <!-- user info -->
        <div
          v-else-if="userEmail"
          class="flex items-center gap-3 p-3 bg-[var(--ui-bg)] rounded-xl"
        >
          <div class="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center shrink-0">
            <UIcon
              name="i-lucide-user"
              class="w-4 h-4 text-primary-400"
            />
          </div>
          <div>
            <p class="text-xs text-[var(--ui-text-muted)]">
              Conta vinculada
            </p>
            <p class="text-sm font-medium text-[var(--ui-text)]">
              {{ userEmail }}
            </p>
          </div>
        </div>

        <!-- steps -->
        <div class="space-y-2.5">
          <p class="text-xs font-semibold text-[var(--ui-text-muted)] uppercase tracking-wide">
            Como funciona
          </p>
          <div
            v-for="(step, i) in checkoutSteps"
            :key="i"
            class="flex items-start gap-2.5 text-xs text-[var(--ui-text-muted)]"
          >
            <div class="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-px">
              <span class="text-blue-600 font-bold text-[10px]">{{ i + 1 }}</span>
            </div>
            {{ step }}
          </div>
        </div>

        <div class="flex-1" />

        <!-- SSL + Stripe badges -->
        <div class="flex items-center gap-4 text-xs text-[var(--ui-text-muted)]">
          <div class="flex items-center gap-1.5">
            <UIcon
              name="i-lucide-lock"
              class="w-3.5 h-3.5 text-green-500"
            />
            <span>Criptografia SSL</span>
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
          color="primary"
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
            Pagar com Stripe · {{ priceValue }}/{{ isYearly ? 'ano' : 'mês' }}
          </template>
          <span v-else>Criando sessão...</span>
        </UButton>
      </div>

      <!-- RIGHT CARD – order summary -->
      <div class="bg-[var(--ui-bg-elevated)] rounded-2xl p-6 border border-[var(--ui-border)] flex flex-col gap-4">
        <!-- header -->
        <div>
          <h3 class="text-lg font-bold text-[var(--ui-text)]">
            Resumo do Pedido
          </h3>
          <p class="text-xs text-[var(--ui-text-muted)]">
            Detalhes da sua compra
          </p>
        </div>

        <!-- plan card -->
        <div class="flex items-center gap-3 p-3 bg-[var(--ui-bg)] rounded-xl">
          <div class="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
            <UIcon
              name="i-lucide-package"
              class="w-5 h-5 text-primary-400"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm text-[var(--ui-text)] truncate">
              {{ selectedPlan?.title || '—' }}
            </p>
            <p class="text-xs text-[var(--ui-text-muted)]">
              {{ isYearly ? 'Anual' : 'Mensal' }} · 1 licença
            </p>
          </div>
          <span class="font-bold text-sm text-[var(--ui-text)] shrink-0">{{ priceValue }}</span>
        </div>

        <!-- plan description -->
        <p
          v-if="selectedPlan?.description"
          class="text-xs text-[var(--ui-text-muted)] leading-relaxed"
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
            class="flex items-start gap-2 text-xs text-[var(--ui-text-muted)]"
          >
            <UIcon
              name="i-lucide-check"
              class="w-3.5 h-3.5 text-primary-400 shrink-0 mt-px"
            />
            {{ feat }}
          </li>
        </ul>

        <!-- divider -->
        <div class="border-t border-[var(--ui-border)]" />

        <!-- totals -->
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-[var(--ui-text-muted)]">
            <span>Subtotal</span>
            <span>{{ priceValue }}</span>
          </div>
          <div class="flex justify-between text-[var(--ui-text-muted)]">
            <span>Desconto</span>
            <span class="text-[#10B981]">—</span>
          </div>
          <div class="flex justify-between font-bold text-[var(--ui-text)] pt-1.5 border-t border-[var(--ui-border)]">
            <span>Total</span>
            <span>{{ priceValue }}/{{ isYearly ? 'ano' : 'mês' }}</span>
          </div>
        </div>

        <!-- billing note + accepted methods -->
        <div class="mt-auto space-y-3">
          <p class="text-xs text-[var(--ui-text-muted)]">
            Renovação automática {{ isYearly ? 'anual' : 'mensal' }}. Cancelamento a qualquer momento.
          </p>
          <div>
            <p class="text-xs font-medium text-[var(--ui-text-muted)] mb-1.5">
              Métodos aceitos:
            </p>
            <div class="flex gap-2 flex-wrap">
              <div
                v-for="brand in cardBrands"
                :key="brand.label"
                class="flex items-center justify-center w-12 h-8 rounded-md bg-[#DCE0E6] border border-[var(--ui-border)] overflow-hidden"
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
