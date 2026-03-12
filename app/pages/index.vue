<script setup lang="ts">
import { ref, onMounted } from 'vue'

const title = 'The App for Barbers Who Want to Grow'
const description = 'Automatic management, easy scheduling and financial control in a single intelligent platform. Everything you need to focus on what you do best: transforming your clients\' looks.'

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
    entries.forEach((entry) => {
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
    // Estado inicial invisível e para baixo (Motion System)
    el.classList.add('transition-all', 'duration-[var(--duration-slow)]', 'ease-[var(--ease-indie)]', 'opacity-0', 'translate-y-12')
    observerElements.value.push(el)
  }
}
</script>

<template>
  <div class="bg-[#0B1F3A] min-h-screen font-sans selection:bg-[#FF6A00] selection:text-white overflow-hidden text-white">
    <!-- === HERO SECTION === -->
    <section class="relative pt-40 pb-24 lg:pt-56 lg:pb-40 flex flex-col items-center justify-center text-center">
      <!-- Glow effect (Azul como Luz) -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-[#2B4C7E]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div
        v-slide-up
        class="px-6 mx-auto max-w-5xl z-10"
      >
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF6A00] text-white text-sm font-medium tracking-wide mb-8 shadow-sm">
          <UIcon
            name="i-heroicons-rocket-launch"
            class="w-4 h-4 text-white"
          />
          <span class="opacity-95 text-white">The technological revolution for your Barbershop</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white">
          The App for Barbershops <br class="hidden md:block"> that want to grow.
        </h1>

        <p class="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-[1.8] font-medium">
          <strong class="text-white">Automatic management</strong>, easy scheduling and financial control in an
          intelligent platform. Everything you need to focus on what you do best:
          transforming <strong class="text-white">your clients' look</strong>.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <UButton
            size="xl"
            class="rounded-full font-bold px-8 shadow-sm bg-[#FF6A00] hover:bg-[#FF8533] text-white hover:shadow-[0_8px_20px_-6px_rgba(255,106,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 border-none"
            to="/pricing"
          >
            See Plans
          </UButton>
          <UButton
            size="xl"
            variant="solid"
            class="rounded-full font-medium px-8 text-white bg-[#1F2937] hover:bg-[#111827] border border-white/5 shadow-sm transition-all duration-300"
            to="#features"
          >
            See Features <UIcon
              name="i-heroicons-arrow-right"
              class="w-4 h-4 ml-1"
            />
          </UButton>
        </div>
      </div>

      <!-- Abstract Floating Dashboard Mockup - Glassmorphism -->
      <div
        v-slide-up
        class="mt-20 relative w-full max-w-5xl px-6"
      >
        <div class="relative w-full aspect-[16/9] bg-[#DCE0E6]/40 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(43,76,126,0.1)] border border-[#606D80]/20 overflow-hidden flex flex-col z-10">
          <!-- Simulated App Topbar -->
          <div class="h-14 border-b border-[#606D80]/10 flex items-center px-6 gap-2 bg-[#DCE0E6]/30">
            <div class="flex gap-2">
              <div class="w-3.5 h-3.5 rounded-full bg-[#EF4444] shadow-sm border border-[#EF4444]" />
              <div class="w-3.5 h-3.5 rounded-full bg-[#D97706] shadow-sm border border-[#D97706]" />
              <div class="w-3.5 h-3.5 rounded-full bg-[#10B981] shadow-sm border border-[#10B981]" />
            </div>
            <div class="mx-auto h-6 w-48 bg-[#DCE0E6]/50 rounded flex items-center justify-center border border-[#606D80]/10">
              <div class="h-1.5 w-24 bg-[#DCE0E6] rounded-full" />
            </div>
          </div>
          <!-- App Content Simulation -->
          <div class="flex-1 p-8 grid grid-cols-12 gap-8 bg-transparent">
            <!-- Sidebar -->
            <div class="hidden md:flex col-span-3 rounded-2xl bg-[#DCE0E6]/50 flex-col gap-3 p-4 border border-[#606D80]/5">
              <div class="flex items-center gap-2 px-3 py-2 bg-[#2B4C7E]/10 rounded-lg border border-[#2B4C7E]/20">
                <div class="w-2 h-2 rounded-full bg-[#2B4C7E]" />
                <div class="h-2 w-16 bg-[#2B4C7E]/30 rounded" />
              </div>
              <div class="flex items-center gap-2 px-3 py-2 bg-white/30 rounded-lg">
                <div class="w-2 h-2 rounded-full bg-[#606D80]/30" />
                <div class="h-2 w-20 bg-[#DCE0E6] rounded" />
              </div>
              <div class="flex items-center gap-2 px-3 py-2 bg-white/30 rounded-lg">
                <div class="w-2 h-2 rounded-full bg-[#606D80]/30" />
                <div class="h-2 w-14 bg-[#DCE0E6] rounded" />
              </div>
            </div>
            <!-- Main Content -->
            <div class="col-span-12 md:col-span-9 flex flex-col gap-6">
              <!-- Stats Cards -->
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="h-28 flex-1 bg-[#DCE0E6]/50 rounded-3xl p-5 flex flex-col justify-between border border-[#606D80]/5">
                  <p class="text-[10px] font-bold text-[#606D80] uppercase tracking-wider">Agendamentos</p>
                  <div class="flex items-baseline gap-2">
                    <p class="text-3xl font-extrabold text-[#1F1F20]">12</p>
                    <p class="text-xs text-[#10B981] font-semibold">+3 hoje</p>
                  </div>
                </div>
                <!-- Highlighted primary stat -->
                <div class="h-28 flex-1 bg-[#2B4C7E]/10 rounded-3xl border border-[#2B4C7E]/20 p-5 flex flex-col justify-between">
                  <p class="text-[10px] font-bold text-[#2B4C7E] uppercase tracking-wider">Receita Hoje</p>
                  <div class="flex items-baseline gap-2">
                    <p class="text-3xl font-extrabold text-[#1F1F20]">R$ 850</p>
                    <p class="text-xs text-[#2B4C7E] font-semibold">73% da meta</p>
                  </div>
                </div>
                <div class="h-28 flex-1 bg-[#DCE0E6]/50 rounded-3xl p-5 flex flex-col justify-between border border-[#606D80]/5">
                  <p class="text-[10px] font-bold text-[#606D80] uppercase tracking-wider">Clientes</p>
                  <div class="flex items-baseline gap-2">
                    <p class="text-3xl font-extrabold text-[#1F1F20]">8</p>
                    <p class="text-xs text-[#606D80] font-semibold">atendidos</p>
                  </div>
                </div>
              </div>
              <!-- Timeline / Appointments -->
              <div class="flex-1 bg-[#DCE0E6]/50 rounded-3xl p-6 border border-[#606D80]/5">
                <div class="flex items-center justify-between mb-5">
                  <p class="text-sm font-bold text-[#1F1F20]">Today's Appointments</p>
                  <div class="h-2 w-16 bg-[#DCE0E6] rounded" />
                </div>
                <div class="space-y-3">
                  <!-- Appointment 1 - Completed -->
                  <div class="flex items-center gap-3 p-3 bg-[#10B981]/5 rounded-xl border border-[#10B981]/20">
                    <div class="w-8 h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center shrink-0">
                      <div class="w-2 h-2 rounded-full bg-[#10B981]" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-[#1F1F20] truncate">14:30 - Haircut + Beard</p>
                      <p class="text-[10px] text-[#606D80]">André F.</p>
                    </div>
                    <p class="text-xs font-bold text-[#10B981]">$ 85</p>
                  </div>
                  <!-- Appointment 2 - In Progress -->
                  <div class="flex items-center gap-3 p-3 bg-[#2B4C7E]/5 rounded-xl border border-[#2B4C7E]/20">
                    <div class="w-8 h-8 rounded-lg bg-[#2B4C7E]/20 flex items-center justify-center shrink-0">
                      <div class="w-2 h-2 rounded-full bg-[#2B4C7E] animate-pulse" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-[#1F1F20] truncate">16:00 - Classic Cut</p>
                      <p class="text-[10px] text-[#606D80]">In progress</p>
                    </div>
                    <p class="text-xs font-bold text-[#2B4C7E]">$ 80</p>
                  </div>
                  <!-- Appointment 3 - Scheduled -->
                  <div class="flex items-center gap-3 p-3 bg-white/40 rounded-xl border border-[#606D80]/10">
                    <div class="w-8 h-8 rounded-lg bg-[#606D80]/10 flex items-center justify-center shrink-0">
                      <div class="w-2 h-2 rounded-full bg-[#606D80]/40" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-[#1F1F20] truncate">17:00 - Beard + Design</p>
                      <p class="text-[10px] text-[#606D80]">John Doe</p>
                    </div>
                    <p class="text-xs font-bold text-[#606D80]">$ 120</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating element left -->
        <div class="absolute -left-2 md:-left-8 top-16 md:top-24 z-20 bg-[#DCE0E6]/80 p-4 rounded-2xl shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)] border border-[#606D80]/10 animate-float backdrop-blur-xl">
          <div class="flex items-center gap-4">
            <div class="p-2.5 bg-[#10B981]/20 text-[#10B981] rounded-xl">
              <UIcon
                name="i-heroicons-check-circle-solid"
                class="w-6 h-6"
              />
            </div>
            <div>
              <p class="text-sm font-bold text-[#1F1F20]">
                Haircut with Beard
              </p>
              <p class="text-xs font-medium text-[#606D80]">
                Today, 14:30 - André F.
              </p>
            </div>
          </div>
        </div>

        <!-- Floating element right -->
        <div class="absolute -right-2 md:-right-8 bottom-16 md:bottom-24 z-20 bg-[#DCE0E6]/80 p-4 rounded-2xl shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)] border border-[#606D80]/10 animate-float-delayed backdrop-blur-xl">
          <div class="flex items-center gap-4">
            <div class="p-2.5 bg-[#10B981]/20 text-[#10B981] rounded-xl">
              <UIcon
                name="i-heroicons-currency-dollar"
                class="w-6 h-6"
              />
            </div>
            <div>
              <p class="text-sm font-bold text-[#1F1F20]">
                + $ 85.00
              </p>
              <p class="text-xs font-medium text-[#606D80]">
                Payment received
              </p>
            </div>
          </div>
        </div>
        
        <!-- Floating element top right (Notification) -->
        <div class="absolute -right-2 md:-right-8 top-32 md:top-40 z-20 bg-[#DCE0E6]/80 p-4 rounded-2xl shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)] border border-[#606D80]/10 animate-float backdrop-blur-xl">
          <div class="flex items-center gap-4">
            <div class="p-2.5 bg-[#2B4C7E]/10 text-[#2B4C7E] rounded-xl">
              <UIcon
                name="i-heroicons-bell-alert"
                class="w-6 h-6"
              />
            </div>
            <div>
              <p class="text-sm font-bold text-[#1F1F20]">
                New Appointment
              </p>
              <p class="text-xs font-medium text-[#606D80]">
                Tomorrow at 10:30
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- === SOCIAL PROOF SECTION === -->
    <section class="py-12 border-y border-[#606D80]/10 bg-transparent">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <p class="text-xs font-bold text-[#606D80] tracking-[0.2em] uppercase mb-8">
          More than 500 professionals trust us
        </p>
        <div class="flex flex-wrap justify-center items-center gap-10 md:gap-20 text-[#606D80]/70 hover:[&>*]:text-[#1F1F20] transition-colors duration-[var(--duration-slow)]">
          <h3 class="text-2xl font-black flex items-center gap-2 transition-colors duration-[var(--duration-medium)]">
            <UIcon
              name="i-heroicons-scissors"
              class="w-6 h-6"
            /> BarberKing
          </h3>
          <h3 class="text-2xl font-bold uppercase tracking-widest transition-colors duration-[var(--duration-medium)]">
            SharpCuts
          </h3>
          <h3 class="text-2xl font-serif italic transition-colors duration-[var(--duration-medium)]">
            Gentlemen's
          </h3>
          <h3 class="text-2xl font-bold transition-colors duration-[var(--duration-medium)]">
            Fade&Co
          </h3>
          <h3 class="text-2xl font-black tracking-tighter transition-colors duration-[var(--duration-medium)]">
            THE SHOP
          </h3>
        </div>
      </div>
    </section>

    <!-- === FEATURES SECTION (Bento Grid) === -->
    <section
      id="features"
      class="py-32 max-w-7xl mx-auto px-6"
    >
      <div
        v-slide-up
        class="text-center mb-20"
      >
        <span class="text-[#FF6A00] font-bold tracking-wider text-sm uppercase mb-3 block">Essential Tools</span>
        <h2 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Everything to keep the chair full.
        </h2>
        <p class="text-lg text-gray-400 mt-5 max-w-2xl mx-auto">
          We left the bureaucratic part of management to the algorithms. Your only job will be to turn on the machine and surprise clients.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 relative">
        <!-- Feature 1 (Bento Largo) -->
        <div
          v-slide-up
          class="md:col-span-2 group relative bg-[#1F2937]/50 backdrop-blur-md p-12 rounded-[2.5rem] shadow-sm border border-white/10 hover:shadow-md hover:border-white/20 transition-all duration-[var(--duration-medium)] ease-[var(--ease-indie)] hover:-translate-y-1 overflow-hidden"
        >
          <div class="w-16 h-16 bg-[#FF6A00]/10 text-[#FF6A00] border border-[#FF6A00]/20 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform duration-[var(--duration-medium)] ease-[var(--ease-indie)]">
            <UIcon
              name="i-heroicons-calendar-days"
              class="w-8 h-8"
            />
          </div>
          <h4 class="text-2xl font-bold text-white mb-4">
            Smart Schedule
          </h4>
          <p class="text-gray-400 font-medium leading-relaxed max-w-lg">
            Your clients access your own link and book in available times. No calls at the wrong time, no schedule clashes or communication failures.
          </p>
        </div>

        <!-- Feature 2 -->
        <div
          v-slide-up
          class="group relative bg-[#1F2937]/50 backdrop-blur-md p-12 rounded-[2.5rem] shadow-sm border border-white/10 hover:shadow-md hover:border-white/20 transition-all duration-[var(--duration-medium)] ease-[var(--ease-indie)] hover:-translate-y-1 overflow-hidden"
        >
          <div class="w-16 h-16 bg-[#FF6A00]/10 text-[#FF6A00] border border-[#FF6A00]/20 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform duration-[var(--duration-medium)] ease-[var(--ease-indie)]">
            <UIcon
              name="i-heroicons-bell-alert"
              class="w-8 h-8"
            />
          </div>
          <h4 class="text-2xl font-bold text-white mb-4">
            WhatsApp Reminders
          </h4>
          <p class="text-gray-400 font-medium leading-relaxed">
            Reduce no-shows by 90%. Automatic sending to the client on the day of the cut (or booking).
          </p>
        </div>

        <!-- Feature 3 -->
        <div
          v-slide-up
          class="group relative bg-[#1F2937]/50 backdrop-blur-md p-12 rounded-[2.5rem] shadow-sm border border-white/10 hover:shadow-md hover:border-white/20 transition-all duration-[var(--duration-medium)] ease-[var(--ease-indie)] hover:-translate-y-1 overflow-hidden"
        >
          <div class="w-16 h-16 bg-[#FF6A00]/10 text-[#FF6A00] border border-[#FF6A00]/20 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform duration-[var(--duration-medium)] ease-[var(--ease-indie)]">
            <UIcon
              name="i-heroicons-chart-pie"
              class="w-8 h-8"
            />
          </div>
          <h4 class="text-2xl font-bold text-white mb-4">
            Valuable Metrics
          </h4>
          <p class="text-gray-400 font-medium leading-relaxed">
            Track profits and most requested cuts through a clear control panel.
          </p>
        </div>

        <!-- Feature 4 (Bento Largo) -->
        <div
          v-slide-up
          class="md:col-span-2 group relative bg-[#1F2937]/50 backdrop-blur-md p-12 rounded-[2.5rem] shadow-sm border border-white/10 hover:shadow-md hover:border-white/20 transition-all duration-[var(--duration-medium)] ease-[var(--ease-indie)] hover:-translate-y-1 overflow-hidden flex flex-col md:flex-row items-center gap-12 justify-between"
        >
          <div class="flex-1">
            <div class="w-16 h-16 bg-[#FF6A00]/10 text-[#FF6A00] border border-[#FF6A00]/20 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform duration-[var(--duration-medium)] ease-[var(--ease-indie)]">
              <UIcon
                name="i-heroicons-arrows-right-left"
                class="w-8 h-8"
              />
            </div>
            <h4 class="text-2xl font-bold text-white mb-4">
            Integrations (n8n)
          </h4>
          <p class="text-gray-400 font-medium leading-relaxed">
            Automations ready to connect with your accounting, automatic payments and flows via webhook. Everything interconnected in a perfect ecosystem.
          </p>
          </div>
          <!-- Linhas de automação (Visual) -->
          <div class="w-full md:w-1/3 flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded bg-[#1F2937] border border-white/10 flex items-center justify-center">
                <UIcon
                  name="i-heroicons-credit-card"
                  class="text-gray-400 w-6 h-6"
                />
              </div> <div class="flex-1 h-px bg-white/10" /> <div class="w-2 h-2 rounded-full bg-[#FF6A00]" />
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded bg-[#1F2937] border border-white/10 flex items-center justify-center">
                <UIcon
                  name="i-heroicons-calendar"
                  class="text-gray-400 w-6 h-6"
                />
              </div> <div class="flex-1 h-px bg-white/10" /> <div class="w-2 h-2 rounded-full bg-[#FF6A00]" />
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded bg-[#1F2937] border border-white/10 flex items-center justify-center">
                <UIcon
                  name="i-heroicons-envelope"
                  class="text-gray-400 w-6 h-6"
                />
              </div> <div class="flex-1 h-px bg-white/10" /> <div class="w-2 h-2 rounded-full bg-[#FF6A00]" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- === CTA BOTTOM SECTION === -->
    <section class="py-32 px-6 relative mb-20">
      <!-- Decorator rings -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div class="w-[800px] h-[800px] border-[1px] border-[#FF6A00]/10 rounded-full absolute top-[10%]" />
        <div class="w-[1200px] h-[1200px] border-[1px] border-[#FF6A00]/5 rounded-full absolute top-[5%]" />
      </div>

      <div
        v-slide-up
        class="max-w-5xl mx-auto bg-[#1F2937]/40 backdrop-blur-xl border border-white/10 rounded-[3.5rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl"
      >
        <!-- Overlay Gradient -->
        <div class="absolute inset-0 bg-gradient-to-tr from-[#FF6A00]/10 via-transparent to-transparent pointer-events-none" />
        <div class="absolute top-0 right-0 w-64 h-64 bg-[#FF6A00]/10 blur-[80px] rounded-full pointer-events-none" />

        <h2 class="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 tracking-tight">
          Ready to evolve?
        </h2>
        <p class="text-xl text-gray-400 mb-12 max-w-2xl mx-auto relative z-10 font-medium">
          Forget handwritten notebooks and messy schedules. Choose the ideal plan and revolutionize your workspace today.
        </p>

        <div class="relative z-10 flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button @click="$router.push('/pricing')" class="bg-[#FF6A00] hover:bg-[#FF8533] text-white py-4 px-12 rounded-full font-bold shadow-[0_10px_30px_-10px_rgba(255,106,0,0.3)] hover:shadow-[0_15px_40px_-10px_rgba(255,106,0,0.5)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-indie)] hover:-translate-y-0.5 text-lg flex items-center">
            See Plans <UIcon
              name="i-heroicons-arrow-right"
              class="w-5 h-5 ml-2"
            />
          </button>
          <span class="text-gray-400 text-sm mt-3 sm:mt-0 sm:ml-4 flex items-center gap-1.5 font-medium">
            <UIcon
              name="i-heroicons-shield-check-solid"
              class="w-4 h-4 text-[#FF6A00]"
            />
            Cancel anytime.
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
