export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  let setCookieHeader: string | null = null

  const data = await $fetch<unknown>('https://api.nodix.com.br/api/auth/login', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.nodixApiToken}`
    },
    onResponse({ response }) {
      const raw = response.headers.get('set-cookie')
      if (raw) setCookieHeader = raw
    }
  })

  // Forward the session cookie to the browser
  if (setCookieHeader) {
    appendResponseHeader(event, 'set-cookie', setCookieHeader)
  }

  return data
})
