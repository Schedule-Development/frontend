<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { data: page } = await useAsyncData('pricing', () =>
  queryCollection('pricing').first()
)

// --- SEO ---
const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

// --- Lógica de Estado ---
const isYearly = ref(false)
const router = useRouter()
const clickingPlan = ref<number | null>(null)
const { fetchMe, isLoggedIn, user } = useAuth()

onMounted(async () => {
  await fetchMe()
})

const handlePlanClick = async (index: number, plan: { title: string }) => {
  clickingPlan.value = index
  await new Promise(r => setTimeout(r, 150)) // delay cognitivo

  if (!isLoggedIn.value) {
    router.push(`/signup?plan=${plan.title.toLowerCase()}&cycle=${isYearly.value ? '1' : '0'}`)
    clickingPlan.value = null
    return
  }

  try {
    const response = await $fetch<{ url: string | null }>('/api/stripe/create-checkout-session', {
      method: 'POST',
      body: {
        planTitle: plan.title,
        cycle: isYearly.value ? 1 : 0,
        email: user.value?.email,
        organizationId: user.value?.organizationId
      }
    })
    if (response.url) {
      window.location.href = response.url
    }
  } catch {
    // fallback to checkout page
    router.push(`/checkout?plan=${plan.title.toLowerCase()}&cycle=${isYearly.value ? '1' : '0'}`)
  }
  clickingPlan.value = null
}

const getDisplayPrice = (plan: { price: { month: string | number, year: string | number } }) => {
  return isYearly.value ? plan.price.year : plan.price.month
}

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
.price-enter-active,
.price-leave-active {
  transition: all var(--duration-fast) var(--ease-indie);
}

.price-leave-to {
  opacity: 0.5;
  filter: blur(2px);
  transform: scale(0.97);
}

.price-enter-from {
  opacity: 0.5;
  filter: blur(2px);
  transform: scale(0.97);
}

.price-enter-to,
.price-leave-from {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}
</style>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#FAFAFA] font-sans selection:bg-brand-primary selection:text-[#1F1F20] pt-24 pb-20">
    <div class="absolute inset-0 pointer-events-none -z-10" style="background: radial-gradient(600px circle at 50% 30%, rgba(59,130,246,0.06), transparent 60%);" />

    <div
      v-if="page"
      class="max-w-7xl mx-auto px-6 relative z-10"
    >
      <!-- Hero Header -->
      <div class="text-center max-w-3xl mx-auto mb-20 mt-10">
        <h1
          v-motion
          :initial="baseMotion.initial"
          :visible-once="baseMotion.visible"
          class="text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-6"
        >
          {{ page.title }}
        </h1>
        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 100, easing: [0.16, 1, 0.3, 1] } }"
          class="text-lg md:text-xl text-[#4B5563] font-medium leading-relaxed max-w-2xl mx-auto"
        >
          {{ page.description }}
        </p>

        <!-- Micro-interações na Troca Mensal/Anual com Badge -->
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.96, y: 14 }"
          :visible-once="{ opacity: 1, scale: 1, y: 0, transition: { duration: 1000, delay: 200, easing: [0.16, 1, 0.3, 1] } }"
          class="mt-14 flex items-center justify-center gap-4"
        >
          <span :class="['text-sm font-semibold transition-colors duration-400', !isYearly ? 'text-[#1F1F20]' : 'text-[#6B7280]']">Mensal</span>

          <button
            class="relative inline-flex h-8 w-16 items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4C7E] focus-visible:ring-offset-2"
            style="transition: all var(--duration-fast) var(--ease-indie);"
            :class="isYearly ? 'bg-[#2B4C7E]' : 'bg-[#E5E7EB] border border-[#D1D5DB]'"
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
            <span :class="['text-sm font-semibold transition-colors duration-400', isYearly ? 'text-[#1F1F20]' : 'text-[#6B7280]']">Anual</span>
            <!-- Badge Save 20% -->
            <div class="absolute left-full ml-4 w-max">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold whitespace-nowrap border border-blue-100 shadow-sm relative group cursor-default transition-transform hover:scale-105">
                <UIcon
                  name="i-heroicons-sparkles"
                  class="w-3.5 h-3.5"
                /> 2 meses off
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative px-4 md:px-0">
        <template
          v-for="(plan, index) in page.plans"
          :key="index"
        >
          <div
            v-motion
            :initial="cardMotion(index).initial"
            :visible-once="cardMotion(index).visible"
            :class="[
              'relative group rounded-3xl transition-all duration-500 flex flex-col',
              plan.highlight ? 'z-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-gray-200/50 hover:-translate-y-0.5' : 'mt-0 hover:-translate-y-0.5 shadow-sm hover:shadow-md'
            ]"
          >

            <div
              :class="[
                'relative h-full p-8 md:p-10 rounded-3xl flex flex-col transition-all duration-400',
                'bg-white border',
                plan.highlight ? 'border-gray-200' : 'border-gray-100'
              ]"
            >

              <!-- Selo de Destaque -->
              <div
                v-if="plan.highlight"
                class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group-hover:scale-105 transition-transform duration-300"
              >
                <span class="bg-[#1F1F20] text-white text-[11px] tracking-widest uppercase font-bold px-4 py-1.5 rounded-full shadow-sm border border-gray-700 relative overflow-hidden flex items-center justify-center">
                  <span class="relative z-10">{{ (plan as any).highlight_text || 'Premium' }}</span>
                </span>
              </div>

              <div class="mb-10 relative z-10">
                <h3 class="text-2xl font-bold text-[#111827] mb-2 group-hover:text-[#2B4C7E] transition-colors">
                  {{ plan.title }}
                </h3>
                <p class="text-sm text-[#4B5563] h-10 leading-relaxed md:w-11/12">
                  {{ plan.description }}
                </p>
              </div>

              <!-- Animação do Preço ao trocar a chave -->
              <div class="mb-10 flex items-baseline gap-2 relative z-10 h-16">
                <!-- Transition no Value -->
                <div class="overflow-hidden flex items-baseline min-w-[120px]">
                  <Transition name="price" mode="out-in">
                    <h4 :key="isYearly ? 'yearly' : 'monthly'" class="text-5xl font-extrabold tracking-tight text-[#111827] transition-colors">
                      {{ getDisplayPrice(plan) }}
                    </h4>
                  </Transition>
                  <span class="text-[#6B7280] font-medium text-lg ml-2">/ {{ isYearly ? 'ano' : 'mês' }}</span>
                </div>
              </div>

              <div class="flex-1 relative z-10 w-full">
                <ul class="space-y-4 mb-10">
                  <li
                    v-for="(feature, i) in plan.features"
                    :key="i"
                    class="flex items-start gap-4 group/item"
                  >
                    <div class="mt-0.5 rounded-full p-1 shrink-0 flex items-center justify-center text-[#2B4C7E] bg-blue-50 transition-transform duration-400 group-hover/item:scale-110">
                      <UIcon
                        name="i-heroicons-check-solid"
                        class="w-3.5 h-3.5"
                      />
                    </div>
                    <span class="text-[15px] font-medium text-[#374151]">{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <!-- Botão Indie baseado na hierarquia -->
              <div class="pt-4 relative z-10 w-full mt-auto">
                <UButton
                  block
                  size="xl"
                  class="rounded-xl tracking-wide transition-all duration-400 w-full h-[52px] flex justify-center items-center"
                  :class="[
                    plan.highlight
                      ? 'bg-[#111827] hover:bg-black text-white font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5'
                      : 'bg-white hover:bg-gray-50 text-gray-700 font-medium border border-gray-200 shadow-sm hover:border-gray-300 hover:-translate-y-0.5',
                    clickingPlan === index ? 'scale-[0.97]' : ''
                  ]"
                  @click="handlePlanClick(index, plan)"
                >
                  {{ plan.button.label }}
                </UButton>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Conversão Imediata (Check de Objeção) -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 18 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 500, easing: [0.16, 1, 0.3, 1] } }"
        class="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-[13px] sm:text-sm font-medium text-[#6B7280]"
      >
        <div class="flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 duration-400 cursor-default">
          <div class="text-gray-400">
            <UIcon
              name="i-heroicons-credit-card"
              class="w-4 h-4"
            />
          </div>
          Sem cartão de crédito
        </div>
        <div class="flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 duration-400 cursor-default">
          <div class="text-gray-400">
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-4 h-4"
            />
          </div>
          Cancele quando quiser
        </div>
        <div class="flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 duration-400 cursor-default">
          <div class="text-gray-400">
            <UIcon
              name="i-heroicons-lock-closed"
              class="w-4 h-4"
            />
          </div>
          Pagamento seguro
        </div>
      </div>

      <!-- Tabela de Comparação "Sticky" -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, easing: [0.16, 1, 0.3, 1] } }"
        class="mt-32 max-w-4xl mx-auto px-4 md:px-0"
      >
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-[#111827] tracking-tight mb-3">
            Compare os Planos
          </h2>
          <p class="text-[#4B5563] text-lg">
            Transparência total no que oferecemos.
          </p>
        </div>

        <!-- Container da Tabela -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 15 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100, easing: [0.16, 1, 0.3, 1] } }"
          class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden"
        >
          <div class="overflow-x-auto scrollbar-hide pb-2">
            <table class="w-full text-left border-collapse min-w-[700px]">
              <!-- Cabeçalho Sticky -->
              <thead class="sticky top-20 bg-white/95 backdrop-blur z-20 border-b border-gray-100">
                <tr>
                  <th class="p-6 md:p-8 font-semibold text-gray-500 w-[34%] text-xs tracking-wider uppercase">
                    Funcionalidades
                  </th>
                  <th class="p-6 md:p-8 font-bold text-[#111827] text-center w-[22%] text-base">
                    Iniciante
                  </th>
                  <th class="p-6 md:p-8 font-bold text-[#2B4C7E] text-center w-[22%] text-base bg-blue-50/30">
                    Profissional
                  </th>
                  <th class="p-6 md:p-8 font-bold text-[#111827] text-center w-[22%] text-base">
                    Equipa
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 text-[15px]">
                <!-- Linhas da Tabela -->
                <tr class="hover:bg-gray-50/50 transition-colors duration-400 group">
                  <td class="p-6 font-medium text-[#111827]">
                    Agendamentos Mensais
                  </td>
                  <td class="p-6 text-center text-gray-500">
                    Até 100
                  </td>
                  <td class="p-6 text-center font-bold text-[#111827] align-middle bg-blue-50/30">
                    Ilimitados
                  </td>
                  <td class="p-6 text-center text-[#111827] font-medium">
                    Ilimitados
                  </td>
                </tr>
                <tr class="hover:bg-gray-50/50 transition-colors duration-400 group">
                  <td class="p-6 font-medium text-[#111827]">
                    Lembretes WhatsApp
                  </td>
                  <td class="p-6 text-center align-middle">
                    <UIcon
                      name="i-heroicons-minus"
                      class="w-5 h-5 mx-auto text-gray-300"
                    />
                  </td>
                  <td class="p-6 text-center align-middle bg-blue-50/30">
                    <div class="inline-flex rounded-full bg-blue-50 p-1 group-hover:scale-110 transition-transform duration-400">
                      <UIcon
                        name="i-heroicons-check-solid"
                        class="w-4 h-4 mx-auto text-[#2B4C7E]"
                      />
                    </div>
                  </td>
                  <td class="p-6 text-center align-middle">
                    <div class="inline-flex rounded-full bg-blue-50 p-1">
                      <UIcon
                        name="i-heroicons-check-solid"
                        class="w-4 h-4 mx-auto text-[#2B4C7E]"
                      />
                    </div>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50/50 transition-colors duration-400 group">
                  <td class="p-6 font-medium text-[#111827]">
                    Dashboard de Lucros
                  </td>
                  <td class="p-6 text-center align-middle">
                    <UIcon
                      name="i-heroicons-minus"
                      class="w-5 h-5 mx-auto text-gray-300"
                    />
                  </td>
                  <td class="p-6 text-center align-middle bg-blue-50/30">
                    <div class="inline-flex rounded-full bg-blue-50 p-1 group-hover:scale-110 transition-transform duration-400">
                      <UIcon
                        name="i-heroicons-check-solid"
                        class="w-4 h-4 mx-auto text-[#2B4C7E]"
                      />
                    </div>
                  </td>
                  <td class="p-6 text-center align-middle">
                    <div class="inline-flex rounded-full bg-blue-50 p-1">
                      <UIcon
                        name="i-heroicons-check-solid"
                        class="w-4 h-4 mx-auto text-[#2B4C7E]"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot class="border-t border-gray-100 bg-gray-50/50">
                <tr>
                  <td class="p-6" />
                  <td class="p-6 text-center align-middle">
                    <UButton
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      @click="router.push('/signup')"
                      class="font-medium text-gray-500 hover:text-[#111827] transition-colors duration-400"
                    >
                      Testar Iniciante
                    </UButton>
                  </td>
                  <td class="p-6 text-center align-middle bg-blue-50/30">
                    <button @click="router.push('/signup')" class="bg-[#111827] hover:bg-black text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-400 shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 w-full whitespace-nowrap">
                      Assinar Agora
                    </button>
                  </td>
                  <td class="p-6 text-center align-middle">
                    <UButton
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      @click="router.push('/signup')"
                      class="font-medium text-gray-500 hover:text-[#111827] transition-colors duration-400"
                    >
                      Testar Equipa
                    </UButton>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.pricing-ease {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

.price-enter-active,
.price-leave-active {
  transition: all 400ms ease;
}
.price-enter-from {
  opacity: 0;
  filter: blur(4px);
  transform: scale(0.97);
}
.price-leave-to {
  opacity: 0;
  filter: blur(4px);
  transform: scale(0.97) translateY(-2px);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
