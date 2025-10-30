# 🔧 Solución para el Warning de Vercel

## El Problema

Estás viendo este warning:
```
WARN! Due to `builds` existing in your configuration file,
the Build and Development Settings defined in your Project Settings will not apply.
```

## La Solución Recomendada

Para este proyecto, la mejor opción es **deployar Frontend y Backend por separado en Vercel**.

---

## ✅ Solución 1: Dos Proyectos en Vercel (RECOMENDADO)

### Paso 1: Deploy del Frontend

1. **Crear nuevo proyecto en Vercel**
   - Ve a https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Selecciona tu repositorio

2. **Configurar el Frontend**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Variables de Entorno del Frontend**
   ```
   VITE_API_URL=https://tu-backend.vercel.app/api
   ```
   (Actualiza esto después de deployar el backend)

4. **Deploy** → Click en "Deploy"

### Paso 2: Deploy del Backend

1. **Crear OTRO proyecto en Vercel**
   - Ve a https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Selecciona el MISMO repositorio

2. **Configurar el Backend**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: (dejar vacío)
   - **Install Command**: `npm install`

3. **Variables de Entorno del Backend**
   ```
   TRON_NETWORK=nile
   TRON_FULL_NODE=https://nile.trongrid.io
   TRON_SOLIDITY_NODE=https://nile.trongrid.io
   TRON_EVENT_SERVER=https://nile.trongrid.io

   SPONSOR_PRIVATE_KEY=tu_clave_privada
   FEE_RECEIVER_ADDRESS=tu_direccion
   FEE_AMOUNT_USDT=1

   USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

   ALLOWED_ORIGINS=https://tu-frontend.vercel.app
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Deploy** → Click en "Deploy"

5. **Copia la URL del backend** (ej: `https://tu-backend.vercel.app`)

### Paso 3: Actualizar Frontend con la URL del Backend

1. Ve al proyecto Frontend en Vercel
2. Settings → Environment Variables
3. Edita `VITE_API_URL`:
   ```
   VITE_API_URL=https://tu-backend.vercel.app/api
   ```
4. Redeploy el frontend: Deployments → Latest → Redeploy

### Paso 4: Verificar

```bash
# Verificar Backend
curl https://tu-backend.vercel.app/api/health

# Abrir Frontend
open https://tu-frontend.vercel.app
```

---

## ✅ Solución 2: Frontend en Vercel + Backend en Railway

Esta es otra excelente opción y más simple:

### Frontend en Vercel

1. Deploy como se describe arriba (Solución 1, Paso 1)

### Backend en Railway

1. **Crear cuenta en Railway**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. Selecciona tu repositorio
4. **Settings**:
   - Root Directory: `/backend`
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
5. **Variables**: Agrega todas las variables de entorno del backend
6. Railway te dará una URL automáticamente

7. **Actualiza el Frontend**:
   - En Vercel, actualiza `VITE_API_URL` con la URL de Railway
   - Ejemplo: `VITE_API_URL=https://tu-app.railway.app/api`

---

## ✅ Solución 3: Simplificar para un Solo Proyecto

Si insistes en un solo proyecto de Vercel, usa esta configuración:

### Actualizar `vercel.json` en la raíz:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd backend && npm install && cd ../frontend && npm install"
}
```

### Crear `/api/index.js` en la raíz:

Ya lo creé para ti. Este archivo importa y re-exporta el backend.

### Configuración en Vercel Dashboard:

No necesitas configurar nada extra, el `vercel.json` se encarga de todo.

---

## 🎯 ¿Cuál Solución Elegir?

| Solución | Pros | Contras | Recomendado Para |
|----------|------|---------|------------------|
| **Dos proyectos Vercel** | ✅ Más simple<br>✅ Mejor aislamiento<br>✅ Deployments independientes | ❌ Dos proyectos<br>❌ CORS configurar | **Producción** |
| **Vercel + Railway** | ✅ Simple<br>✅ Backend más potente<br>✅ Railway gratis al inicio | ❌ Dos plataformas | **Ideal para empezar** |
| **Un solo proyecto** | ✅ Todo en uno<br>✅ Mismo dominio | ❌ Más complejo<br>❌ Warnings<br>❌ Más difícil debug | **Solo si necesitas mismo dominio** |

## 🏆 Mi Recomendación

**Para empezar rápido**: Usa **Vercel + Railway** (Solución 2)
- Frontend en Vercel
- Backend en Railway
- Es lo más simple y funciona perfecto

**Para producción**: Usa **dos proyectos en Vercel** (Solución 1)
- Mejor control
- Todo en la misma plataforma
- Fácil de mantener

---

## 📝 Configuración Actual del Repo

El repositorio ahora está configurado para funcionar con cualquiera de las 3 soluciones:

1. ✅ `vercel.json` simplificado (Solución 3)
2. ✅ `/api/index.js` para serverless (Solución 3)
3. ✅ `/backend/api/index.js` alternativo
4. ✅ Estructura separada para despliegues independientes (Solución 1 y 2)

**Elige la solución que prefieras y sigue sus pasos.**

---

## 🆘 Si Sigues Teniendo Problemas

### Error: "npm run build" en la raíz

**Solución**: El build está tratando de ejecutarse en la raíz. Sigue la Solución 1 o 2.

### Error: CORS

**Solución**: Actualiza `ALLOWED_ORIGINS` en las variables de entorno del backend con la URL del frontend.

### Error: "Module not found"

**Solución**: Asegúrate de que el Root Directory esté configurado correctamente:
- Frontend: `frontend`
- Backend: `backend`

---

## ✅ Verificación Final

Después de deployar, verifica:

```bash
# Backend health check
curl https://tu-backend.vercel.app/api/health

# Debe retornar:
{
  "success": true,
  "status": "OK",
  "timestamp": "...",
  "network": "nile"
}

# Frontend
# Abre en navegador y crea una wallet de prueba
```

---

**Recomendación**: Sigue la **Solución 2 (Vercel + Railway)** para empezar de forma simple y efectiva.
