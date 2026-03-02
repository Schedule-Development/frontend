<script setup lang="ts">
import { ref, onMounted } from 'vue'

const title = 'O Aplicativo para Barbeiros que Querem Crescer'
const description = 'A gestão automática, os agendamentos fáceis e o controlo financeiro numa única plataforma inteligente. Tudo o que precisa para focar naquilo que faz melhor: transformar o visual dos seus clientes.'

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

// Lógica de ScrollReveal nativa elegante usando Vue 3 + IntersectionObserver
const observerElements = ref<HTMLElement[]>([])

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0')
        entry.target.classList.remove('opacity-0', 'translate-y-12')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
  
  observerElements.value.forEach(el => observer.observe(el))
})

const vSlideUp = {
  mounted: (el: HTMLElement) => {
    // Estado inicial invisível e para baixo
    el.classList.add('transition-all', 'duration-1000', 'ease-[cubic-bezier(0.25,0.8,0.25,1)]', 'opacity-0', 'translate-y-12')
    observerElements.value.push(el)
  }
}
</script>

<template>
  <div class="bg-white dark:bg-neutral-950 font-sans selection:bg-primary-500 selection:text-white overflow-hidden">
    
    <!-- === HERO SECTION === -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center justify-center text-center">
      <!-- Glow effect (Luz de Fundo da Cor Primária) -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-primary-500/15 dark:bg-primary-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div class="px-6 mx-auto max-w-5xl z-10" v-slide-up>
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 text-sm font-medium tracking-wide mb-8 border border-neutral-200 dark:border-neutral-700/50 shadow-sm">
          <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-primary-500" />
          <span class="opacity-95">A revolução tecnológica da sua Barbearia</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-6 leading-[1.1]">
          O Aplicativo para <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600">Barbeiros</span> <br class="hidden md:block"/> que querem crescer.
        </h1>
        
        <p class="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          {{ description }}
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <UButton 
            size="xl" 
            color="primary" 
            class="rounded-full font-bold px-8 shadow-xl shadow-primary-500/20 hover:scale-105 transition-transform"
            to="/signup"
          >
            Começar Teste Grátis
          </UButton>
          <UButton 
            size="xl" 
            color="gray" 
            variant="ghost" 
            class="rounded-full font-semibold px-8 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            to="#funcionalidades"
          >
            Ver Funcionalidades <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
          </UButton>
        </div>
      </div>
      
      <!-- Abstract Floating Dashboard Mockup -->
      <div class="mt-20 relative w-full max-w-5xl px-6" v-slide-up>
         <div class="relative w-full aspect-[16/9] bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl border border-neutral-200/50 dark:border-neutral-800 overflow-hidden flex flex-col z-10">
            <!-- Simulated App Topbar -->
            <div class="h-14 border-b border-neutral-100 dark:border-neutral-800/50 flex items-center px-6 gap-2 bg-neutral-50/50 dark:bg-neutral-900/50">
               <div class="flex gap-2">
                  <div class="w-3.5 h-3.5 rounded-full bg-red-400/90 shadow-sm border border-red-500/20"></div>
                  <div class="w-3.5 h-3.5 rounded-full bg-amber-400/90 shadow-sm border border-amber-500/20"></div>
                  <div class="w-3.5 h-3.5 rounded-full bg-emerald-400/90 shadow-sm border border-emerald-500/20"></div>
               </div>
               <div class="mx-auto h-6 w-48 bg-neutral-200/50 dark:bg-neutral-800 rounded flex items-center justify-center">
                  <div class="h-1.5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div>
               </div>
            </div>
            <!-- App Content Simulation -->
            <div class="flex-1 p-8 grid grid-cols-12 gap-8 bg-neutral-50/30 dark:bg-neutral-950/20">
               <!-- Sidebar -->
               <div class="hidden md:flex col-span-3 rounded-2xl bg-neutral-100/80 dark:bg-neutral-800/50 flex-col gap-4 p-5">
                  <div class="h-10 w-full bg-neutral-200/50 dark:bg-neutral-700/50 rounded-xl"></div>
                  <div class="h-10 w-full bg-neutral-200/50 dark:bg-neutral-700/50 rounded-xl"></div>
                  <div class="h-10 w-full bg-neutral-200/50 dark:bg-neutral-700/50 rounded-xl"></div>
               </div>
               <!-- Main Content -->
               <div class="col-span-12 md:col-span-9 flex flex-col gap-6">
                  <div class="flex flex-col sm:flex-row gap-4">
                    <div class="h-28 flex-1 bg-neutral-100/80 dark:bg-neutral-800/50 rounded-3xl p-5 flex flex-col justify-end">
                      <div class="h-3 w-16 bg-neutral-300 dark:bg-neutral-600 rounded mb-3"></div>
                      <div class="h-6 w-24 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
                    </div>
                    <!-- Highlighted primary stat -->
                    <div class="h-28 flex-1 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-800/50 p-5 flex flex-col justify-end">
                      <div class="h-3 w-20 bg-primary-200 dark:bg-primary-700 rounded mb-3"></div>
                      <div class="h-6 w-24 bg-primary-400 dark:bg-primary-500 rounded"></div>
                    </div>
                    <div class="h-28 flex-1 bg-neutral-100/80 dark:bg-neutral-800/50 rounded-3xl p-5 flex flex-col justify-end">
                      <div class="h-3 w-16 bg-neutral-300 dark:bg-neutral-600 rounded mb-3"></div>
                      <div class="h-6 w-24 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
                    </div>
                  </div>
                  <div class="flex-1 bg-neutral-100/80 dark:bg-neutral-800/50 rounded-3xl p-6">
                     <div class="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
                     <div class="h-full w-full border border-neutral-200 border-dashed dark:border-neutral-700 rounded-xl"></div>
                  </div>
               </div>
            </div>
         </div>
         
         <!-- Elemento flutuante esquerdo (Notificação Verde) -->
         <div class="absolute -left-2 md:-left-8 top-16 md:top-24 z-20 bg-white/90 dark:bg-neutral-800/90 p-4 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 animate-float backdrop-blur-xl">
            <div class="flex items-center gap-4">
               <div class="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <UIcon name="i-heroicons-check-circle-solid" class="w-6 h-6" />
               </div>
               <div>
                  <p class="text-sm font-bold text-neutral-900 dark:text-white">Corte com Barba</p>
                  <p class="text-xs font-medium text-neutral-500 dark:text-neutral-400">Hoje, 14:30 - André F.</p>
               </div>
            </div>
         </div>
         
         <!-- Elemento flutuante direito (Notificação Dinheiro Primário) -->
         <div class="absolute -right-2 md:-right-8 bottom-16 md:bottom-24 z-20 bg-white/90 dark:bg-neutral-800/90 p-4 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 animate-float-delayed backdrop-blur-xl">
            <div class="flex items-center gap-4">
               <div class="p-2.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl">
                  <UIcon name="i-heroicons-banknotes-solid" class="w-6 h-6" />
               </div>
               <div>
                  <p class="text-sm font-bold text-neutral-900 dark:text-white">+ 35,00 €</p>
                  <p class="text-xs font-medium text-neutral-500 dark:text-neutral-400">Pagamento concluído</p>
               </div>
            </div>
         </div>
      </div>
    </section>

    <!-- === SOCIAL PROOF SECTION === -->
    <section class="py-12 border-y border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/30">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <p class="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-[0.2em] uppercase mb-8">Mais de 500 profissionais confiam em nós</p>
        <div class="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 hover:opacity-100 transition-opacity duration-500 filter grayscale">
           <h3 class="text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2"><UIcon name="i-heroicons-scissors" class="w-6 h-6" /> BarberKing</h3>
           <h3 class="text-2xl font-bold text-neutral-900 dark:text-white uppercase tracking-widest">SharpCuts</h3>
           <h3 class="text-2xl font-serif text-neutral-900 dark:text-white italic">Gentlemen's</h3>
           <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">Fade&Co</h3>
           <h3 class="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">THE SHOP</h3>
        </div>
      </div>
    </section>

    <!-- === FEATURES SECTION === -->
    <section id="funcionalidades" class="py-32 max-w-7xl mx-auto px-6">
      <div class="text-center mb-20" v-slide-up>
        <span class="text-primary-600 dark:text-primary-400 font-bold tracking-wider text-sm uppercase mb-3 block">Ferramentas Essenciais</span>
        <h2 class="text-4xl md:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">Tudo para manter a cadeira cheia.</h2>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 mt-5 max-w-2xl mx-auto">Deixámos a parte burocrática da gestão para os algoritmos. O seu único trabalho vai ser ligar a máquina e surpreender clientes.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 relative">
        <!-- Linha conectiva invisível que os novos designs costumam ter atrás dos quadrados... -->
        
        <!-- Feature 1 -->
        <div class="group relative bg-white dark:bg-neutral-900 p-10 rounded-[2.5rem] shadow-sm border border-neutral-100 dark:border-neutral-800/80 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden" v-slide-up>
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
          <div class="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/30 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
            <UIcon name="i-heroicons-calendar-days" class="w-8 h-8" />
          </div>
          <h4 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Agenda Inteligente</h4>
          <p class="text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">Os seus clientes acedem ao seu link próprio e marcam nos horários disponíveis. Sem chamadas na hora errada, sem choques.</p>
        </div>

        <!-- Feature 2 -->
        <div class="group relative bg-white dark:bg-neutral-900 p-10 rounded-[2.5rem] shadow-sm border border-neutral-100 dark:border-neutral-800/80 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden" v-slide-up>
          <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
          <div class="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-inner">
            <UIcon name="i-heroicons-bell-alert" class="w-8 h-8" />
          </div>
          <h4 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Lembretes WhatsApp</h4>
          <p class="text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">Reduza faltas em 90%. O sistema envia automaticamente SMS ou WhatsApp a avisar o cliente no dia do corte.</p>
        </div>

        <!-- Feature 3 -->
        <div class="group relative bg-white dark:bg-neutral-900 p-10 rounded-[2.5rem] shadow-sm border border-neutral-100 dark:border-neutral-800/80 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden" v-slide-up>
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
          <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
            <UIcon name="i-heroicons-chart-pie" class="w-8 h-8" />
          </div>
          <h4 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Métricas Preciosas</h4>
          <p class="text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">Acompanhe lucros totais, os cortes mais pedidos e o fecho de caixa num painel visual incrivelmente limpo.</p>
        </div>
      </div>
    </section>

    <!-- === CTA BOTTOM SECTION === -->
    <section class="py-24 px-6 relative mb-12">
      <!-- Decorator rings -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
         <div class="w-[800px] h-[800px] border-[1px] border-primary-500/10 rounded-full absolute top-[10%]"></div>
         <div class="w-[1200px] h-[1200px] border-[1px] border-primary-500/5 rounded-full absolute top-[5%]"></div>
      </div>
      
      <div class="max-w-5xl mx-auto bg-neutral-950 dark:bg-neutral-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl" v-slide-up>
        <!-- Overlay Gradient -->
        <div class="absolute inset-0 bg-gradient-to-tr from-primary-600/30 via-transparent to-primary-900/20 pointer-events-none"></div>
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[80px] rounded-full"></div>
        
        <h2 class="text-4xl md:text-6xl font-black text-white mb-6 relative z-10 tracking-tight">Pronto para subir ao <br class="hidden sm:block"/> próximo nível?</h2>
        <p class="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto relative z-10 font-medium">
          Esqueça os cadernos manuscritos e agendas confusas. Crie a sua conta num minuto e revolucione o seu ambiente de trabalho.
        </p>
        
        <div class="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <UButton 
            size="xl" 
            color="primary" 
            class="rounded-full shadow-[0_0_40px_rgba(var(--color-primary-500),0.3)] px-10 font-bold hover:scale-105 transition-transform"
            to="/signup"
          >
            Criar Conta Gratuita <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
          </UButton>
          <span class="text-neutral-400 text-sm mt-3 sm:mt-0 sm:ml-4 flex items-center gap-1.5 font-medium">
            <UIcon name="i-heroicons-shield-check-solid" class="w-4 h-4 text-emerald-500" />
            Cancele quando quiser.
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
@keyframes float {
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-12px) scale(1.02); }
  100% { transform: translateY(0px) scale(1); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-float-delayed {
  animation: float 6s ease-in-out 3s infinite;
}
</style>
