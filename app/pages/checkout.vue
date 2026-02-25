<script setup lang="ts">
const route = useRoute()
const router = useRouter()

definePageMeta({ layout: false })

const selectedPlanId = computed(() => (route.query.plan as string) || '')
const cycle = computed(() => (route.query.cycle as string) || '0')

watchEffect(() => {
  if (!selectedPlanId.value) router.replace('/pricing')
})

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

const user = reactive({
  companyName: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvc: '',
  saveCard: false
})

const cardBrands = [
  { label: 'Visa', src: '/card-icons/visa.svg' },
  { label: 'Mastercard', src: '/card-icons/mastercard.svg' },
  { label: 'Elo', src: '/card-icons/elo.svg' },
  { label: 'Amex', src: '/card-icons/amex.svg' },
]

function submit() {
  console.log('Checkout submitted', { plan: selectedPlanId.value, cycle: cycle.value, ...user })
  router.push('/')
}
</script>

<template>
  <div class="h-screen overflow-hidden bg-[var(--ui-bg)] flex items-center justify-center">
    <!-- back button -->
    <NuxtLink
      to="/pricing"
      class="fixed left-5 top-5 z-50 flex items-center gap-1 text-xs text-[var(--ui-text-muted)] hover:text-[var(--ui-text)] transition-colors"
    >
      <UIcon
        name="i-lucide-arrow-left"
        class="w-3.5 h-3.5"
      />
      Voltar
    </NuxtLink>

    <div class="w-full max-w-5xl grid grid-cols-2 gap-5 px-5">
      <!-- LEFT CARD – payment form -->
      <div class="bg-[var(--ui-bg-elevated)] rounded-2xl p-6 border border-[var(--ui-border)] flex flex-col gap-4">
        <!-- header -->
        <div>
          <div class="flex items-center gap-2 mb-0.5">
            <UIcon
              name="i-lucide-credit-card"
              class="w-4 h-4 text-primary-400"
            />
            <h2 class="text-lg font-bold text-[var(--ui-text)]">
              Finalizar Compra
            </h2>
          </div>
          <p class="text-xs text-[var(--ui-text-muted)]">
            Preencha seus dados e as informações do cartão
          </p>
        </div>

        <!-- account + card fields in a tight grid -->
        <div class="grid grid-cols-2 gap-x-3 gap-y-2.5">
          <UFormField
            name="companyName"
            label="Empresa"
            size="sm"
            class="col-span-2"
          >
            <UInput
              v-model="user.companyName"
              placeholder="Acme Inc."
              size="sm"
            />
          </UFormField>
          <UFormField
            name="name"
            label="Nome completo"
            size="sm"
          >
            <UInput
              v-model="user.name"
              placeholder="João Silva"
              size="sm"
            />
          </UFormField>
          <UFormField
            name="phone"
            label="Telefone"
            size="sm"
          >
            <UInput
              v-model="user.phone"
              placeholder="(11) 99999-9999"
              size="sm"
            />
          </UFormField>
          <UFormField
            name="email"
            label="E-mail"
            size="sm"
            class="col-span-2"
          >
            <UInput
              v-model="user.email"
              type="email"
              placeholder="voce@exemplo.com"
              size="sm"
            />
          </UFormField>
          <UFormField
            name="password"
            label="Senha"
            size="sm"
            class="col-span-2"
          >
            <UInput
              v-model="user.password"
              type="password"
              placeholder="Crie uma senha"
              size="sm"
            />
          </UFormField>
        </div>

        <!-- divider -->
        <div class="border-t border-[var(--ui-border)]" />

        <!-- card fields -->
        <div class="grid grid-cols-2 gap-x-3 gap-y-2.5">
          <UFormField
            name="cardNumber"
            label="Número do cartão"
            size="sm"
            class="col-span-2"
          >
            <UInput
              v-model="user.cardNumber"
              placeholder="0000 0000 0000 0000"
              leading-icon="i-lucide-credit-card"
              size="sm"
            />
          </UFormField>
          <UFormField
            name="cardName"
            label="Nome no cartão"
            size="sm"
            class="col-span-2"
          >
            <UInput
              v-model="user.cardName"
              placeholder="Nome como está no cartão"
              size="sm"
            />
          </UFormField>
          <UFormField
            name="cardExpiry"
            label="Validade"
            size="sm"
          >
            <UInput
              v-model="user.cardExpiry"
              placeholder="MM/AA"
              size="sm"
            />
          </UFormField>
          <UFormField
            name="cardCvc"
            label="CVV"
            size="sm"
          >
            <UInput
              v-model="user.cardCvc"
              placeholder="123"
              size="sm"
            />
          </UFormField>
        </div>

        <!-- save card + ssl -->
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-1.5 text-xs text-[var(--ui-text-muted)] cursor-pointer select-none">
            <UCheckbox
              v-model="user.saveCard"
              size="sm"
            />
            Salvar cartão para próximas compras
          </label>
          <span class="flex items-center gap-1 text-xs text-[var(--ui-text-muted)]">
            <UIcon
              name="i-lucide-lock"
              class="w-3 h-3"
            /> SSL
          </span>
        </div>

        <!-- submit -->
        <UButton
          color="primary"
          block
          size="md"
          @click="submit"
        >
          Finalizar pagamento · {{ priceValue }}/{{ isYearly ? 'ano' : 'mês' }}
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
            <span class="text-emerald-400">—</span>
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
                class="flex items-center justify-center w-12 h-8 rounded-md bg-white border border-[var(--ui-border)] overflow-hidden"
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
