// Vercel Serverless Function Entry Point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../backend/.env') });

// Import controllers and middleware from backend
const backendPath = join(__dirname, '../backend/src');

// Dynamically import backend modules
async function createApp() {
  const { default: TransactionController } = await import('../backend/src/controllers/TransactionController.js');
  const { errorHandler, notFound } = await import('../backend/src/middleware/errorHandler.js');

  const app = express();

  // Initialize controller
  const transactionController = new TransactionController();

  // Middleware de seguridad
  app.use(helmet());

  // CORS
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

  // Logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // API Routes
  app.get('/api/health', (req, res) => transactionController.healthCheck(req, res));
  app.get('/api/balance/:address', (req, res) => transactionController.getBalance(req, res));
  app.post('/api/transaction/prepare', (req, res) => transactionController.prepareTransaction(req, res));
  app.post('/api/transaction/submit', (req, res) => transactionController.submitTransaction(req, res));
  app.get('/api/transaction/:txHash', (req, res) => transactionController.getTransactionInfo(req, res));
  app.get('/api/sponsor/status', (req, res) => transactionController.getSponsorStatus(req, res));

  // Root endpoint
  app.get('/api', (req, res) => {
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

  // Error handlers
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

// Export for Vercel
export default async (req, res) => {
  const app = await createApp();
  return app(req, res);
};
