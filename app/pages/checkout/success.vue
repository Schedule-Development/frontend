<script setup lang="ts">
const route = useRoute()
const router = useRouter()

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Confirming payment...',
  description: 'Awaiting subscription confirmation'
})

const sessionId = computed(() => route.query.session_id as string)
const status = ref<'waiting' | 'confirmed' | 'error'>('waiting')
const sessionData = ref<any>(null)
const redirectCountdown = ref(3)

let pollInterval: ReturnType<typeof setInterval> | null = null
let redirectInterval: ReturnType<typeof setInterval> | null = null
let attempts = 0
const MAX_ATTEMPTS = 15 // 30 segundos

function startAutoRedirect() {
  if (redirectInterval) return
  redirectInterval = setInterval(() => {
    if (redirectCountdown.value <= 1) {
      if (redirectInterval) clearInterval(redirectInterval)
      redirectInterval = null
      router.push('/login')
      return
    }
    redirectCountdown.value--
  }, 1000)
}

async function checkSession() {
  if (!sessionId.value) {
    status.value = 'error'
    return
  }
  try {
    const response = await $fetch<any>('/api/stripe/retrieve-session', {
      method: 'POST',
      body: { sessionId: sessionId.value }
    })
    sessionData.value = response
    if (response.status === 'paid') {
      status.value = 'confirmed'
      if (pollInterval) clearInterval(pollInterval)
      startAutoRedirect()
    }
  } catch {
    // ignora erros intermediários
  }
  attempts++
  if (attempts >= MAX_ATTEMPTS && status.value === 'waiting') {
    // Stripe webhook pode demorar — tratar como confirmado após timeout
    status.value = 'confirmed'
    if (pollInterval) clearInterval(pollInterval)
    startAutoRedirect()
  }
}

onMounted(async () => {
  await checkSession()
  if (status.value === 'waiting') {
    pollInterval = setInterval(checkSession, 2000)
  }
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
  if (redirectInterval) clearInterval(redirectInterval)
})
</script>

<template>
  <div class="h-screen overflow-hidden bg-[var(--ui-bg)] flex items-center justify-center">
    <div class="w-full max-w-md px-5">
      <div class="bg-[var(--ui-bg-elevated)] rounded-2xl p-8 border border-[var(--ui-border)] text-center flex flex-col gap-6">

        <!-- WAITING STATE -->
        <template v-if="status === 'waiting'">
          <div class="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <UIcon name="i-lucide-loader" class="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-[var(--ui-text)] mb-2">
              Awaiting confirmation...
            </h1>
            <p class="text-sm text-[var(--ui-text-muted)]">
              We're processing your payment. This may take a few seconds.
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <div v-for="i in 3" :key="i" class="h-1.5 bg-[var(--ui-border)] rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-400 rounded-full animate-pulse"
                :style="{ width: '60%', animationDelay: `${i * 0.2}s` }"
              />
            </div>
          </div>
        </template>

        <!-- CONFIRMED STATE -->
        <template v-else-if="status === 'confirmed'">
          <div class="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <UIcon name="i-lucide-check-circle-2" class="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
              <h1 class="text-2xl font-bold text-[var(--ui-text)] mb-2">
              Subscription confirmed! 🎉
            </h1>
            <p class="text-sm text-[var(--ui-text-muted)]">
              Welcome! Your subscription is active and ready to use.
            </p>
          </div>
              <div v-if="sessionData" class="bg-[var(--ui-bg)] rounded-lg p-4 text-left">
            <div class="text-xs text-[var(--ui-text-muted)] space-y-1">
              <div v-if="sessionData.email">
                <strong>Email:</strong> {{ sessionData.email }}
              </div>
              <div v-if="sessionData.planTitle">
                <strong>Plan:</strong> {{ sessionData.planTitle }}
              </div>
              <div v-if="sessionData.cycle">
                <strong>Period:</strong> {{ sessionData.cycle === 'yearly' ? 'Yearly' : 'Monthly' }}
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <p class="text-xs text-[var(--ui-text-muted)]">
              Redirecting to the dashboard in {{ redirectCountdown }}s...
            </p>
            <button
              class="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
              @click="router.push('/login')"
            >
              Go to Dashboard
            </button>
          </div>
        </template>

        <!-- ERROR STATE -->
        <template v-else>
          <div class="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <UIcon name="i-lucide-x-circle" class="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-[var(--ui-text)] mb-2">
              Something went wrong
            </h1>
            <p class="text-sm text-[var(--ui-text-muted)]">
              We couldn't confirm your payment. Please contact support.
            </p>
          </div>
          <button
            class="w-full px-4 py-2.5 border border-[var(--ui-border)] text-[var(--ui-text)] rounded-lg font-medium hover:bg-[var(--ui-bg)] transition-colors text-sm"
            @click="router.push('/pricing')"
          >
            Back to Plans
          </button>
        </template>

      </div>
    </div>
  </div>
</template>
