export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const sessionCookie = getCookie(event, 'session')

  if (sessionCookie) {
    await $fetch('https://api.nodix.com.br/api/auth/logout', {
      method: 'POST',
      headers: {
        'Cookie': `session=${sessionCookie}`,
        'Authorization': `Bearer ${config.nodixApiToken}`
      }
    }).catch(() => {}) // best-effort
  }

  // Clear the session cookie on the browser
  deleteCookie(event, 'session')

  return { ok: true }
})
