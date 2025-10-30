// Vercel Serverless Function Entry Point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import TransactionController from '../src/controllers/TransactionController.js';
import { errorHandler, notFound } from '../src/middleware/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Inicializar controlador
const transactionController = new TransactionController();

// Middleware de seguridad
app.use(helmet());

// CORS - Configurar para Vercel
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
app.use(cors({
  origin: allowedOrigins.includes('*') ? '*' : (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    error: 'Demasiadas solicitudes, por favor intenta más tarde.'
  }
});

app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (simplificado para serverless)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas de la API
app.get('/api/health', (req, res) => transactionController.healthCheck(req, res));
app.get('/api/balance/:address', (req, res) => transactionController.getBalance(req, res));
app.post('/api/transaction/prepare', (req, res) => transactionController.prepareTransaction(req, res));
app.post('/api/transaction/submit', (req, res) => transactionController.submitTransaction(req, res));
app.get('/api/transaction/:txHash', (req, res) => transactionController.getTransactionInfo(req, res));
app.get('/api/sponsor/status', (req, res) => transactionController.getSponsorStatus(req, res));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'TRON Gas-Free Wallet API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      balance: '/api/balance/:address',
      prepare: '/api/transaction/prepare',
      submit: '/api/transaction/submit',
      transaction: '/api/transaction/:txHash',
      sponsor: '/api/sponsor/status'
    }
  });
});

// Middleware de error
app.use(notFound);
app.use(errorHandler);

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

// Exportar para Vercel Serverless
export default app;
