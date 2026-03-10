export const useAuth = () => {
  const user = useState<Record<string, any> | null>('auth.user', () => null)
  const router = useRouter()
  const toast = useToast()

  async function fetchMe() {
    try {
      const data = await $fetch<Record<string, any>>('/api/auth/me')
      user.value = data
    } catch {
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    await fetchMe()
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    user.value = null
    toast.add({ title: 'Logged out', color: 'neutral' })
    router.push('/login')
  }

  const isLoggedIn = computed(() => !!user.value)

  return { user, isLoggedIn, login, logout, fetchMe }
}
