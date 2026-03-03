<script setup lang="ts">
import { ref } from 'vue'

const { data: page } = await useAsyncData('pricing', () =>
  queryCollection('pricing').first()
)

// --- SEO ---
const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

// --- Lógica de Estado ---
const isYearly = ref(false)
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-brand-surface font-sans selection:bg-brand-primary selection:text-[#DCE0E6] pt-24 pb-20">
    <!-- 6. Elementos Visuais de Fundo (Backdrop & Glow Blobs) com cores Pika -->
    <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#567EBB]/15 blur-[120px] rounded-full pointer-events-none -z-10" />
    <div class="absolute top-[20%] right-[0%] w-[30%] h-[40%] bg-[#2B4C7E]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

    <div
      v-if="page"
      class="max-w-7xl mx-auto px-6 relative z-10"
    >
      <!-- Hero Header -->
      <div class="text-center max-w-3xl mx-auto mb-20 mt-10">
        <h1 class="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1F1F20] to-[#2B4C7E] tracking-tight mb-6 animate-fade-in-up">
          {{ page.title }}
        </h1>
        <p class="text-xl text-[#606D80] font-medium leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-100">
          {{ page.description }}
        </p>

        <!-- 2. Micro-interações na Troca Mensal/Anual com Badge -->
        <div class="mt-14 flex items-center justify-center gap-4 animate-fade-in-up delay-150">
          <span :class="['text-sm font-bold transition-colors duration-300', !isYearly ? 'text-[#1F1F20]' : 'text-[#606D80]']">Monthly</span>

          <button
            class="relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4C7E] focus-visible:ring-offset-2"
            :class="isYearly ? 'bg-[#2B4C7E]' : 'bg-[#DCE0E6] border-2 border-[#606D80]/20'"
            @click="isYearly = !isYearly"
            aria-label="Toggle billing period"
          >
            <span
              class="inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-[400ms] shadow-md hover:scale-110"
              :class="isYearly ? 'translate-x-[34px] bg-[#DCE0E6]' : 'translate-x-1'"
            />
          </button>

          <div class="relative flex items-center gap-3">
            <span :class="['text-sm font-bold transition-colors duration-300', isYearly ? 'text-[#1F1F20]' : 'text-[#606D80]']">Yearly</span>
            <!-- Badge Save 20% com pulso -->
            <div class="absolute left-full ml-4 w-max">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#567EBB]/10 text-[#2B4C7E] text-xs font-bold whitespace-nowrap border border-[#567EBB]/20 shadow-sm relative group cursor-default transition-transform hover:scale-105">
                <UIcon
                  name="i-heroicons-sparkles"
                  class="w-3.5 h-3.5 animate-pulse"
                /> Save 2 months
                <div class="absolute inset-0 bg-[#2B4C7E]/5 blur-md rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
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
            :class="[
              'relative group rounded-3xl transition-all duration-500 flex flex-col animate-fade-in-up',
              plan.highlight ? 'z-10 md:-mt-8 md:mb-8 md:scale-105 delay-250' : 'mt-0 hover:-translate-y-2 delay-200',
              index === 2 ? 'delay-300' : ''
            ]"
          >
            <!-- 3. O Card Premium: Animated Gradient Border Beam -->
            <div
              v-if="plan.highlight"
              class="absolute -inset-[2px] rounded-[2rem] bg-gradient-to-br from-[#2B4C7E] via-[#567EBB] to-[#DCE0E6] opacity-60 blur group-hover:opacity-100 group-hover:blur-md transition-all duration-700 animate-pulse-slow"
            />

            <!-- 1. Efeito Glassmorphism em todos os cards (Vidro Fosco Claro) -->
            <div
              :class="[
                'relative h-full p-8 md:p-10 rounded-3xl flex flex-col overflow-hidden transition-all duration-500',
                'bg-[#DCE0E6]/80 backdrop-blur-xl border',
                plan.highlight ? 'border-[#DCE0E6]/50 shadow-[0_24px_60px_rgba(43,76,126,0.2)] bg-[#F8F9FA]/95 group-hover:shadow-[0_30px_70px_rgba(43,76,126,0.3)]' : 'border-[#606D80]/20 shadow-lg hover:shadow-2xl hover:border-[#567EBB]/40 bg-[#F4F6F8]/90'
              ]"
            >
              <!-- 3. Brilho interno sutil no premium -->
              <div
                v-if="plan.highlight"
                class="absolute -top-24 -right-24 w-48 h-48 bg-[#567EBB]/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"
              />

              <!-- Selo de Destaque -->
              <div
                v-if="plan.highlight"
                class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group-hover:scale-105 transition-transform duration-300"
              >
                <span class="bg-[#1F1F20] text-[#DCE0E6] text-[11px] tracking-widest uppercase font-black px-5 py-1.5 rounded-full shadow-xl border border-[#DCE0E6]/20 backdrop-blur-md relative overflow-hidden flex items-center justify-center">
                  <span class="relative z-10">{{ plan.highlight_text || 'Premium' }}</span>
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
                </span>
              </div>

              <div class="mb-10 relative z-10">
                <h3 class="text-2xl font-black text-[#1F1F20] mb-3 group-hover:text-[#2B4C7E] transition-colors">
                  {{ plan.title }}
                </h3>
                <p class="text-sm font-medium text-[#606D80]/80 h-10 leading-relaxed">
                  {{ plan.description }}
                </p>
              </div>

              <!-- Animação do Preço ao trocar a chave -->
              <div class="mb-10 flex items-baseline gap-2 relative z-10 h-16">
                <!-- Transition no Value -->
                <div class="overflow-hidden flex items-baseline min-w-[120px]">
                  <Transition name="price" mode="out-in">
                    <h4 :key="isYearly ? 'yearly' : 'monthly'" :class="['text-6xl font-black tracking-tighter transition-colors', plan.highlight ? 'text-[#1F1F20]' : 'text-[#1F1F20]']">
                      {{ isYearly ? plan.price.year : plan.price.month }}
                    </h4>
                  </Transition>
                  <span class="text-[#606D80] font-semibold text-lg ml-2">/ {{ isYearly ? 'ano' : 'mês' }}</span>
                </div>
              </div>

              <div class="flex-1 relative z-10 w-full">
                <ul class="space-y-4 mb-10">
                  <li
                    v-for="(feature, i) in plan.features"
                    :key="i"
                    class="flex items-start gap-4 group/item"
                  >
                    <div :class="['mt-0.5 rounded-full p-1 shrink-0 flex items-center justify-center bg-[#567EBB]/10 text-[#567EBB] transition-transform duration-300 group-hover/item:scale-110 group-hover/item:bg-[#2B4C7E] group-hover/item:text-white']">
                      <UIcon
                        name="i-heroicons-check-solid"
                        class="w-3.5 h-3.5"
                      />
                    </div>
                    <span class="text-[15px] font-medium text-[#1F1F20]/90">{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <!-- Botão Pika baseado na hierarquia -->
              <div class="pt-4 relative z-10 w-full mt-auto">
                <UButton
                  block
                  size="xl"
                  class="rounded-xl font-bold tracking-wide transition-all duration-300 w-full h-[52px]"
                  :class="[
                    plan.highlight
                      ? 'bg-[#2B4C7E] hover:bg-[#1d365e] text-[#DCE0E6] shadow-[0_10px_20px_-10px_rgba(43,76,126,0.6)] hover:shadow-[0_15px_25px_-10px_rgba(43,76,126,0.8)] focus:ring-4 focus:ring-[#2B4C7E]/30 active:scale-[0.98]'
                      : 'bg-[#E5E9F0] hover:bg-[#DCE0E6] text-[#1F1F20] border-transparent hover:shadow-md active:scale-[0.98]'
                  ]"
                  to="/signup"
                >
                  {{ plan.button.label }}
                </UButton>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 7. Conversão Imediata (Check de Objeção) -->
      <div class="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-[13px] sm:text-sm font-bold text-[#606D80] animate-fade-in-up delay-300">
        <div class="flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 cursor-default">
          <div class="p-1.5 bg-[#DCE0E6]/70 rounded-full text-[#567EBB]">
            <UIcon
              name="i-heroicons-credit-card"
              class="w-4 h-4"
            />
          </div>
          No credit card required
        </div>
        <div class="flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 cursor-default">
          <div class="p-1.5 bg-[#DCE0E6]/70 rounded-full text-[#567EBB]">
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-4 h-4"
            />
          </div>
          Cancel anytime
        </div>
        <div class="flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 cursor-default">
          <div class="p-1.5 bg-[#DCE0E6]/70 rounded-full text-[#567EBB]">
            <UIcon
              name="i-heroicons-lock-closed"
              class="w-4 h-4"
            />
          </div>
          Secure payment via Stripe
        </div>
      </div>

      <!-- Tabela de Comparação "Sticky" -->
      <div class="mt-32 max-w-4xl mx-auto px-4 md:px-0">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-3xl md:text-4xl font-extrabold text-[#1F1F20] tracking-tight mb-4">
            Compare os Planos
          </h2>
          <p class="text-[#606D80] font-medium text-lg">
            Transparência total no que oferecemos para o seu negócio.
          </p>
        </div>

        <!-- Glassmorphism Container da Tabela com Scroll Responsivo -->
        <div class="bg-[#F8F9FA]/80 backdrop-blur-2xl border border-[#606D80]/10 rounded-3xl shadow-xl overflow-hidden animate-fade-in-up delay-200">
          <div class="overflow-x-auto scrollbar-hide pb-2">
            <table class="w-full text-left border-collapse min-w-[700px]">
              <!-- Cabeçalho Sticky -->
              <thead class="sticky top-20 bg-[#F8F9FA]/90 backdrop-blur-xl z-20 border-b border-[#606D80]/10">
                <tr>
                  <th class="p-6 md:p-8 font-bold text-[#606D80] w-[34%] text-xs tracking-wider uppercase">
                    Funcionalidades
                  </th>
                  <th class="p-6 md:p-8 font-black text-[#1F1F20] text-center w-[22%] text-lg">
                    Iniciante
                  </th>
                  <th class="p-6 md:p-8 font-black text-[#2B4C7E] text-center w-[22%] text-lg relative">
                    <div class="absolute inset-0 bg-[#2B4C7E]/5 -z-10" />
                    Profissional
                  </th>
                  <th class="p-6 md:p-8 font-black text-[#1F1F20] text-center w-[22%] text-lg">
                    Equipa
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#606D80]/5 text-[15px]">
                <!-- Linhas da Tabela -->
                <tr class="hover:bg-white transition-colors group">
                  <td class="p-6 font-bold text-[#1F1F20]">
                    Agendamentos Mensais
                  </td>
                  <td class="p-6 text-center text-[#606D80] font-medium">
                    Até 100
                  </td>
                  <td class="p-6 text-center font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1F1F20] to-[#2B4C7E] align-middle bg-[#2B4C7E]/5">
                    Ilimitados
                  </td>
                  <td class="p-6 text-center text-[#1F1F20] font-bold">
                    Ilimitados
                  </td>
                </tr>
                <tr class="hover:bg-white transition-colors group">
                  <td class="p-6 font-bold text-[#1F1F20]">
                    Lembretes WhatsApp
                  </td>
                  <td class="p-6 text-center align-middle">
                    <UIcon
                      name="i-heroicons-minus"
                      class="w-5 h-5 mx-auto text-[#606D80]/30"
                    />
                  </td>
                  <td class="p-6 text-center align-middle bg-[#2B4C7E]/5">
                    <div class="inline-flex rounded-full bg-[#567EBB]/10 p-1 group-hover:scale-110 transition-transform">
                      <UIcon
                        name="i-heroicons-check-solid"
                        class="w-5 h-5 mx-auto text-[#567EBB]"
                      />
                    </div>
                  </td>
                  <td class="p-6 text-center align-middle">
                    <div class="inline-flex rounded-full bg-[#567EBB]/10 p-1">
                      <UIcon
                        name="i-heroicons-check-solid"
                        class="w-5 h-5 mx-auto text-[#567EBB]"
                      />
                    </div>
                  </td>
                </tr>
                <tr class="hover:bg-white transition-colors group">
                  <td class="p-6 font-bold text-[#1F1F20]">
                    Dashboard de Lucros
                  </td>
                  <td class="p-6 text-center align-middle">
                    <UIcon
                      name="i-heroicons-minus"
                      class="w-5 h-5 mx-auto text-[#606D80]/30"
                    />
                  </td>
                  <td class="p-6 text-center align-middle bg-[#2B4C7E]/5">
                    <div class="inline-flex rounded-full bg-[#567EBB]/10 p-1 group-hover:scale-110 transition-transform">
                      <UIcon
                        name="i-heroicons-check-solid"
                        class="w-5 h-5 mx-auto text-[#567EBB]"
                      />
                    </div>
                  </td>
                  <td class="p-6 text-center align-middle">
                    <div class="inline-flex rounded-full bg-[#567EBB]/10 p-1">
                      <UIcon
                        name="i-heroicons-check-solid"
                        class="w-5 h-5 mx-auto text-[#567EBB]"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
              <!-- Tfoot para call actions de fecho -->
              <tfoot class="border-t border-[#606D80]/10 bg-[#F4F6F8]">
                <tr>
                  <td class="p-6" />
                  <td class="p-6 text-center align-middle">
                    <UButton
                      variant="ghost"
                      color="gray"
                      size="sm"
                      to="/signup"
                      class="font-bold text-[#606D80] hover:text-[#1F1F20]"
                    >
                      Testar Iniciante
                    </UButton>
                  </td>
                  <td class="p-6 text-center align-middle relative">
                    <div class="absolute inset-0 bg-[#2B4C7E]/5 -z-10" />
                    <button class="bg-[#2B4C7E] hover:bg-[#1d365e] text-[#DCE0E6] px-5 py-2.5 rounded-[10px] font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 w-full whitespace-nowrap">
                      Assinar Agora
                    </button>
                  </td>
                  <td class="p-6 text-center align-middle">
                    <UButton
                      variant="ghost"
                      color="gray"
                      size="sm"
                      to="/signup"
                      class="font-bold text-[#606D80] hover:text-[#1F1F20]"
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
/* Utilities específicas para a Pricing Page */
.perspective-1000 {
  perspective: 1000px;
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.delay-100 { animation-delay: 100ms; }
.delay-150 { animation-delay: 150ms; }
.delay-200 { animation-delay: 200ms; }
.delay-250 { animation-delay: 250ms; }
.delay-300 { animation-delay: 300ms; }

.price-enter-active,
.price-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.price-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}
.price-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

/* Esconder barra de rolagem mas manter funcionalidade */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
