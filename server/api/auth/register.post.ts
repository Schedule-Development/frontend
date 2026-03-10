export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  let setCookieHeader: string | null = null

  const response = await $fetch('https://api.nodix.com.br/api/auth/register', {
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

  // Encaminhar o cookie de sessão para o browser (igual ao login)
  if (setCookieHeader) {
    appendResponseHeader(event, 'set-cookie', setCookieHeader)
  }

  return response
})
