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
    placeholder: 'João Silva'
  },
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'voce@exemplo.com'
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
      color: 'green'
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
  <UAuthForm
    :fields="fields"
    :schema="schema"
    title="Create an account"
    :submit="{ label: 'Create account', loading: isLoading }"
    @submit="onSubmit"
  >
    <template #description>
      Already have an account?
      <ULink
        to="/login"
        class="text-primary font-medium"
      >Login</ULink>.
    </template>

    <template #footer>
      By signing up, you agree to our
      <ULink
        to="/"
        class="text-primary font-medium"
      >Terms of Service</ULink>.
    </template>
  </UAuthForm>
</template>
