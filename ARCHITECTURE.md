# Arquitectura del Sistema Gas-Free Wallet para TRON

## Descripción General
Sistema de wallet no custodial para TRON que permite a los usuarios realizar transacciones sin tener TRX para pagar el gas, utilizando un sistema de fee delegation y comisiones en USDT.

## Componentes Principales

### 1. Frontend (React + Vite)
- **Interfaz de Usuario**: Estilo morado neón moderno
- **Gestión de Wallet**: Creación, importación, backup de seed phrase
- **Transacciones**: Envío de USDT sin necesidad de TRX
- **Seguridad**: Encriptación local de claves privadas

### 2. Backend (Node.js + Express)
- **API de Fee Delegation**: Firma transacciones como patrocinador
- **Gestión de Energía**: Monitoreo del TRX stakeado
- **Sistema de Comisiones**: Validación y procesamiento de comisiones de 1 USDT
- **Coordinación de Transacciones**: Split automático de pagos

### 3. Blockchain Integration (TronWeb)
- **Red TRON**: Conexión a mainnet/testnet (Nile/Shasta)
- **Contratos Smart**: USDT TRC20 (TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)
- **Fee Delegation**: Sistema de firma múltiple para patrocinio de gas

## Flujo de Transacción

```
1. Usuario crea wallet (seed phrase BIP39)
   ↓
2. Usuario recibe USDT en su wallet
   ↓
3. Usuario inicia transacción de X USDT a destino
   ↓
4. Sistema crea 2 transacciones en batch:
   a) 1 USDT → Wallet Coordinadora (comisión)
   b) (X-1) USDT → Destino del usuario
   ↓
5. Usuario firma con su clave privada
   ↓
6. Backend firma como fee delegator (patrocina el gas)
   ↓
7. Transacción se ejecuta en TRON sin necesidad de TRX del usuario
```

## Seguridad

### Wallet del Usuario (No Custodial)
- Seed phrase generada localmente con BIP39
- Claves privadas nunca salen del dispositivo del usuario
- Encriptación con contraseña antes de guardar en localStorage
- El usuario tiene control total de sus fondos

### Wallet Patrocinadora (Backend)
- Clave privada almacenada de forma segura en variables de entorno
- Solo firma como fee delegator, no tiene acceso a fondos de usuarios
- Monitoreo de energía y recursos
- Sistema de rate limiting para prevenir abuso

## Tecnologías

### Frontend
- React 18
- Vite
- TronWeb
- ethers.js (para BIP39 y derivación HD)
- CSS moderno con tema morado neón

### Backend
- Node.js 18+
- Express
- TronWeb
- dotenv para configuración
- CORS para seguridad

## Configuración de Energía

La wallet patrocinadora necesita:
- **TRX Stakeado**: ~5000-10000 TRX para energía
- **Bandwidth**: Generado automáticamente al tener TRX
- **Energy**: Obtenida mediante staking para ejecutar contratos TRC20

## Modelo de Negocio

- Comisión fija: **1 USDT por transacción**
- Esto cubre:
  - Costo de energía/bandwidth
  - Mantenimiento del sistema
  - Margen operativo

## Escalabilidad

- Sistema diseñado para manejar múltiples usuarios simultáneos
- Pool de wallets patrocinadoras para distribución de carga
- Posibilidad de implementar cola de transacciones
- Monitoreo de recursos en tiempo real
