# TRON Gas-Free Wallet 🚀

Wallet no custodial para TRON que permite a los usuarios realizar transacciones de USDT **sin necesidad de TRX** para pagar el gas. Utiliza un sistema de **fee delegation** donde una wallet patrocinadora cubre el costo del gas, y el usuario solo paga **1 USDT de comisión** por transacción.

## ✨ Características

- **🔒 No Custodial**: Tú controlas tu seed phrase y claves privadas
- **⚡ Sin TRX necesario**: No necesitas TRX para pagar gas
- **💜 Estilo Morado Neón**: Interfaz moderna y atractiva
- **💸 Comisión fija**: Solo 1 USDT por transacción
- **🔐 Seguridad**: Wallet encriptada localmente con contraseña
- **📱 Responsivo**: Funciona en desktop y móvil

## 🚀 Deploy Rápido en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/novacoinotc/claudewallet)

**O sigue la guía rápida**: [VERCEL_QUICKSTART.md](./VERCEL_QUICKSTART.md)

**Documentación completa**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 🏗️ Arquitectura

El sistema consta de 3 componentes principales:

### 1. Frontend (React + Vite)
- Generación de wallets HD con BIP39
- Interfaz de usuario morado neón
- Encriptación local de claves privadas
- Firma de transacciones del lado del cliente

### 2. Backend (Node.js + Express)
- API para coordinar transacciones
- Sistema de fee delegation
- Firma como patrocinador de gas
- Validación y seguridad

### 3. Blockchain (TRON)
- Integración con TronWeb
- Contratos TRC20 (USDT)
- Fee delegation nativa de TRON

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Cuenta TRON con TRX stakeado (solo para la wallet patrocinadora)

## 🚀 Instalación

### 1. Clonar el repositorio

\`\`\`bash
git clone https://github.com/tu-usuario/claudewallet.git
cd claudewallet
\`\`\`

### 2. Instalar dependencias del Backend

\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Configurar el Backend

Crea un archivo \`.env\` en la carpeta \`backend\`:

\`\`\`bash
cp .env.example .env
\`\`\`

Edita el archivo \`.env\` con tu configuración:

\`\`\`env
# TRON Network Configuration
TRON_NETWORK=nile
TRON_FULL_NODE=https://nile.trongrid.io
TRON_SOLIDITY_NODE=https://nile.trongrid.io
TRON_EVENT_SERVER=https://nile.trongrid.io

# Sponsor Wallet (Wallet que patrocina el gas)
SPONSOR_PRIVATE_KEY=tu_clave_privada_del_sponsor

# Fee Configuration
FEE_RECEIVER_ADDRESS=direccion_que_recibe_comisiones
FEE_AMOUNT_USDT=1

# USDT Contract Address (Nile Testnet)
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

# Server Configuration
PORT=3001
NODE_ENV=development

# Security
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
\`\`\`

### 4. Instalar dependencias del Frontend

\`\`\`bash
cd ../frontend
npm install
\`\`\`

### 5. Configurar el Frontend

Crea un archivo \`.env\` en la carpeta \`frontend\`:

\`\`\`bash
cp .env.example .env
\`\`\`

\`\`\`env
VITE_API_URL=http://localhost:3001/api
\`\`\`

## 🎮 Uso

### Iniciar el Backend

\`\`\`bash
cd backend
npm run dev
\`\`\`

El servidor estará disponible en \`http://localhost:3001\`

### Iniciar el Frontend

En otra terminal:

\`\`\`bash
cd frontend
npm run dev
\`\`\`

La aplicación estará disponible en \`http://localhost:3000\`

## 💡 Cómo Funciona

### Flujo de Transacción

1. **Usuario crea wallet**: Se genera un seed phrase BIP39 de forma local
2. **Usuario recibe USDT**: Puede recibir USDT en su dirección
3. **Usuario inicia transacción**: Ingresa destino y monto
4. **Sistema divide el pago**:
   - 1 USDT → Wallet coordinadora (comisión)
   - Resto → Destinatario final
5. **Usuario firma**: Con su clave privada local
6. **Backend firma como sponsor**: Paga el gas de ambas transacciones
7. **Transacción ejecutada**: ¡Sin necesidad de TRX!

### Seguridad

- **No Custodial**: Las claves privadas nunca salen del navegador del usuario
- **Encriptación**: Wallet encriptada con AES antes de guardar en localStorage
- **Contraseña**: Requerida para desbloquear y firmar transacciones
- **Seed Phrase**: El usuario tiene control total con su seed phrase

## 🔧 Configuración de la Wallet Patrocinadora

Para que el sistema funcione, necesitas una wallet TRON con:

### 1. TRX para Stakear
- Aproximadamente 5,000 - 10,000 TRX
- Stakear para obtener Energía
- La Energía se usa para ejecutar contratos TRC20

### 2. Cómo stakear en TRON (Testnet Nile)

1. Ve a [Nile TronScan](https://nile.tronscan.org)
2. Conecta tu wallet
3. Ve a "Resources" → "Freeze"
4. Congela TRX para obtener Energía

### 3. Obtener TRX de Testnet

Para testing, puedes obtener TRX gratis de la testnet Nile:

\`\`\`bash
# Usa el faucet de Nile
https://nileex.io/join/getJoinPage
\`\`\`

## 📚 API Endpoints

### GET /api/health
Health check del servidor

### GET /api/balance/:address
Obtiene el balance de USDT de una dirección

### POST /api/transaction/prepare
Prepara las transacciones split (comisión + principal)

**Body:**
\`\`\`json
{
  "userAddress": "TxXxXx...",
  "toAddress": "TyYyYy...",
  "amount": "10"
}
\`\`\`

### POST /api/transaction/submit
Envía las transacciones firmadas a la red

**Body:**
\`\`\`json
{
  "userAddress": "TxXxXx...",
  "toAddress": "TyYyYy...",
  "amount": "10",
  "signedFeeTransaction": { ... },
  "signedMainTransaction": { ... }
}
\`\`\`

### GET /api/sponsor/status
Obtiene el estado de la wallet patrocinadora

### GET /api/transaction/:txHash
Obtiene información de una transacción

## 🎨 Personalización

### Cambiar el tema de colores

Edita \`frontend/src/styles/App.css\`:

\`\`\`css
:root {
  --neon-purple: #9d4edd;
  --neon-pink: #e0aaff;
  --neon-dark-purple: #5a189a;
  /* ... más colores ... */
}
\`\`\`

### Cambiar la comisión

Edita \`backend/.env\`:

\`\`\`env
FEE_AMOUNT_USDT=1  # Cambiar a tu comisión deseada
\`\`\`

## 🌐 Deployment a Producción

### Backend

1. Cambia \`TRON_NETWORK\` a \`mainnet\`
2. Actualiza los endpoints de TRON a mainnet
3. Usa el contrato USDT de mainnet: \`TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t\`
4. Deploy a servicios como:
   - Railway
   - Render
   - DigitalOcean
   - AWS

### Frontend

1. Build del proyecto:
\`\`\`bash
npm run build
\`\`\`

2. Deploy a:
   - Vercel
   - Netlify
   - GitHub Pages
   - Cloudflare Pages

## 📖 Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- TronWeb
- ethers.js (BIP39)
- CryptoJS
- CSS moderno

### Backend
- Node.js
- Express
- TronWeb
- CORS
- Helmet
- Rate Limiting

## 🔐 Seguridad

### Para Usuarios
- ⚠️ **NUNCA** compartas tu seed phrase con nadie
- ⚠️ **SIEMPRE** guarda tu seed phrase de forma segura offline
- ⚠️ Usa una contraseña fuerte para encriptar tu wallet
- ⚠️ Verifica las direcciones de destino antes de enviar

### Para Desarrolladores
- 🔒 La clave privada del sponsor debe guardarse de forma segura
- 🔒 Usa variables de entorno, nunca hardcodees claves
- 🔒 Implementa rate limiting en producción
- 🔒 Monitorea los recursos del sponsor regularmente

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo \`LICENSE\` para más detalles.

## 🙏 Agradecimientos

- [TRON Network](https://tron.network/) por la infraestructura blockchain
- [TronWeb](https://github.com/tronprotocol/tronweb) por la librería JavaScript
- Comunidad de desarrolladores TRON

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- Abre un [Issue](https://github.com/tu-usuario/claudewallet/issues)
- Únete a nuestro [Discord/Telegram]
- Revisa la [Documentación de TRON](https://developers.tron.network/)

## 🚧 Roadmap

- [ ] Soporte para múltiples tokens TRC20
- [ ] Sistema de múltiples wallets patrocinadoras (load balancing)
- [ ] Historial de transacciones
- [ ] Exportar datos de transacciones
- [ ] Modo oscuro / claro
- [ ] Soporte para más idiomas
- [ ] Integración con WalletConnect
- [ ] App móvil nativa

---

Hecho con 💜 para la comunidad TRON
