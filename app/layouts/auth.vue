<template>
  <div class="h-screen flex items-center justify-center px-4 bg-[#0B1F3A] selection:bg-[#FF6A00] selection:text-white relative overflow-hidden">
    <!-- Subtle Background Glow -->
    <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FF6A00]/5 blur-[120px] rounded-full pointer-events-none" />
    <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#2B4C7E]/10 blur-[120px] rounded-full pointer-events-none" />

    <UButton
      icon="i-lucide-chevron-left"
      to="/"
      size="xl"
      color="neutral"
      variant="ghost"
      class="absolute left-4 top-4 md:left-8 md:top-8 rounded-full z-10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
    />

    <UPageCard
      variant="subtle"
      class="max-w-md w-full bg-[#1F2937]/40 backdrop-blur-2xl border-white/5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] text-white p-2 md:p-6"
    >
      <slot />
    </UPageCard>
  </div>
</template>
