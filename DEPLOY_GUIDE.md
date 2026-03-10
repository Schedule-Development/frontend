# 🚀 Deploy Landing Page - Guia Rápido

## Estrutura no Servidor
```
/home/geral/
├── Sistema_agendamento/
│   └── backend/          (já existe)
└── saas-landing-page/    (vamos criar)
```

---

## 📋 Comandos - Execute no SSH

### 1️⃣ Criar diretório da landing page

```bash
cd /home/geral
mkdir -p saas-landing-page
cd saas-landing-page
mkdir -p data
```

### 2️⃣ Aguarde transferir os arquivos

**Agora, no seu computador local**, abra um NOVO terminal PowerShell e execute:

```powershell
cd C:\Users\gabri\OneDrive\Desktop\projects\saas-landing-page

# Transferir arquivos
scp -P 30 -r * jurack@187.73.185.27:/home/geral/saas-landing-page/
```

Digite a senha quando solicitado e aguarde o upload.

### 3️⃣ De volta ao SSH - Build e executar

```bash
cd /home/geral/saas-landing-page

# Build da imagem Docker
docker compose build

# Executar
docker compose up -d

# Ver logs
docker compose logs -f
```

Pressione `Ctrl+C` para sair dos logs.

### 4️⃣ Verificar

```bash
# Ver se está rodando
docker compose ps

# Testar
curl http://localhost:3000
```

**Acesse no navegador:** http://187.73.185.27:3000

---

## 🎯 Comandos Úteis

```bash
cd /home/geral/saas-landing-page

# Ver logs
docker compose logs -f app

# Reiniciar
docker compose restart

# Parar
docker compose stop

# Iniciar
docker compose start

# Ver status
docker compose ps

# Parar e remover
docker compose down
```

---

## 🔄 Atualizar depois de mudanças

```bash
cd /home/geral/saas-landing-page

# Parar
docker compose down

# Rebuild
docker compose build --no-cache

# Iniciar novamente
docker compose up -d
```

---

## 🌐 Acessar

- Landing Page: http://187.73.185.27:3000
- Backend: (já existe em outro diretório)

---

## ⚠️ Troubleshooting

**Porta 3000 já em uso?**
```bash
sudo lsof -i :3000
# Ou edite porta no docker-compose.yml
```

**Ver logs de erro:**
```bash
docker compose logs app
```

**Permissão negada no Docker?**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## ✅ Resumo dos Comandos

**No SSH (servidor):**
```bash
cd /home/geral
mkdir -p saas-landing-page
cd saas-landing-page
```

**No PowerShell local (novo terminal):**
```powershell
cd C:\Users\gabri\OneDrive\Desktop\projects\saas-landing-page
scp -P 30 -r * jurack@187.73.185.27:/home/geral/saas-landing-page/
```

**De volta no SSH:**
```bash
cd /home/geral/saas-landing-page
docker compose build
docker compose up -d
docker compose logs -f
```

**Pronto!** Acesse: http://187.73.185.27:3000
