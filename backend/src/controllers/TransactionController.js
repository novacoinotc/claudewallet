import TronService from '../services/TronService.js';
import FeeDelegationService from '../services/FeeDelegationService.js';

class TransactionController {
  constructor() {
    this.tronService = new TronService();
    this.feeDelegationService = new FeeDelegationService(this.tronService);
  }

  /**
   * GET /api/balance/:address
   * Obtiene el balance de USDT de una dirección
   */
  async getBalance(req, res) {
    try {
      const { address } = req.params;

      if (!this.tronService.isValidAddress(address)) {
        return res.status(400).json({
          success: false,
          error: 'Dirección TRON inválida'
        });
      }

      const balance = await this.tronService.getUSDTBalance(address);
      const balanceInUsdt = parseFloat(balance) / 1e6;

      res.json({
        success: true,
        address,
        balance: balanceInUsdt,
        balanceRaw: balance
      });

    } catch (error) {
      console.error('Error getting balance:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/transaction/prepare
   * Prepara las transacciones split (comisión + principal)
   */
  async prepareTransaction(req, res) {
    try {
      const { userAddress, toAddress, amount } = req.body;

      // Validaciones
      if (!userAddress || !toAddress || !amount) {
        return res.status(400).json({
          success: false,
          error: 'Faltan parámetros requeridos: userAddress, toAddress, amount'
        });
      }

      if (!this.tronService.isValidAddress(userAddress)) {
        return res.status(400).json({
          success: false,
          error: 'Dirección de usuario inválida'
        });
      }

      if (!this.tronService.isValidAddress(toAddress)) {
        return res.status(400).json({
          success: false,
          error: 'Dirección de destino inválida'
        });
      }

      if (parseFloat(amount) <= 1) {
        return res.status(400).json({
          success: false,
          error: 'El monto debe ser mayor a 1 USDT (1 USDT es la comisión)'
        });
      }

      // Crear las transacciones split
      const transactions = await this.feeDelegationService.createSplitTransactions(
        userAddress,
        toAddress,
        amount
      );

      res.json({
        success: true,
        transactions: {
          feeTransaction: transactions.feeTransaction,
          mainTransaction: transactions.mainTransaction
        },
        amounts: transactions.amounts,
        message: 'Transacciones preparadas. El usuario debe firmarlas.'
      });

    } catch (error) {
      console.error('Error preparing transaction:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/transaction/submit
   * Recibe las transacciones firmadas por el usuario y las envía a la red
   */
  async submitTransaction(req, res) {
    try {
      const {
        userAddress,
        toAddress,
        amount,
        signedFeeTransaction,
        signedMainTransaction
      } = req.body;

      // Validaciones
      if (!userAddress || !toAddress || !amount || !signedFeeTransaction || !signedMainTransaction) {
        return res.status(400).json({
          success: false,
          error: 'Faltan parámetros requeridos'
        });
      }

      // Procesar las transacciones con fee delegation
      const result = await this.feeDelegationService.processDelegatedTransaction({
        userAddress,
        toAddress,
        amount,
        signedFeeTransaction,
        signedMainTransaction
      });

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      console.error('Error submitting transaction:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/transaction/:txHash
   * Obtiene información de una transacción
   */
  async getTransactionInfo(req, res) {
    try {
      const { txHash } = req.params;

      const info = await this.tronService.getTransactionInfo(txHash);

      res.json({
        success: true,
        transaction: info
      });

    } catch (error) {
      console.error('Error getting transaction info:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/sponsor/status
   * Obtiene el estado de la wallet patrocinadora
   */
  async getSponsorStatus(req, res) {
    try {
      const resources = await this.tronService.getSponsorResources();

      res.json({
        success: true,
        sponsor: resources,
        operational: resources.energyLimit > 50000,
        message: resources.energyLimit > 50000
          ? 'Sistema operativo'
          : 'Advertencia: Energía baja. Contacta al administrador.'
      });

    } catch (error) {
      console.error('Error getting sponsor status:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/health
   * Health check endpoint
   */
  async healthCheck(req, res) {
    res.json({
      success: true,
      status: 'OK',
      timestamp: new Date().toISOString(),
      network: process.env.TRON_NETWORK || 'nile'
    });
  }
}

export default TransactionController;
