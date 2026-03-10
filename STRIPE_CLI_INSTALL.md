# 🎯 Guia: Instalar Stripe CLI no Windows (PowerShell)

## Opção 1: Instalação Manual (Recomendado - mais fácil)

### Passo 1: Baixar
1. Acesse: https://github.com/stripe/stripe-cli/releases
2. Procure por **stripe_X.X.X_windows_x86_64.zip**
3. Clique para baixar
4. Salve em uma pasta (exemplo: `C:\Users\seu_usuario\Downloads`)

### Passo 2: Extrair
1. Clique com botão direito no `.zip`
2. Selecione "Extrair tudo..."
3. Escolha destino: `C:\Program Files\Stripe` (crie a pasta se não existir)
4. Clique "Extrair"

Resultado: `C:\Program Files\Stripe\stripe.exe`

### Passo 3: Adicionar ao PATH
Para usar `stripe` em qualquer terminal:

**PowerShell (como Admin):**
```powershell
# Abra PowerShell como Administrator
# Pressione: Win + X, depois A

# Cole este comando:
[Environment]::SetEnvironmentVariable(
    "Path",
    "$env:Path;C:\Program Files\Stripe",
    "User"
)

# Feche e reabra terminal
```

### Passo 4: Verificar
```powershell
stripe --version
```

Se funcionar, mostrará algo como: `stripe version 1.37.2`

---

## Opção 2: Instalação via PowerShell (Script Automático)

Se preferir fazer tudo de uma vez:

**PowerShell (como Admin):**
```powershell
# 1. Baixar
$url = "https://github.com/stripe/stripe-cli/releases/download/v1.37.2/stripe_1.37.2_windows_x86_64.zip"
$zip = "$env:TEMP\stripe.zip"
Invoke-WebRequest -Uri $url -OutFile $zip
Write-Host "✓ Download concluído"

# 2. Extrair
$dest = "C:\Program Files\Stripe"
if (!(Test-Path $dest)) { New-Item -ItemType Directory -Path $dest }
Expand-Archive -Path $zip -DestinationPath $dest -Force
Write-Host "✓ Extraído para: $dest"

# 3. Adicionar ao PATH
[Environment]::SetEnvironmentVariable(
    "Path",
    "$env:Path;$dest",
    "User"
)
Write-Host "✓ Adicionar ao PATH"

# 4. Verificar
& "$dest\stripe.exe" --version
```

Feche e reabra o PowerShell. Pronto!

---

## Opção 3: Com Scoop (mais moderno)

Se tiver Scoop instalado:

```powershell
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
stripe --version
```

---

## Próximo: Login no Stripe CLI

Depois que instalar, faça login:

```powershell
stripe login
```

Será aberia uma janela no seu navegador. Aprove o login.

Você receberá um código de pareamento como:
```
Your pairing code is: enjoy-enough-outwit-win
```

---

## Finalmente: Testar o Webhook

Com Stripe CLI instalado e logado:

```powershell
# Terminal 1: seu servidor Nuxt
npm run dev

# Terminal 2 (outro PowerShell): ouvir webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Terminal 3 (outro PowerShell): disparar teste
stripe trigger checkout.session.completed
```

Você deve ver os logs aparecendo no Terminal 1 ✓

---

## Problemas Comuns

### "stripe: The term 'stripe' is not recognized"
**Solução:** Você não adicionou ao PATH ou não fechou/reabriu o terminal.
- Feche TODOS os PowerShells
- Reabra um novo
- Teste: `stripe --version`

### "Access Denied"
**Solução:** Execute PowerShell como Admin (clique direito → Run as Administrator)

### Download falha
**Solução:** Baixe manualmente do GitHub:
https://github.com/stripe/stripe-cli/releases

---

**Qual opção você prefere?** Aviso se tiver dúvidas!
