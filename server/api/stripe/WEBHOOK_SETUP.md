# Configuração do Webhook Stripe

## Por que precisa de webhook?

O webhook é essencial para completar o fluxo de pagamento:
1. **Usuário paga** → Stripe processa o pagamento
2. **Stripe envia evento** → seu servidor recebe `checkout.session.completed`
3. **Seu servidor processa** → cria conta, registra inscrição, envia email
4. **Usuário recebe acesso** → automático após confirmação

---

## Passo 1: Obter Webhook Secret

1. Acesse [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Clique em "Add endpoint"
3. URL: `https://seusite.com/api/stripe/webhook` (em produção)
4. Para desenvolvimento local, use [Stripe CLI](https://stripe.com/docs/stripe-cli)

   ```bash
   # Instale Stripe CLI: https://stripe.com/docs/stripe-cli/install
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   
   Isso exibe:
   ```
   Ready! Your webhook signing secret is: whsec_test_...
   ```

5. Copie `whsec_test_...` e adicione ao `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_test_...
   ```

---

## Passo 2: Selecionar Eventos

No dashboard Stripe (Webhooks):
- ✅ `checkout.session.completed` (pagamento bem-sucedido)
- ✅ `customer.subscription.updated` (renovação/mudança)
- ✅ `customer.subscription.deleted` (cancelamento)

---

## Passo 3: Testar

Com Stripe CLI rodando:

```bash
# Terminal 1: seu servidor Nuxt
npm run dev

# Terminal 2: Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Depois teste:
```bash
stripe trigger checkout.session.completed
```

Se funcionar, você verá logs em seu servidor.

---

## Passo 4: Implementar Lógica de Negócio

No arquivo [server/api/stripe/webhook.post.ts](../server/api/stripe/webhook.post.ts), localize a função `handleCheckoutSessionCompleted()` e implemente:

```typescript
async function handleCheckoutSessionCompleted(stripe, session) {
  // 1. Buscar/criar usuário
  const user = await db.user.upsert({
    where: { email: session.customer_email },
    create: { email: session.customer_email },
    update: {}
  })

  // 2. Registrar inscrição
  await db.subscription.create({
    userId: user.id,
    planTitle: session.metadata.planTitle,
    stripeSessionId: session.id,
    stripeCustomerId: session.customer
  })

  // 3. Enviar email
  await sendWelcomeEmail(user.email)
}
```

---

## Passo 5: Monitorar em Produção

No Stripe Dashboard → Webhooks:
- ✅ Logs de todos os eventos recebidos
- ✅ Reenviar webhook se falhar
- ✅ Alertas de errors

---

## Segurança

⚠️ **SEMPRE verificar assinatura do webhook!**

O código já faz isso:
```typescript
const stripeEvent = stripe.webhooks.constructEvent(body, signature, webhookSecret)
```

Isso garante que apenas eventos legítimos do Stripe são processados.

---

## Para Desenvolvimento com ngrok (alternativa ao Stripe CLI)

```bash
ngrok http 3000
# Retorna: https://abc123.ngrok.io

# Configure webhook para: https://abc123.ngrok.io/api/stripe/webhook
```

Mas **recomendamos usar Stripe CLI** — é mais simples e seguro.
