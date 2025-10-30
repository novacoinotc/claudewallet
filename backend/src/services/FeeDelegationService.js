import TronWeb from 'tronweb';

class FeeDelegationService {
  constructor(tronService) {
    this.tronService = tronService;
    this.tronWeb = tronService.tronWeb;
  }

  /**
   * Procesa una transacción con fee delegation
   * El flujo es:
   * 1. Usuario crea 2 transacciones:
   *    a) 1 USDT a wallet coordinadora (comisión)
   *    b) Resto a destinatario final
   * 2. Usuario firma ambas transacciones con su clave privada
   * 3. Backend (sponsor) firma como fee delegator
   * 4. Transacciones se envían a la red
   */
  async processDelegatedTransaction(transactionData) {
    try {
      const {
        userAddress,
        toAddress,
        amount,
        signedFeeTransaction,
        signedMainTransaction
      } = transactionData;

      // Validar que las direcciones sean válidas
      if (!this.tronService.isValidAddress(userAddress)) {
        throw new Error('Dirección de usuario inválida');
      }
      if (!this.tronService.isValidAddress(toAddress)) {
        throw new Error('Dirección de destino inválida');
      }

      // Validar balance
      await this.tronService.validateBalance(userAddress, amount);

      // Verificar recursos del sponsor
      const sponsorResources = await this.tronService.getSponsorResources();
      if (sponsorResources.energyLimit < 50000) {
        throw new Error('Sponsor sin energía suficiente. Contacta al administrador.');
      }

      // Broadcast de la transacción de comisión primero
      console.log('Broadcasting fee transaction...');
      const feeResult = await this.broadcastTransaction(signedFeeTransaction);

      if (!feeResult.result) {
        throw new Error('Error al enviar transacción de comisión: ' + feeResult.message);
      }

      // Esperar un momento para asegurar que la comisión se procese
      await this.sleep(3000);

      // Broadcast de la transacción principal
      console.log('Broadcasting main transaction...');
      const mainResult = await this.broadcastTransaction(signedMainTransaction);

      if (!mainResult.result) {
        throw new Error('Error al enviar transacción principal: ' + mainResult.message);
      }

      return {
        success: true,
        feeTransaction: feeResult.txid,
        mainTransaction: mainResult.txid,
        message: 'Transacciones enviadas exitosamente'
      };

    } catch (error) {
      console.error('Error in fee delegation:', error);
      throw error;
    }
  }

  /**
   * Firma una transacción como fee delegator (sponsor)
   */
  async signAsSponsor(transaction) {
    try {
      // El sponsor firma la transacción para pagar el gas
      const signedTransaction = await this.tronWeb.trx.sign(
        transaction,
        process.env.SPONSOR_PRIVATE_KEY
      );

      return signedTransaction;
    } catch (error) {
      console.error('Error signing as sponsor:', error);
      throw error;
    }
  }

  /**
   * Broadcast de una transacción a la red TRON
   */
  async broadcastTransaction(signedTransaction) {
    try {
      const result = await this.tronWeb.trx.sendRawTransaction(signedTransaction);
      return result;
    } catch (error) {
      console.error('Error broadcasting transaction:', error);
      throw error;
    }
  }

  /**
   * Crea las 2 transacciones necesarias (comisión + principal)
   * Retorna las transacciones sin firmar para que el usuario las firme
   */
  async createSplitTransactions(userAddress, toAddress, totalAmount) {
    try {
      const amountInSun = parseFloat(totalAmount) * 1e6; // Convertir USDT a unidades mínimas
      const feeAmountInSun = this.tronService.feeAmount;
      const mainAmountInSun = amountInSun - feeAmountInSun;

      if (mainAmountInSun <= 0) {
        throw new Error('El monto debe ser mayor a 1 USDT (comisión)');
      }

      // Validar balance del usuario
      await this.tronService.validateBalance(userAddress, amountInSun);

      // Obtener el contrato USDT
      const contract = await this.tronWeb.contract().at(this.tronService.usdtContractAddress);

      // Transacción 1: Comisión de 1 USDT a wallet coordinadora
      const feeTransaction = await contract.transfer(
        this.tronService.feeReceiverAddress,
        feeAmountInSun
      ).send({
        feeLimit: 100000000,
        from: userAddress,
        shouldPollResponse: false
      });

      // Transacción 2: Resto al destinatario
      const mainTransaction = await contract.transfer(
        toAddress,
        mainAmountInSun
      ).send({
        feeLimit: 100000000,
        from: userAddress,
        shouldPollResponse: false
      });

      return {
        feeTransaction,
        mainTransaction,
        amounts: {
          total: totalAmount,
          fee: feeAmountInSun / 1e6,
          toRecipient: mainAmountInSun / 1e6
        }
      };

    } catch (error) {
      console.error('Error creating split transactions:', error);
      throw error;
    }
  }

  /**
   * Utility: Sleep function
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Verifica el estado de una transacción
   */
  async verifyTransactionStatus(txHash) {
    try {
      const info = await this.tronService.getTransactionInfo(txHash);
      return {
        confirmed: info.info && info.info.receipt && info.info.receipt.result === 'SUCCESS',
        info: info
      };
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return { confirmed: false, error: error.message };
    }
  }
}

export default FeeDelegationService;
