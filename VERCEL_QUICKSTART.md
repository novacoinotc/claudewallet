# 🚀 Deploy Rápido en Vercel

## Opción A: Deploy Automático (Más Fácil) ⚡

### 1. Click en el botón de Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/novacoinotc/claudewallet)

### 2. Configura las Variables de Entorno

Cuando Vercel te lo pida, agrega:

```env
# Backend
SPONSOR_PRIVATE_KEY=tu_clave_privada
FEE_RECEIVER_ADDRESS=tu_direccion
TRON_NETWORK=mainnet
TRON_FULL_NODE=https://api.trongrid.io
TRON_SOLIDITY_NODE=https://api.trongrid.io
TRON_EVENT_SERVER=https://api.trongrid.io
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
ALLOWED_ORIGINS=*
FEE_AMOUNT_USDT=1
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend
VITE_API_URL=/api
```

### 3. Deploy

Click en "Deploy" y espera 2-3 minutos.

¡Listo! Tu wallet estará en `tu-proyecto.vercel.app`

---

## Opción B: Deploy Manual 🛠️

### 1. Instala Vercel CLI

```bash
npm install -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Deploy

```bash
cd claudewallet
vercel
```

### 4. Configura Variables de Entorno

```bash
vercel env add SPONSOR_PRIVATE_KEY
vercel env add FEE_RECEIVER_ADDRESS
vercel env add TRON_NETWORK
vercel env add VITE_API_URL
# ... etc
```

### 5. Re-deploy con las variables

```bash
vercel --prod
```

---

## Opción C: Deploy desde GitHub 🐙

### 1. Push tu código a GitHub

```bash
git push origin main
```

### 2. Conecta Vercel

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente la configuración

### 3. Configura Variables de Entorno

En el dashboard de Vercel:
- Settings → Environment Variables
- Agrega todas las variables listadas arriba

### 4. Deploy

Click "Deploy" y automáticamente se deployará.

**Auto-deploy**: Cada vez que hagas push a la rama principal, Vercel deployará automáticamente.

---

## ✅ Verificar que funciona

```bash
# Health check
curl https://tu-proyecto.vercel.app/api/health

# Sponsor status
curl https://tu-proyecto.vercel.app/api/sponsor/status
```

---

## 🔐 Importante

### Para Testnet (Pruebas):
```env
TRON_NETWORK=nile
TRON_FULL_NODE=https://nile.trongrid.io
TRON_SOLIDITY_NODE=https://nile.trongrid.io
TRON_EVENT_SERVER=https://nile.trongrid.io
```

### Para Mainnet (Producción):
```env
TRON_NETWORK=mainnet
TRON_FULL_NODE=https://api.trongrid.io
TRON_SOLIDITY_NODE=https://api.trongrid.io
TRON_EVENT_SERVER=https://api.trongrid.io
```

---

## 🆘 Problemas?

Consulta [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) para la guía completa con troubleshooting.

---

## 📱 Resultado

Tu wallet estará disponible en:
- **URL temporal**: `https://tu-proyecto.vercel.app`
- **Dominio personalizado**: Configúralo en Vercel Settings → Domains

Funciones disponibles:
- ✅ Crear wallet
- ✅ Importar wallet
- ✅ Ver balance USDT
- ✅ Enviar USDT sin TRX
- ✅ Sistema de fee delegation automático
- ✅ Tema morado neón

---

¡Tu TRON Gas-Free Wallet está lista! 🎉
