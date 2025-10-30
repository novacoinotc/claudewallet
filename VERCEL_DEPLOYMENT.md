# Guía de Deployment en Vercel

Esta guía te ayudará a deployar tu TRON Gas-Free Wallet en Vercel de forma rápida y sencilla.

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Repositorio de GitHub con el código
3. Clave privada de la wallet patrocinadora (sponsor)
4. TRX stakeado en la wallet sponsor (para mainnet)

## 🚀 Opción 1: Deploy Completo en Vercel (Recomendado)

Vercel puede hostear tanto el frontend como el backend.

### Paso 1: Conectar Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "Add New" → "Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente el proyecto

### Paso 2: Configurar Variables de Entorno

En la configuración del proyecto, agrega estas variables de entorno:

#### Variables del Backend:

```
TRON_NETWORK=mainnet
TRON_FULL_NODE=https://api.trongrid.io
TRON_SOLIDITY_NODE=https://api.trongrid.io
TRON_EVENT_SERVER=https://api.trongrid.io

SPONSOR_PRIVATE_KEY=tu_clave_privada_del_sponsor
FEE_RECEIVER_ADDRESS=tu_direccion_que_recibe_comisiones
FEE_AMOUNT_USDT=1

USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

NODE_ENV=production

ALLOWED_ORIGINS=https://tu-dominio.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Variables del Frontend:

```
VITE_API_URL=/api
```

**IMPORTANTE**: En Vercel, el frontend y backend comparten el mismo dominio, así que usamos `/api` como URL relativa.

### Paso 3: Configurar Build Settings

Vercel debería detectar automáticamente la configuración, pero verifica:

**Root Directory**: `./` (raíz del proyecto)

**Framework Preset**: Vite (para el frontend)

**Build Command**: `cd frontend && npm install && npm run build`

**Output Directory**: `frontend/dist`

**Install Command**: `npm install`

### Paso 4: Deploy

1. Click en "Deploy"
2. Espera a que termine el build (2-3 minutos)
3. ¡Listo! Tu aplicación estará disponible en `tu-proyecto.vercel.app`

### Paso 5: Verificar el Deployment

Una vez deployado, verifica que todo funciona:

1. Abre `https://tu-proyecto.vercel.app`
2. Verifica el endpoint de API: `https://tu-proyecto.vercel.app/api/health`
3. Crea una wallet de prueba
4. Verifica que puedes ver tu balance

## 🔀 Opción 2: Frontend en Vercel + Backend en Railway/Render

Si prefieres separar frontend y backend:

### Frontend en Vercel:

1. Importa el repositorio en Vercel
2. Configura el **Root Directory**: `frontend`
3. Variables de entorno:
   ```
   VITE_API_URL=https://tu-backend.railway.app/api
   ```
4. Deploy

### Backend en Railway/Render:

**Railway**:
1. Ve a [Railway](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Selecciona tu repo y la carpeta `backend`
4. Configura las variables de entorno del backend
5. Railway asignará automáticamente un dominio

**Render**:
1. Ve a [Render](https://render.com)
2. "New" → "Web Service"
3. Conecta tu repositorio
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `node src/server.js`
7. Configura las variables de entorno

## 🌐 Configuración de Dominio Personalizado

### En Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. "Settings" → "Domains"
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

### Actualizar CORS:

Una vez que tengas tu dominio, actualiza la variable de entorno:

```
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com
```

## 🔐 Seguridad en Producción

### Variables de Entorno Sensibles:

- **NUNCA** commitees el archivo `.env` con datos reales
- Usa las variables de entorno de Vercel para datos sensibles
- La `SPONSOR_PRIVATE_KEY` debe estar solo en las variables de entorno de Vercel

### Red TRON:

Para producción, asegúrate de usar mainnet:

```
TRON_NETWORK=mainnet
TRON_FULL_NODE=https://api.trongrid.io
TRON_SOLIDITY_NODE=https://api.trongrid.io
TRON_EVENT_SERVER=https://api.trongrid.io
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

### Monitoreo:

1. Configura alertas en Vercel para errores
2. Monitorea el balance y energía de la wallet sponsor
3. Configura logs para debugging
4. Usa Vercel Analytics para métricas

## 🔧 Troubleshooting

### Error: "Build failed"

**Solución**:
1. Verifica que todas las dependencias estén en package.json
2. Revisa los logs de build en Vercel
3. Asegúrate de que el build funciona localmente: `npm run build`

### Error: "API endpoints not working"

**Solución**:
1. Verifica que `vercel.json` esté en la raíz del proyecto
2. Verifica que las rutas de API sean correctas (deben empezar con `/api`)
3. Revisa los logs de función en Vercel Dashboard

### Error: "CORS policy error"

**Solución**:
1. Actualiza `ALLOWED_ORIGINS` en las variables de entorno
2. Incluye tu dominio de Vercel
3. Si usas dominio personalizado, agrégalo también

### Error: "Sponsor sin energía"

**Solución**:
1. Verifica que la wallet sponsor tenga TRX stakeado
2. En mainnet necesitarás más TRX que en testnet
3. Monitorea el endpoint: `/api/sponsor/status`

### Error: "Module not found"

**Solución**:
1. Asegúrate de que todos los imports usen la extensión `.js`
2. Verifica que `"type": "module"` esté en package.json
3. Revisa la sintaxis de imports ES6

## 📊 Monitoreo del Sistema

### Endpoints de Monitoreo:

```bash
# Health check
curl https://tu-proyecto.vercel.app/api/health

# Estado del sponsor
curl https://tu-proyecto.vercel.app/api/sponsor/status

# Balance de una dirección
curl https://tu-proyecto.vercel.app/api/balance/TU_DIRECCION
```

### Alertas Recomendadas:

1. **Energía baja**: Cuando el sponsor tenga menos de 50,000 energía
2. **Errores de API**: Más de 10 errores en 5 minutos
3. **Balance bajo**: Cuando el sponsor tenga menos de 100 TRX

## 🚦 Testing en Production

Antes de compartir con usuarios:

1. ✅ Crea una wallet de prueba
2. ✅ Verifica que puedes ver el balance
3. ✅ Envía una transacción pequeña (1.1 USDT)
4. ✅ Verifica en TronScan que las transacciones se procesaron
5. ✅ Revisa los logs de Vercel para errores
6. ✅ Verifica el estado del sponsor
7. ✅ Prueba en diferentes navegadores
8. ✅ Prueba en móvil

## 💡 Optimizaciones

### Performance:

1. **Edge Functions**: Vercel usa Edge Functions automáticamente
2. **Caching**: Configura cache headers para assets estáticos
3. **Image Optimization**: Usa `next/image` si migras a Next.js

### Costos:

Vercel ofrece:
- Plan gratuito: 100GB bandwidth, suficiente para empezar
- Pro: $20/mes para más recursos
- Las serverless functions tienen límites de tiempo de ejecución

### Escalabilidad:

Para manejar más usuarios:
1. Implementa cola de transacciones
2. Usa múltiples wallets patrocinadoras
3. Implementa load balancing
4. Considera migrar a infraestructura dedicada

## 📝 Checklist Final

Antes de lanzar:

- [ ] Variables de entorno configuradas
- [ ] Mainnet configurado (no testnet)
- [ ] TRX stakeado en sponsor (mínimo 10,000 TRX)
- [ ] Dominio personalizado configurado
- [ ] HTTPS habilitado (automático en Vercel)
- [ ] CORS configurado correctamente
- [ ] Rate limiting activo
- [ ] Monitoreo configurado
- [ ] Backup de clave privada del sponsor
- [ ] Testing completo realizado
- [ ] Documentación actualizada

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en Vercel Dashboard
2. Consulta la [documentación de Vercel](https://vercel.com/docs)
3. Revisa los issues de GitHub
4. Contacta al equipo de soporte

## 🔄 Actualizaciones

Para actualizar el código deployado:

1. Push a tu rama principal en GitHub
2. Vercel detectará automáticamente los cambios
3. Se hará un nuevo deploy automático
4. Puedes ver el progreso en Vercel Dashboard

También puedes:
- Hacer rollback a versiones anteriores
- Ver preview deployments de PRs
- Configurar deploy hooks para CI/CD

---

¡Listo! Tu TRON Gas-Free Wallet está deployada en Vercel 🎉
