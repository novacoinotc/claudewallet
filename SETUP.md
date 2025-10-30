# Guía de Configuración Rápida

## 🎯 Setup en 5 minutos

### Paso 1: Instalar dependencias

\`\`\`bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
\`\`\`

### Paso 2: Configurar Backend

1. Copia el archivo de ejemplo:
\`\`\`bash
cd backend
cp .env.example .env
\`\`\`

2. Edita \`.env\` con tus datos:
\`\`\`env
SPONSOR_PRIVATE_KEY=tu_clave_privada
FEE_RECEIVER_ADDRESS=tu_direccion_para_recibir_comisiones
\`\`\`

### Paso 3: Configurar Frontend

\`\`\`bash
cd frontend
cp .env.example .env
# El archivo .env ya tiene la configuración correcta por defecto
\`\`\`

### Paso 4: Obtener TRX de Testnet

Para probar en testnet Nile:

1. Ve a https://nileex.io/join/getJoinPage
2. Ingresa tu dirección TRON
3. Recibe TRX gratis
4. Repite para la dirección del sponsor

### Paso 5: Stakear TRX (Sponsor)

1. Ve a https://nile.tronscan.org
2. Importa la wallet del sponsor
3. Ve a "Resources" → "Freeze/Stake"
4. Congela TRX para obtener Energía
5. Recomendado: 5,000 - 10,000 TRX

### Paso 6: Iniciar el sistema

Terminal 1 - Backend:
\`\`\`bash
cd backend
npm run dev
\`\`\`

Terminal 2 - Frontend:
\`\`\`bash
cd frontend
npm run dev
\`\`\`

### Paso 7: Abrir la aplicación

Abre tu navegador en: http://localhost:3000

## 🧪 Obtener USDT de Testnet

Para probar el sistema necesitas USDT en testnet Nile:

### Opción 1: Swap en Nile
1. Ve a https://nileex.io
2. Swap TRX → USDT

### Opción 2: Usar un contrato de prueba
Puedes deployar un contrato TRC20 de prueba en Nile para testing.

## ✅ Verificar que todo funciona

### 1. Verificar Backend
\`\`\`bash
curl http://localhost:3001/api/health
\`\`\`

Respuesta esperada:
\`\`\`json
{
  "success": true,
  "status": "OK",
  "network": "nile"
}
\`\`\`

### 2. Verificar recursos del Sponsor
\`\`\`bash
curl http://localhost:3001/api/sponsor/status
\`\`\`

Respuesta esperada:
\`\`\`json
{
  "success": true,
  "sponsor": {
    "address": "TxXxXx...",
    "trxBalance": 10000,
    "energyLimit": 90000
  },
  "operational": true
}
\`\`\`

### 3. Probar el Frontend

1. Abre http://localhost:3000
2. Crea una nueva wallet
3. Guarda tu seed phrase
4. ¡Listo!

## 🔍 Troubleshooting

### Error: "Sponsor sin energía suficiente"
**Solución**: Stakea más TRX en la wallet sponsor

### Error: "Balance insuficiente"
**Solución**: Obtén más USDT de testnet o usa el swap

### Error: "Connection refused"
**Solución**: Verifica que el backend esté corriendo en el puerto 3001

### Frontend no se conecta al backend
**Solución**: Verifica que VITE_API_URL en frontend/.env sea correcto

### Transacción falla con "out of energy"
**Solución**:
1. Verifica que la wallet sponsor tenga TRX stakeado
2. Verifica el estado del sponsor: GET /api/sponsor/status
3. Stakea más TRX si es necesario

## 📝 Checklist de Producción

Antes de ir a producción:

- [ ] Cambiar a TRON Mainnet
- [ ] Actualizar contrato USDT a mainnet
- [ ] Stakear TRX suficiente en mainnet
- [ ] Configurar CORS para tu dominio
- [ ] Configurar rate limiting apropiado
- [ ] Usar HTTPS
- [ ] Agregar logging y monitoreo
- [ ] Implementar respaldos de la clave del sponsor
- [ ] Revisar límites de comisión
- [ ] Testing completo

## 🚀 Scripts útiles

### Verificar balance de una dirección
\`\`\`bash
curl http://localhost:3001/api/balance/TU_DIRECCION
\`\`\`

### Ver estado del sistema
\`\`\`bash
curl http://localhost:3001/api/sponsor/status
\`\`\`

### Build de producción

Frontend:
\`\`\`bash
cd frontend
npm run build
\`\`\`

Backend:
\`\`\`bash
cd backend
npm run start
\`\`\`

## 💡 Tips

1. **Mantén la clave del sponsor segura**: Nunca la subas a git
2. **Monitorea la energía**: Configura alertas cuando esté baja
3. **Testea primero en Nile**: No vayas directo a mainnet
4. **Usa múltiples sponsors**: Para mayor disponibilidad
5. **Implementa queue**: Para manejar muchas transacciones

## 📚 Recursos

- [Documentación TRON](https://developers.tron.network/)
- [TronWeb GitHub](https://github.com/tronprotocol/tronweb)
- [TRON Testnet](https://nileex.io)
- [TronScan Testnet](https://nile.tronscan.org)

## 🆘 Ayuda

Si tienes problemas:

1. Revisa los logs del backend
2. Abre las DevTools del navegador (F12)
3. Verifica las variables de entorno
4. Consulta la documentación en README.md
5. Abre un Issue en GitHub

---

¡Listo! Ahora deberías tener el sistema funcionando 🎉
