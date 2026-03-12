export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const sessionCookie = getCookie(event, 'session')

  if (!sessionCookie) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  // If no API token is configured (local dev), return null to indicate unauthenticated
  if (!config.nodixApiToken) {
    return null
  }

  try {
    const data = await $fetch<unknown>('https://api.nodix.com.br/api/auth/me', {
      method: 'GET',
      headers: {
        'Cookie': `session=${sessionCookie}`,
        'Authorization': `Bearer ${config.nodixApiToken}`
      }
    })
    return data
  } catch (err: any) {
    // Map upstream 401 to local 401 (Not authenticated)
    const status = err?.response?.status || err?.status || null
    if (status === 401) {
      throw createError({ statusCode: 401, message: 'Not authenticated' })
    }
    // For other errors, return a 502 to indicate upstream service failure
    throw createError({ statusCode: 502, message: 'Failed to fetch auth from Nodix API' })
  }
})
