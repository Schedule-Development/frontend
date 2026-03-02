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
  <div class="relative min-h-screen overflow-hidden bg-nature-50 dark:bg-nature-950 font-sans selection:bg-brand-500 selection:text-white pt-24 pb-20">
    <!-- 6. Elementos Visuais de Fundo (Backdrop & Glow Blobs) com cores Pika -->
    <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#567EBB]/15 blur-[120px] rounded-full pointer-events-none -z-10" />
    <div class="absolute top-[20%] right-[0%] w-[30%] h-[40%] bg-[#2B4C7E]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

    <div
      v-if="page"
      class="max-w-7xl mx-auto px-6 relative z-10"
    >
      <!-- Hero Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h1 class="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1F1F20] to-[#2B4C7E] dark:from-white dark:to-brand-300 tracking-tight mb-6 mt-16">
          {{ page.title }}
        </h1>
        <p class="text-xl text-nature-600 dark:text-nature-300 font-medium">
          {{ page.description }}
        </p>

        <!-- 2. Micro-interações na Troca Mensal/Anual com Badge -->
        <div class="mt-12 flex items-center justify-center gap-4">
          <span :class="['text-sm font-bold transition-colors', !isYearly ? 'text-nature-950 dark:text-white' : 'text-nature-500']">Mensal</span>

          <button
            class="relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none"
            :class="isYearly ? 'bg-[#2B4C7E]' : 'bg-[#606D80]/30'"
            @click="isYearly = !isYearly"
          >
            <span
              class="inline-block h-6 w-6 transform rounded-full bg-white transition-all duration-[400ms] shadow-sm"
              :class="isYearly ? 'translate-x-9' : 'translate-x-1'"
            />
          </button>

          <div class="relative flex items-center gap-3">
            <span :class="['text-sm font-bold transition-colors', isYearly ? 'text-nature-950 dark:text-white' : 'text-nature-500']">Anual</span>
            <!-- Badge Save 20% com pulso -->
            <div class="absolute left-full ml-4 animate-pulse">
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#567EBB]/10 text-[#2B4C7E] dark:text-brand-300 text-xs font-bold whitespace-nowrap border border-[#567EBB]/20 shadow-sm relative">
                <UIcon
                  name="i-heroicons-sparkles"
                  class="w-3.5 h-3.5"
                /> Poupe 2 meses
                <div class="absolute inset-0 bg-white/20 blur-[1px] rounded-full pointer-events-none" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
        <template
          v-for="(plan, index) in page.plans"
          :key="index"
        >
          <div
            :class="[
              'relative group rounded-3xl transition-all duration-500 flex flex-col',
              plan.highlight ? 'z-10 md:-mt-8 md:mb-8 md:scale-105' : 'mt-0 hover:-translate-y-2'
            ]"
          >
            <!-- 3. O Card Premium: Animated Gradient Border Beam -->
            <div
              v-if="plan.highlight"
              class="absolute -inset-[2px] rounded-[2rem] bg-gradient-to-br from-[#2B4C7E] via-[#567EBB] to-[#DCE0E6] opacity-60 blur-sm group-hover:opacity-100 transition-opacity duration-700 animate-pulse-slow"
            />

            <!-- 1. Efeito Glassmorphism em todos os cards (Vidro Fosco Claro) -->
            <div
              :class="[
                'relative h-full p-8 md:p-10 rounded-3xl flex flex-col overflow-hidden transition-all',
                'bg-white/80 dark:bg-nature-900/80 backdrop-blur-xl border',
                plan.highlight ? 'border-white/50 shadow-[0_20px_50px_rgba(43,76,126,0.15)] bg-white/95 dark:bg-nature-900/95' : 'border-[#606D80]/20 shadow-lg hover:shadow-2xl hover:border-[#567EBB]/50'
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
                class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <span class="bg-[#1F1F20] text-white text-xs tracking-wider uppercase font-black px-5 py-1.5 rounded-full shadow-xl border border-white/20 backdrop-blur-md">
                  {{ plan.highlight_text || 'Premium' }}
                </span>
              </div>

              <div class="mb-8 relative z-10">
                <h3 class="text-2xl font-black text-[#1F1F20] dark:text-white mb-3">
                  {{ plan.title }}
                </h3>
                <p class="text-sm font-medium text-[#606D80] dark:text-nature-400 h-10">
                  {{ plan.description }}
                </p>
              </div>

              <!-- Animação do Preço ao trocar a chave -->
              <div class="mb-8 flex items-baseline gap-2 relative z-10 h-16">
                <!-- Transition no Value -->
                <div class="overflow-hidden flex items-center">
                  <h4 :class="['text-5xl font-black tracking-tighter transition-all transform duration-500', plan.highlight ? 'text-[#2B4C7E] dark:text-brand-400' : 'text-[#1F1F20] dark:text-white']">
                    {{ isYearly ? plan.price.year : plan.price.month }}
                  </h4>
                </div>
                <span class="text-[#606D80] font-semibold align-bottom">/ {{ isYearly ? 'ano' : 'mês' }}</span>
              </div>

              <div class="flex-1 relative z-10 w-full">
                <ul class="space-y-4 mb-8">
                  <li
                    v-for="(feature, i) in plan.features"
                    :key="i"
                    class="flex items-start gap-4"
                  >
                    <div :class="['mt-0.5 rounded-full p-1 shrink-0 flex items-center justify-center bg-[#567EBB]/10 text-[#567EBB]']">
                      <UIcon
                        name="i-heroicons-check-solid"
                        class="w-3.5 h-3.5"
                      />
                    </div>
                    <span class="text-sm font-semibold text-[#1F1F20] dark:text-nature-200">{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <!-- Botão Pika baseado na hierarquia -->
              <UButton
                block
                size="xl"
                class="rounded-xl relative z-10 font-bold tracking-wide transition-all duration-300 hover:scale-[1.02]"
                :class="[
                  plan.highlight
                    ? 'bg-[#2B4C7E] hover:bg-[#567EBB] text-white shadow-[0_10px_20px_-10px_rgba(43,76,126,0.6)]'
                    : 'bg-[#DCE0E6] hover:bg-[#c6cdd6] text-[#1F1F20] border-transparent'
                ]"
                to="/signup"
              >
                {{ plan.button.label }}
              </UButton>
            </div>
          </div>
        </template>
      </div>

      <!-- 7. Conversão Imediata (Check de Objeção) -->
      <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-[#606D80] dark:text-nature-400">
        <div class="flex items-center gap-2.5">
          <div class="p-1.5 bg-[#DCE0E6]/50 dark:bg-nature-800/50 rounded-full">
            <UIcon
              name="i-heroicons-credit-card"
              class="w-4 h-4 text-[#567EBB]"
            />
          </div>
          No credit card required
        </div>
        <div class="flex items-center gap-2.5">
          <div class="p-1.5 bg-[#DCE0E6]/50 dark:bg-nature-800/50 rounded-full">
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-4 h-4 text-[#567EBB]"
            />
          </div>
          Cancel anytime
        </div>
        <div class="flex items-center gap-2.5">
          <div class="p-1.5 bg-[#DCE0E6]/50 dark:bg-nature-800/50 rounded-full">
            <UIcon
              name="i-heroicons-lock-closed"
              class="w-4 h-4 text-[#567EBB]"
            />
          </div>
          Secure payment via Stripe
        </div>
      </div>

      <!-- 4. Melhoria no Social Proof -->
      <div class="mt-20 text-center border-t border-[#606D80]/10 dark:border-nature-800/40 pt-16">
        <div class="flex items-center justify-center -space-x-3 mb-5 hover:space-x-1 transition-all duration-500">
          <img
            class="w-12 h-12 rounded-full border-[3px] border-[#DCE0E6] dark:border-nature-950 object-cover"
            src="https://i.pravatar.cc/150?img=11"
            alt="Avatar"
          >
          <img
            class="w-12 h-12 rounded-full border-[3px] border-[#DCE0E6] dark:border-nature-950 object-cover"
            src="https://i.pravatar.cc/150?img=12"
            alt="Avatar"
          >
          <img
            class="w-12 h-12 rounded-full border-[3px] border-[#DCE0E6] dark:border-nature-950 object-cover"
            src="https://i.pravatar.cc/150?img=33"
            alt="Avatar"
          >
          <img
            class="w-12 h-12 rounded-full border-[3px] border-[#DCE0E6] dark:border-nature-950 object-cover"
            src="https://i.pravatar.cc/150?img=60"
            alt="Avatar"
          >
          <div class="w-12 h-12 rounded-full border-[3px] border-[#DCE0E6] dark:border-nature-950 bg-[#2B4C7E] flex items-center justify-center text-xs font-black text-white shadow-inner z-10">
            +500
          </div>
        </div>
        <p class="text-[#606D80] dark:text-nature-400 font-medium text-lg">
          Junte-se a <span class="font-bold text-[#1F1F20] dark:text-white">500+ profissionais</span> que já automatizaram a agenda.
        </p>
      </div>

      <!-- 5. Tabela de Comparação "Sticky" -->
      <div class="mt-32 max-w-5xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold text-[#1F1F20] dark:text-white tracking-tight mb-4">
            Compare os Planos
          </h2>
          <p class="text-[#606D80] dark:text-nature-400 font-medium">
            Transparência total no que oferecemos para o seu negócio.
          </p>
        </div>

        <!-- Glassmorphism Container da Tabela -->
        <div class="bg-white/60 dark:bg-nature-900/40 backdrop-blur-2xl border border-[#606D80]/20 rounded-3xl overflow-hidden shadow-2xl">
          <table class="w-full text-left border-collapse">
            <!-- Cabeçalho Sticky -->
            <thead class="sticky top-20 bg-white/90 dark:bg-nature-900/90 backdrop-blur-xl z-20 shadow-sm border-b border-[#606D80]/10">
              <tr>
                <th class="p-6 md:p-8 font-bold text-[#606D80] w-1/3 text-sm tracking-wider uppercase">
                  Funcionalidades
                </th>
                <th class="p-6 md:p-8 font-black text-[#1F1F20] dark:text-white text-center w-2/9 text-lg">
                  Iniciante
                </th>
                <th class="p-6 md:p-8 font-black text-[#2B4C7E] dark:text-brand-400 text-center w-2/9 text-lg">
                  Profissional
                </th>
                <th class="p-6 md:p-8 font-black text-[#1F1F20] dark:text-white text-center w-2/9 text-lg">
                  Equipa
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#606D80]/10 dark:divide-nature-800/50 text-sm">
              <!-- Linhas da Tabela -->
              <tr class="hover:bg-white/80 dark:hover:bg-nature-800/30 transition-colors group">
                <td class="p-6 font-bold text-[#1F1F20] dark:text-nature-200">
                  Agendamentos Mensais
                </td>
                <td class="p-6 text-center text-[#606D80] dark:text-nature-400 font-medium">
                  Até 100
                </td>
                <td class="p-6 text-center font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1F1F20] to-[#2B4C7E]">
                  Ilimitados
                </td>
                <td class="p-6 text-center text-[#1F1F20] dark:text-white font-bold">
                  Ilimitados
                </td>
              </tr>
              <tr class="hover:bg-white/80 dark:hover:bg-nature-800/30 transition-colors group">
                <td class="p-6 font-bold text-[#1F1F20] dark:text-nature-200">
                  Lembretes WhatsApp
                </td>
                <td class="p-6 text-center">
                  <UIcon
                    name="i-heroicons-minus"
                    class="w-6 h-6 mx-auto text-[#606D80]/20"
                  />
                </td>
                <td class="p-6 text-center">
                  <UIcon
                    name="i-heroicons-check-circle-solid"
                    class="w-6 h-6 mx-auto text-[#567EBB] group-hover:scale-125 transition-transform"
                  />
                </td>
                <td class="p-6 text-center">
                  <UIcon
                    name="i-heroicons-check-circle-solid"
                    class="w-6 h-6 mx-auto text-[#567EBB]"
                  />
                </td>
              </tr>
              <tr class="hover:bg-white/80 dark:hover:bg-nature-800/30 transition-colors">
                <td class="p-6 font-bold text-[#1F1F20] dark:text-nature-200">
                  Dashboard de Lucros
                </td>
                <td class="p-6 text-center">
                  <UIcon
                    name="i-heroicons-minus"
                    class="w-6 h-6 mx-auto text-[#606D80]/20"
                  />
                </td>
                <td class="p-6 text-center">
                  <UIcon
                    name="i-heroicons-check-circle-solid"
                    class="w-6 h-6 mx-auto text-[#567EBB]"
                  />
                </td>
                <td class="p-6 text-center">
                  <UIcon
                    name="i-heroicons-check-circle-solid"
                    class="w-6 h-6 mx-auto text-[#567EBB]"
                  />
                </td>
              </tr>
            </tbody>
            <!-- Tfoot para call actions de fecho -->
            <tfoot class="bg-[#f0f4fa]/50 dark:bg-nature-900/60 border-t border-[#606D80]/10">
              <tr>
                <td class="p-6" />
                <td class="p-6 text-center">
                  <UButton
                    variant="ghost"
                    color="gray"
                    size="sm"
                    to="/signup"
                    class="font-bold text-[#1F1F20]"
                  >
                    Testar Iniciante
                  </UButton>
                </td>
                <td class="p-6 text-center">
                  <button class="bg-[#2B4C7E] hover:bg-[#567EBB] text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-md hover:scale-105 w-full">
                    Assinar Agora
                  </button>
                </td>
                <td class="p-6 text-center">
                  <UButton
                    variant="ghost"
                    color="gray"
                    size="sm"
                    to="/signup"
                    class="font-bold text-[#1F1F20]"
                  >
                    Testar Equipa
                  </UButton>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-32 max-w-3xl mx-auto px-6 mb-16 relative">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#567EBB]/5 blur-[100px] rounded-full -z-10" />
        <div class="text-center mb-10">
          <h2 class="text-3xl font-black text-[#1F1F20] dark:text-white tracking-tight">
            {{ page.faq.title }}
          </h2>
          <p class="text-[#606D80] dark:text-nature-400 mt-3 font-medium">
            {{ page.faq.description }}
          </p>
        </div>
        <UAccordion
          :items="page.faq.items"
          multiple
          class="bg-white/70 dark:bg-nature-900/40 backdrop-blur-2xl border border-[#606D80]/20 rounded-[2rem] p-4 shadow-xl"
        />
      </div>
    </div>
  </div>
</template>

<style>
/* Utilities específicas para a Pricing Page */
.perspective-1000 {
  perspective: 1000px;
}
</style>
