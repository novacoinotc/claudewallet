const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  /**
   * Realiza una petición HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * GET /api/balance/:address
   * Obtiene el balance de USDT de una dirección
   */
  async getBalance(address) {
    return this.request(`/balance/${address}`);
  }

  /**
   * POST /api/transaction/prepare
   * Prepara las transacciones (comisión + principal)
   */
  async prepareTransaction(userAddress, toAddress, amount) {
    return this.request('/transaction/prepare', {
      method: 'POST',
      body: JSON.stringify({
        userAddress,
        toAddress,
        amount
      })
    });
  }

  /**
   * POST /api/transaction/submit
   * Envía las transacciones firmadas
   */
  async submitTransaction(userAddress, toAddress, amount, signedFeeTransaction, signedMainTransaction) {
    return this.request('/transaction/submit', {
      method: 'POST',
      body: JSON.stringify({
        userAddress,
        toAddress,
        amount,
        signedFeeTransaction,
        signedMainTransaction
      })
    });
  }

  /**
   * GET /api/transaction/:txHash
   * Obtiene información de una transacción
   */
  async getTransactionInfo(txHash) {
    return this.request(`/transaction/${txHash}`);
  }

  /**
   * GET /api/sponsor/status
   * Obtiene el estado del sponsor
   */
  async getSponsorStatus() {
    return this.request('/sponsor/status');
  }

  /**
   * GET /api/health
   * Health check
   */
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();
