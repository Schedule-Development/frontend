<script setup lang="ts">
const router = useRouter()

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Pagamento cancelado',
  description: 'Seu pagamento foi cancelado'
})

const handleRetry = () => {
  router.push('/plans')
}

const handleContactSupport = () => {
  // Você pode adicionar um link para contato ou abrir um formulário
  window.location.href = 'mailto:support@seusite.com?subject=Problema com pagamento'
}
</script>

<template>
  <div class="h-screen overflow-hidden bg-[var(--ui-bg)] flex items-center justify-center">
    <button
      class="fixed left-5 top-5 z-50 flex items-center gap-1 text-xs text-[var(--ui-text-muted)] hover:text-[var(--ui-text)] transition-colors"
      @click="router.push('/plans')"
    >
      <UIcon
        name="i-lucide-arrow-left"
        class="w-3.5 h-3.5"
      />
      Voltar
    </button>

    <div class="w-full max-w-md px-5">
      <div class="bg-[var(--ui-bg-elevated)] rounded-2xl p-8 border border-[var(--ui-border)] text-center flex flex-col gap-6">
        <!-- Cancel Icon -->
        <div class="mx-auto">
          <div class="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <UIcon
              name="i-lucide-alert-circle"
              class="w-8 h-8 text-orange-600 dark:text-orange-400"
            />
          </div>
        </div>

        <!-- Title -->
        <div>
          <h1 class="text-2xl font-bold text-[var(--ui-text)] mb-2">
            Pagamento Cancelado
          </h1>
          <p class="text-sm text-[var(--ui-text-muted)]">
            Você cancelou o processo de pagamento. Nenhuma cobrança foi realizada.
          </p>
        </div>

        <!-- Info Box -->
        <div class="bg-[var(--ui-bg)] rounded-lg p-4 border border-[var(--ui-border)]">
          <p class="text-sm text-[var(--ui-text-muted)]">
            Você pode tentar novamente quando estiver pronto. Se encontrar algum problema, entre em contato com nosso suporte.
          </p>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col gap-3">
          <button
            @click="handleRetry"
            class="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Tentar Novamente
          </button>
          <button
            @click="handleContactSupport"
            class="w-full px-4 py-2.5 border border-[var(--ui-border)] text-[var(--ui-text)] rounded-lg font-medium hover:bg-[var(--ui-bg)] transition-colors text-sm"
          >
            Contatar Suporte
          </button>
        </div>

        <!-- Help Text -->
        <p class="text-xs text-[var(--ui-text-muted)]">
          Dúvidas? Veja nossa <a href="#" class="text-primary-600 hover:text-primary-700 underline">central de ajuda</a>.
        </p>
      </div>
    </div>
  </div>
</template>
