import * as bip39 from 'bip39';
import { HDNodeWallet, Wallet } from 'ethers';
import TronWeb from 'tronweb';
import CryptoJS from 'crypto-js';

class WalletService {
  constructor() {
    this.tronWeb = new TronWeb({
      fullHost: 'https://nile.trongrid.io' // Testnet por defecto
    });
  }

  /**
   * Genera una nueva wallet con seed phrase (BIP39)
   */
  generateWallet() {
    try {
      // Generar mnemonic de 12 palabras
      const mnemonic = bip39.generateMnemonic();

      // Crear HD wallet desde el mnemonic
      const hdWallet = HDNodeWallet.fromPhrase(mnemonic);

      // Derivar la primera dirección (path m/44'/195'/0'/0/0 para TRON)
      const tronPath = "m/44'/195'/0'/0/0";
      const derivedWallet = hdWallet.derivePath(tronPath);

      // Obtener la clave privada
      const privateKey = derivedWallet.privateKey.slice(2); // Remover '0x'

      // Generar dirección TRON desde la clave privada
      const address = this.tronWeb.address.fromPrivateKey(privateKey);

      return {
        mnemonic,
        privateKey,
        address,
        path: tronPath
      };
    } catch (error) {
      console.error('Error generating wallet:', error);
      throw error;
    }
  }

  /**
   * Importa una wallet desde un mnemonic
   */
  importWalletFromMnemonic(mnemonic) {
    try {
      // Validar mnemonic
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Seed phrase inválida');
      }

      // Crear HD wallet desde el mnemonic
      const hdWallet = HDNodeWallet.fromPhrase(mnemonic);

      // Derivar la primera dirección TRON
      const tronPath = "m/44'/195'/0'/0/0";
      const derivedWallet = hdWallet.derivePath(tronPath);

      // Obtener la clave privada
      const privateKey = derivedWallet.privateKey.slice(2);

      // Generar dirección TRON
      const address = this.tronWeb.address.fromPrivateKey(privateKey);

      return {
        mnemonic,
        privateKey,
        address,
        path: tronPath
      };
    } catch (error) {
      console.error('Error importing wallet:', error);
      throw error;
    }
  }

  /**
   * Importa una wallet desde una clave privada
   */
  importWalletFromPrivateKey(privateKey) {
    try {
      // Remover '0x' si existe
      const cleanPrivateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;

      // Generar dirección TRON
      const address = this.tronWeb.address.fromPrivateKey(cleanPrivateKey);

      return {
        privateKey: cleanPrivateKey,
        address
      };
    } catch (error) {
      console.error('Error importing wallet from private key:', error);
      throw error;
    }
  }

  /**
   * Encripta la wallet con una contraseña antes de guardarla
   */
  encryptWallet(walletData, password) {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(walletData),
        password
      ).toString();

      return encrypted;
    } catch (error) {
      console.error('Error encrypting wallet:', error);
      throw error;
    }
  }

  /**
   * Desencripta la wallet con la contraseña
   */
  decryptWallet(encryptedData, password) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, password);
      const walletData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

      return walletData;
    } catch (error) {
      console.error('Error decrypting wallet:', error);
      throw new Error('Contraseña incorrecta');
    }
  }

  /**
   * Guarda la wallet encriptada en localStorage
   */
  saveWallet(walletData, password) {
    try {
      const encrypted = this.encryptWallet(walletData, password);
      localStorage.setItem('tron_wallet', encrypted);
      localStorage.setItem('wallet_address', walletData.address);

      return true;
    } catch (error) {
      console.error('Error saving wallet:', error);
      throw error;
    }
  }

  /**
   * Carga la wallet desde localStorage
   */
  loadWallet(password) {
    try {
      const encrypted = localStorage.getItem('tron_wallet');

      if (!encrypted) {
        throw new Error('No hay wallet guardada');
      }

      return this.decryptWallet(encrypted, password);
    } catch (error) {
      console.error('Error loading wallet:', error);
      throw error;
    }
  }

  /**
   * Verifica si hay una wallet guardada
   */
  hasWallet() {
    return localStorage.getItem('tron_wallet') !== null;
  }

  /**
   * Obtiene la dirección guardada (sin desencriptar)
   */
  getStoredAddress() {
    return localStorage.getItem('wallet_address');
  }

  /**
   * Elimina la wallet guardada
   */
  deleteWallet() {
    localStorage.removeItem('tron_wallet');
    localStorage.removeItem('wallet_address');
  }

  /**
   * Firma una transacción con la clave privada
   */
  async signTransaction(transaction, privateKey) {
    try {
      const tronWeb = new TronWeb({
        fullHost: 'https://nile.trongrid.io',
        privateKey
      });

      const signedTransaction = await tronWeb.trx.sign(transaction, privateKey);
      return signedTransaction;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  }

  /**
   * Valida una dirección TRON
   */
  isValidAddress(address) {
    return this.tronWeb.isAddress(address);
  }
}

export default new WalletService();
