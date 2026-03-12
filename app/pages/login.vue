<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue'
})

const { login } = useAuth()
const toast = useToast()
const router = useRouter()
const isLoading = ref(false)

const fields = [
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'voce@exemplo.com',
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    placeholder: 'Enter your password'
  }
]

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const route = useRoute()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    await login(payload.data.email, payload.data.password)
    toast.add({ title: 'Welcome back!', color: 'blue' })
    const redirect = route.query.redirect as string | undefined
    router.push(redirect || '/')
  } catch (error: any) {
    toast.add({
      title: 'Login error',
      description: error.data?.message || 'Invalid email or password',
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
      title="Sign in to your account"
      :submit="{ label: 'Sign in', loading: isLoading }"
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
        Hi! Great to see you back.
      </template>

      <template #password-hint>
        <ULink
          to="/"
          class="text-[#FF6A00] hover:text-[#FF8533] text-sm font-medium transition-colors"
          tabindex="-1"
        >Forgot password?</ULink>
      </template>

      <template #footer>
        <span class="text-gray-300">Don't have an account?</span>
        <ULink
          to="/signup"
          class="text-[#FF6A00] hover:text-[#FF8533] font-bold transition-colors ml-1"
        >Create account</ULink>
      </template>
    </UAuthForm>

    <p class="mt-8 text-xs text-gray-400 text-center max-w-[280px] leading-relaxed">
      By signing in, you agree to our 
      <ULink to="/" class="text-white hover:text-gray-300 underline underline-offset-2">Terms of Service</ULink> 
      and <ULink to="/" class="text-white hover:text-gray-300 underline underline-offset-2">Privacy Policy</ULink>.
    </p>
  </div>
</template>
