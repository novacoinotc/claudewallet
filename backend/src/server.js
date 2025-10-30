import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import TransactionController from './controllers/TransactionController.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Inicializar controlador
const transactionController = new TransactionController();

// Middleware de seguridad
app.use(helmet());

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
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
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
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

// Logging middleware
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

// Middleware de error
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     TRON Gas-Free Wallet Backend API                          ║
║                                                               ║
║     Server running on port ${PORT}                               ║
║     Network: ${process.env.TRON_NETWORK || 'nile'}                                   ║
║     Environment: ${process.env.NODE_ENV || 'development'}                           ║
║                                                               ║
║     API Endpoints:                                            ║
║     - GET  /api/health                                        ║
║     - GET  /api/balance/:address                              ║
║     - POST /api/transaction/prepare                           ║
║     - POST /api/transaction/submit                            ║
║     - GET  /api/transaction/:txHash                           ║
║     - GET  /api/sponsor/status                                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
