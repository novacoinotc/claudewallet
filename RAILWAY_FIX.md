# 🔧 Solución: Railway muestra URL interna

## Problema 1: URL Interna `.railway.internal`

Railway muestra `claudewallet.railway.internal` porque es una URL **privada** (solo accesible dentro de Railway). Necesitas generar un dominio **público**.

### ✅ Solución: Generar Dominio Público

1. **Ve a tu proyecto en Railway**
2. Click en tu servicio (backend)
3. Ve a la pestaña **"Settings"**
4. Busca la sección **"Networking"** o **"Domains"**
5. Click en **"Generate Domain"** o **"Add Domain"**
6. Railway generará automáticamente un dominio como:
   ```
   https://claudewallet-production.up.railway.app
   ```

**IMPORTANTE**: Copia esta URL pública.

---

## Problema 2: Error en el Deploy

El error muestra código minificado de TronWeb. Esto puede ser porque:
- Falta el archivo `package.json` en el deploy
- Railway no está ejecutando el comando correcto
- Falta una variable de entorno

### ✅ Solución: Verificar Configuración

Ve a **Settings** en Railway y verifica:

#### 1. Build Command (déjalo VACÍO o):
```
npm install
```

#### 2. Start Command (MUY IMPORTANTE):
```
node src/server.js
```

#### 3. Root Directory:
```
backend
```

#### 4. Watch Paths (opcional, déjalo vacío)

---

## 📋 Pasos Completos para Arreglar Railway

### Paso 1: Genera el Dominio Público

1. Railway Dashboard → Tu proyecto
2. Click en el servicio del backend
3. **Settings** → Scroll hasta **"Networking"**
4. Click en **"Generate Domain"**
5. Espera 10 segundos
6. Verás una URL como: `https://xxxxx.up.railway.app`
7. **COPIA esta URL**

### Paso 2: Verifica la Configuración

En **Settings**:

- **Root Directory**: `backend`
- **Build Command**: (dejar vacío o `npm install`)
- **Start Command**: `node src/server.js`
- **Node Version**: 18 o superior (automático)

### Paso 3: Verifica las Variables de Entorno

En la pestaña **"Variables"**, asegúrate de tener TODAS estas:

```
TRON_NETWORK=nile
TRON_FULL_NODE=https://nile.trongrid.io
TRON_SOLIDITY_NODE=https://nile.trongrid.io
TRON_EVENT_SERVER=https://nile.trongrid.io

SPONSOR_PRIVATE_KEY=tu_clave_privada
FEE_RECEIVER_ADDRESS=tu_direccion

FEE_AMOUNT_USDT=1
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

ALLOWED_ORIGINS=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

PORT=3001
NODE_ENV=production
```

**NOTA**: Cambia `ALLOWED_ORIGINS=*` por la URL de tu frontend de Vercel después.

### Paso 4: Re-deployar

1. En Railway, ve a **"Deployments"**
2. Click en el botón de **"Redeploy"** (icono de refresh)
3. O haz un cambio dummy y push a GitHub para trigger un nuevo deploy

### Paso 5: Verificar que Funciona

Una vez que el deploy termine (2-3 minutos), abre en tu navegador:

```
https://TU-URL-RAILWAY.up.railway.app/api/health
```

Deberías ver:
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "...",
  "network": "nile"
}
```

---

## 🆘 Si Sigue Sin Funcionar

### Opción A: Ver los Logs

1. Railway → Tu servicio
2. Click en la pestaña **"Deployments"**
3. Click en el deployment activo
4. Ve los **logs** para ver qué error específico hay

Comparte el error conmigo y te ayudo.

### Opción B: Probar Otra Forma (Alternativa)

Si Railway sigue dando problemas, podemos usar **Render.com** que es similar:

1. Ve a https://render.com
2. **New** → **Web Service**
3. Conecta GitHub → Selecciona `claudewallet`
4. Configuración:
   - Name: `claudewallet-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
5. Agrega las variables de entorno
6. Click **"Create Web Service"**

Render te dará una URL como: `https://claudewallet-backend.onrender.com`

---

## 📸 ¿Qué Ves en Railway?

Envíame un screenshot o dime:
1. ¿Ves la sección "Networking" o "Domains" en Settings?
2. ¿Hay algún botón de "Generate Domain"?
3. ¿Qué dice el último deployment? (Success/Failed)

Con esa info te puedo ayudar mejor.

---

## 🎯 TL;DR (Resumen)

**El problema**: Railway te mostró URL interna, necesitas generar una pública.

**La solución**:
1. Railway → Settings → Networking → **Generate Domain**
2. Verifica **Start Command**: `node src/server.js`
3. Verifica **Root Directory**: `backend`
4. Agrega todas las variables de entorno
5. Redeploy
6. Prueba: `https://tu-url.railway.app/api/health`
