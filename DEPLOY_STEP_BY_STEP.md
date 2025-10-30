# 🚀 Guía Paso a Paso: Deploy con Vercel + Railway

## Paso 1: Deploy del Frontend en Vercel (5 minutos)

### 1.1 Accede a Vercel

1. Ve a https://vercel.com
2. Click en **"Sign Up"** o **"Log In"**
3. Usa tu cuenta de GitHub

### 1.2 Crear Nuevo Proyecto

1. En el dashboard, click en **"Add New..."** → **"Project"**
2. Busca y selecciona el repositorio **"claudewallet"**
3. Click en **"Import"**

### 1.3 Configurar el Proyecto

**En la pantalla de configuración, configura así:**

**Project Name**: `tron-wallet-frontend` (o el nombre que quieras)

**Framework Preset**:
- Selecciona **"Vite"**

**Root Directory**:
- Click en **"Edit"**
- Escribe: `frontend`
- Click **"Continue"**

**Build and Output Settings**:
- Build Command: `npm run build` (debería estar así por defecto)
- Output Directory: `dist` (debería estar así por defecto)
- Install Command: `npm install` (debería estar así por defecto)

### 1.4 Configurar Variables de Entorno

**MUY IMPORTANTE**: Por ahora, agrega esta variable temporal:

Click en **"Environment Variables"**:

```
Name: VITE_API_URL
Value: https://temporal.com/api
```

> ⚠️ **Nota**: Actualizaremos esta URL después de deployar el backend

### 1.5 Deploy!

1. Click en **"Deploy"**
2. Espera 2-3 minutos mientras Vercel hace el build
3. ✅ Cuando termine, verás "Congratulations!"

### 1.6 Obtén tu URL

Vercel te dará una URL como: `https://tron-wallet-frontend.vercel.app`

**COPIA ESTA URL**, la necesitaremos para el backend.

---

## Paso 2: Deploy del Backend en Railway (5 minutos)

### 2.1 Accede a Railway

1. Ve a https://railway.app
2. Click en **"Login"** (usa GitHub)
3. Si es tu primera vez, acepta los permisos

### 2.2 Crear Nuevo Proyecto

1. Click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Si es la primera vez, Railway pedirá permisos de GitHub
4. Busca y selecciona **"claudewallet"**

### 2.3 Configurar el Servicio

Railway creará automáticamente el proyecto. Ahora configúralo:

1. Click en el proyecto que se acaba de crear
2. Click en **"Settings"** (engranaje)

**Configure Service**:

3. En **"Root Directory"**, escribe: `backend`
4. En **"Start Command"**, escribe: `node src/server.js`
5. En **"Build Command"** (si aparece), déjalo en blanco o escribe: `npm install`

### 2.4 Configurar Variables de Entorno

**MUY IMPORTANTE**: Railway necesita todas estas variables.

1. Click en la pestaña **"Variables"**
2. Click en **"New Variable"**

Agrega TODAS estas variables una por una:

#### Para Testnet (Nile) - RECOMENDADO para pruebas:

```
TRON_NETWORK=nile
TRON_FULL_NODE=https://nile.trongrid.io
TRON_SOLIDITY_NODE=https://nile.trongrid.io
TRON_EVENT_SERVER=https://nile.trongrid.io

SPONSOR_PRIVATE_KEY=TU_CLAVE_PRIVADA_AQUI
FEE_RECEIVER_ADDRESS=TU_DIRECCION_PARA_COMISIONES

FEE_AMOUNT_USDT=1
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

ALLOWED_ORIGINS=https://tron-wallet-frontend.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
PORT=3001
```

**IMPORTANTE**:
- Reemplaza `SPONSOR_PRIVATE_KEY` con tu clave privada real
- Reemplaza `FEE_RECEIVER_ADDRESS` con tu dirección real
- Reemplaza `ALLOWED_ORIGINS` con la URL de tu frontend de Vercel (del Paso 1.6)

### 2.5 Deploy Automático

Railway detectará los cambios y empezará a deployar automáticamente.

1. Ve a la pestaña **"Deployments"**
2. Verás el progreso del build
3. Espera 2-3 minutos

### 2.6 Obtén tu URL del Backend

1. Ve a **"Settings"**
2. En la sección **"Domains"**, verás una URL como:
   `https://claudewallet-production.up.railway.app`
3. **COPIA ESTA URL**

---

## Paso 3: Conectar Frontend con Backend (2 minutos)

Ahora que tienes ambas URLs, conecta el frontend con el backend:

### 3.1 Actualizar Variable en Vercel

1. Ve a https://vercel.com/dashboard
2. Click en tu proyecto **"tron-wallet-frontend"**
3. Click en **"Settings"**
4. Click en **"Environment Variables"**
5. Encuentra `VITE_API_URL`
6. Click en los tres puntos **"..."** → **"Edit"**
7. Cambia el valor a: `https://TU-URL-DE-RAILWAY.railway.app/api`
   - Ejemplo: `https://claudewallet-production.up.railway.app/api`
8. Click **"Save"**

### 3.2 Redeploy Frontend

1. En Vercel, ve a la pestaña **"Deployments"**
2. Click en los tres puntos del último deployment
3. Click en **"Redeploy"**
4. Espera 1-2 minutos

---

## Paso 4: Verificar que Todo Funciona (3 minutos)

### 4.1 Verificar Backend

Abre tu navegador y ve a:
```
https://TU-URL-DE-RAILWAY.railway.app/api/health
```

Deberías ver:
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2025-...",
  "network": "nile"
}
```

✅ Si ves esto, el backend funciona!

### 4.2 Verificar Estado del Sponsor

```
https://TU-URL-DE-RAILWAY.railway.app/api/sponsor/status
```

Deberías ver info de tu wallet sponsor:
```json
{
  "success": true,
  "sponsor": {
    "address": "TXxxx...",
    "trxBalance": ...,
    "energyLimit": ...
  },
  "operational": true
}
```

### 4.3 Verificar Frontend

1. Abre: `https://TU-URL-VERCEL.vercel.app`
2. Deberías ver la pantalla de la wallet morada neón
3. Click en **"Crear Nueva Wallet"**
4. Si puedes crear una wallet y ver "Balance: 0.00 USDT", ¡todo funciona!

---

## Paso 5: Configurar Wallet Sponsor (IMPORTANTE)

Para que las transacciones funcionen, necesitas TRX stakeado en la wallet sponsor:

### 5.1 Obtener TRX de Testnet (Nile)

1. Ve a https://nileex.io/join/getJoinPage
2. Ingresa la dirección de tu wallet sponsor
3. Click en "Submit"
4. Recibirás 10,000 TRX gratis (para testnet)

### 5.2 Stakear TRX para Energía

1. Ve a https://nile.tronscan.org
2. Conecta tu wallet sponsor (importa con la clave privada)
3. Ve a **"Resources"**
4. Click en **"Freeze"** o **"Stake"**
5. Congela/Stakea **5,000 TRX** para **Energy**
6. Confirma la transacción

### 5.3 Verificar Energía

Espera 1 minuto y verifica:
```
https://TU-URL-DE-RAILWAY.railway.app/api/sponsor/status
```

Deberías ver `energyLimit > 50000`

---

## ✅ Checklist Final

Marca cada item cuando lo completes:

- [ ] Frontend deployado en Vercel
- [ ] Backend deployado en Railway
- [ ] Variables de entorno configuradas
- [ ] Frontend conectado al backend
- [ ] Backend responde en `/api/health`
- [ ] Sponsor tiene TRX en testnet
- [ ] TRX stakeado para energía (energyLimit > 50000)
- [ ] Puedes crear una wallet en el frontend
- [ ] Puedes ver el balance (aunque sea 0)

---

## 🎉 ¡Listo!

Si todos los checks están marcados, tu TRON Gas-Free Wallet está funcionando!

### Próximos Pasos:

1. **Obtener USDT de Testnet**:
   - Ve a https://nileex.io
   - Swap TRX → USDT
   - Envía USDT a tu wallet creada en el frontend

2. **Probar una Transacción**:
   - En el frontend, click "Enviar USDT"
   - Ingresa una dirección de destino
   - Ingresa un monto (ej: 2 USDT)
   - Confirma y firma
   - ¡Verás cómo se procesa sin necesidad de TRX!

---

## 🆘 ¿Problemas?

### Frontend no carga:
- Verifica que el build en Vercel terminó exitosamente
- Revisa los logs en Vercel → Deployments → Click en el deployment → View Function Logs

### Backend no responde:
- Revisa los logs en Railway → Tu proyecto → View Logs
- Verifica que todas las variables de entorno estén configuradas

### CORS Error:
- Verifica que `ALLOWED_ORIGINS` en Railway tenga la URL correcta de Vercel
- Asegúrate de incluir `https://` y no tener `/` al final

### "Sponsor sin energía":
- Verifica que hayas stakeado TRX
- Espera 1-2 minutos después de stakear
- Verifica en `/api/sponsor/status` que `energyLimit > 50000`

---

**¿Necesitas ayuda en algún paso específico?** Avísame y te guío.
