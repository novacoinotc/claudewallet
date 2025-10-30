import TronWeb from 'tronweb';

class TronService {
  constructor() {
    this.tronWeb = new TronWeb({
      fullHost: process.env.TRON_FULL_NODE || 'https://nile.trongrid.io',
      privateKey: process.env.SPONSOR_PRIVATE_KEY
    });

    this.usdtContractAddress = process.env.USDT_CONTRACT_ADDRESS || 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
    this.feeReceiverAddress = process.env.FEE_RECEIVER_ADDRESS;
    this.feeAmount = parseFloat(process.env.FEE_AMOUNT_USDT || '1') * 1e6; // USDT tiene 6 decimales
  }

  /**
   * Obtiene el balance de USDT de una dirección
   */
  async getUSDTBalance(address) {
    try {
      const contract = await this.tronWeb.contract().at(this.usdtContractAddress);
      const balance = await contract.balanceOf(address).call();
      return balance.toString();
    } catch (error) {
      console.error('Error getting USDT balance:', error);
      throw error;
    }
  }

  /**
   * Obtiene información de la cuenta (bandwidth y energy)
   */
  async getAccountResources(address) {
    try {
      const resources = await this.tronWeb.trx.getAccountResources(address);
      return {
        freeNetUsed: resources.freeNetUsed || 0,
        freeNetLimit: resources.freeNetLimit || 0,
        energyUsed: resources.EnergyUsed || 0,
        energyLimit: resources.EnergyLimit || 0
      };
    } catch (error) {
      console.error('Error getting account resources:', error);
      throw error;
    }
  }

  /**
   * Valida que una dirección TRON sea válida
   */
  isValidAddress(address) {
    return this.tronWeb.isAddress(address);
  }

  /**
   * Convierte una dirección de formato hex a base58
   */
  fromHex(hexAddress) {
    return this.tronWeb.address.fromHex(hexAddress);
  }

  /**
   * Convierte una dirección de formato base58 a hex
   */
  toHex(address) {
    return this.tronWeb.address.toHex(address);
  }

  /**
   * Obtiene los recursos de la wallet patrocinadora
   */
  async getSponsorResources() {
    const sponsorAddress = this.tronWeb.address.fromPrivateKey(process.env.SPONSOR_PRIVATE_KEY);
    const resources = await this.getAccountResources(sponsorAddress);
    const trxBalance = await this.tronWeb.trx.getBalance(sponsorAddress);

    return {
      address: sponsorAddress,
      trxBalance: trxBalance / 1e6, // Convertir de sun a TRX
      ...resources
    };
  }

  /**
   * Crea una transacción de transferencia de USDT sin firmar
   */
  async createUSDTTransferTransaction(fromAddress, toAddress, amount) {
    try {
      const contract = await this.tronWeb.contract().at(this.usdtContractAddress);

      // Crear la transacción sin firmar
      const transaction = await contract.transfer(toAddress, amount).send({
        feeLimit: 100000000, // 100 TRX fee limit
        from: fromAddress,
        shouldPollResponse: false
      });

      return transaction;
    } catch (error) {
      console.error('Error creating USDT transfer transaction:', error);
      throw error;
    }
  }

  /**
   * Valida que el usuario tenga suficiente USDT para la transacción + comisión
   */
  async validateBalance(userAddress, amount) {
    const balance = await this.getUSDTBalance(userAddress);
    const balanceNumber = parseFloat(balance) / 1e6;
    const amountNumber = parseFloat(amount) / 1e6;
    const feeNumber = this.feeAmount / 1e6;

    if (balanceNumber < (amountNumber + feeNumber)) {
      throw new Error(
        `Balance insuficiente. Necesitas ${amountNumber + feeNumber} USDT (${amountNumber} + ${feeNumber} de comisión). Tienes ${balanceNumber} USDT.`
      );
    }

    return true;
  }

  /**
   * Obtiene detalles de una transacción
   */
  async getTransactionInfo(txHash) {
    try {
      const tx = await this.tronWeb.trx.getTransaction(txHash);
      const info = await this.tronWeb.trx.getTransactionInfo(txHash);
      return { transaction: tx, info };
    } catch (error) {
      console.error('Error getting transaction info:', error);
      throw error;
    }
  }
}

export default TronService;
