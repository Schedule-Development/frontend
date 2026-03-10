export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const sessionCookie = getCookie(event, 'session')

  if (!sessionCookie) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const data = await $fetch<unknown>('https://api.nodix.com.br/api/auth/me', {
    method: 'GET',
    headers: {
      'Cookie': `session=${sessionCookie}`,
      'Authorization': `Bearer ${config.nodixApiToken}`
    }
  })

  return data
})
