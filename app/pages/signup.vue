<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Sign up',
  description: 'Create an account to get started'
})

const toast = useToast()
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)

const fields = [
  {
    name: 'fullName',
    type: 'text' as const,
    label: 'Full name',
    placeholder: 'John Doe'
  },
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'you@example.com'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    placeholder: 'At least 8 characters'
  }
]

const schema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: payload.data.email,
        fullName: payload.data.fullName,
        password: payload.data.password
      }
    })
    
    toast.add({
      title: 'Success',
      description: 'Account created successfully!',
      color: 'blue'
    })

    // Redirecionar direto para o Stripe se veio com plano selecionado
    const plan = route.query.plan as string | undefined
    const cycle = route.query.cycle as string | undefined
    if (plan) {
      try {
        // Buscar organizationId do usuário recém-criado (cookie já foi setado)
        const me = await $fetch<Record<string, any>>('/api/auth/me')
        const stripeResponse = await $fetch<{ url: string | null }>('/api/stripe/create-checkout-session', {
          method: 'POST',
          body: {
            planTitle: plan,
            cycle: parseInt(cycle ?? '0'),
            email: payload.data.email,
            organizationId: me?.organizationId
          }
        })
        if (stripeResponse.url) {
          window.location.href = stripeResponse.url
          return
        }
      } catch {
        // se falhar, cai no checkout intermediário
      }
      router.push(`/checkout?plan=${plan}&cycle=${cycle ?? '0'}`)
    } else {
      router.push('/plans')
    }
  } catch (error: any) {
    console.error('Registration failed:', error)
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to register',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Logo -->
    <NuxtLink to="/" class="mb-8 transition-transform hover:scale-105">
      <img src="/logo-nodix.png" alt="Nodix" class="h-10 w-auto" />
    </NuxtLink>

    <UAuthForm
      :fields="fields"
      :schema="schema"
      title="Create your professional account"
      :submit="{ label: 'Start Now', loading: isLoading }"
      class="w-full"
      :ui="{
        title: 'text-2xl font-bold text-white text-center mb-2',
        description: 'text-gray-400 text-center mb-8',
        submit: 'bg-[#FF6A00] hover:bg-[#FF8533] text-white font-bold h-12 rounded-xl transition-all shadow-lg hover:shadow-[0_8px_20px_-6px_rgba(255,106,0,0.4)]',
        input: 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-[#FF6A00] focus:border-[#FF6A00] h-11 rounded-lg'
      }"
      @submit="onSubmit"
    >
      <template #description>
        Join more than 500 elite professionals.
      </template>

      <template #footer>
        <span class="text-gray-300">Already have an account?</span>
        <ULink
          to="/login"
          class="text-[#FF6A00] hover:text-[#FF8533] font-bold transition-colors ml-1"
        >Sign in</ULink>
      </template>
    </UAuthForm>

    <p class="mt-8 text-xs text-gray-400 text-center max-w-[280px] leading-relaxed">
      By creating an account, you agree to our 
      <ULink to="/" class="text-white hover:text-gray-300 underline underline-offset-2">Terms of Service</ULink> 
      and <ULink to="/" class="text-white hover:text-gray-300 underline underline-offset-2">Privacy Policy</ULink>.
    </p>
  </div>
</template>
