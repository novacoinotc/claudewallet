# 🔧 Solución: Error 502 en Railway

## El Problema

Railway muestra error **502 Bad Gateway** porque no está ejecutando Node.js correctamente. El error muestra código de TronWeb en lugar de tu API.

---

## ✅ Solución Rápida (Sigue EXACTAMENTE estos pasos)

### Paso 1: Verifica la Configuración en Railway

1. **Ve a tu proyecto en Railway**
2. **Click en el servicio** (el que está fallando)
3. **Click en "Settings"** (engranaje)

### Paso 2: Configura EXACTAMENTE así

En la sección **"Deploy"**, configura:

**Root Directory:**
```
backend
```

**Build Command:** (déjalo vacío o pon)
```
npm install
```

**Start Command:** (CRÍTICO - copia exactamente)
```
node src/server.js
```

**Watch Paths:** (déjalo vacío)

### Paso 3: Verifica Variables de Entorno

Click en la pestaña **"Variables"** y verifica que tengas TODAS estas:

```
TRON_NETWORK=nile
TRON_FULL_NODE=https://nile.trongrid.io
TRON_SOLIDITY_NODE=https://nile.trongrid.io
TRON_EVENT_SERVER=https://nile.trongrid.io
SPONSOR_PRIVATE_KEY=tu_clave_aqui
FEE_RECEIVER_ADDRESS=tu_direccion_aqui
FEE_AMOUNT_USDT=1
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
ALLOWED_ORIGINS=*
PORT=3001
NODE_ENV=production
```

### Paso 4: Genera el Dominio Público

1. En **Settings**, scroll hasta **"Networking"**
2. Click en **"Generate Domain"**
3. Espera 10 segundos
4. Copia la URL que aparece (ej: `https://xxxxx.up.railway.app`)

### Paso 5: Redeploy

1. Ve a **"Deployments"**
2. Click en el botón de **"Redeploy"** (icono de refresh)
3. **ESPERA 2-3 MINUTOS**
4. Mira los logs para ver si ahora funciona

### Paso 6: Verifica que Funcione

Abre tu navegador y ve a:
```
https://tu-url-railway.up.railway.app/api/health
```

Deberías ver:
```json
{
  "success": true,
  "status": "OK",
  "network": "nile"
}
```

---

## 🆘 Si Sigue Sin Funcionar

### Opción 1: Ver los Logs

1. Railway → **Deployments** → Click en el deployment activo
2. Lee los logs y busca mensajes de error
3. Envíame el error que veas

### Opción 2: Prueba Estas Configuraciones Alternativas

Si lo anterior no funciona, prueba cambiar el **Start Command** a:

```
cd backend && node src/server.js
```

O prueba sin el `Root Directory`:

- **Root Directory**: (déjalo vacío)
- **Start Command**: `cd backend && node src/server.js`

---

## 🔄 Alternativa: Usar Render.com

Si Railway sigue dando problemas, Render es más simple y estable:

### Setup en Render (5 minutos):

1. **Ve a**: https://render.com
2. **Sign Up** con GitHub
3. **New** → **Web Service**
4. **Connect GitHub** → Selecciona `claudewallet`
5. **Configuración**:
   ```
   Name: claudewallet-backend
   Region: Oregon (US West)
   Branch: claude/gas-free-wallet-tronlink-011CUcn2TUZxHW3KhZKiAzHJ
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node src/server.js
   ```
6. **Plan**: Free
7. **Environment Variables**: Agrega todas las del backend
8. **Create Web Service**
9. Espera 3-5 minutos
10. Render te dará una URL: `https://claudewallet-backend.onrender.com`

**Ventajas de Render:**
- ✅ Más fácil de configurar
- ✅ Logs más claros
- ✅ Menos errores raros
- ✅ Plan gratuito generoso

---

## 📋 Checklist de Verificación

Marca cada uno:
- [ ] Root Directory es exactamente: `backend`
- [ ] Start Command es exactamente: `node src/server.js`
- [ ] Todas las variables de entorno están configuradas
- [ ] Dominio público generado
- [ ] Redeployed después de cambios
- [ ] Esperado 2-3 minutos después del deploy
- [ ] Probado la URL `/api/health`

---

## 💡 ¿Por Qué Pasó Este Error?

El error 502 en Railway ocurre cuando:
1. ❌ El Start Command está mal o falta
2. ❌ El Root Directory no está configurado
3. ❌ Faltan variables de entorno críticas
4. ❌ Railway está intentando ejecutar el código como sitio estático

---

## 🎯 Próximo Paso

**Ahora mismo, haz esto:**

1. Ve a Railway Settings
2. Verifica que **Start Command** sea: `node src/server.js`
3. Verifica que **Root Directory** sea: `backend`
4. Redeploy
5. Espera 2 minutos
6. Prueba: `https://tu-url.railway.app/api/health`

**Si después de esto sigue fallando, usa Render.com** (es más confiable y simple).

¿Quieres que te guíe con Render en su lugar? Es más rápido y tiene menos problemas.
