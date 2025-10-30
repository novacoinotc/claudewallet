import { useState } from 'react';
import ApiService from '../utils/ApiService';
import WalletService from '../utils/WalletService';

function SendTransaction({ wallet, balance, onBack }) {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Form, 2: Confirm, 3: Processing, 4: Success
  const [transactionPreview, setTransactionPreview] = useState(null);
  const [result, setResult] = useState(null);

  const handlePreview = () => {
    try {
      setError('');

      // Validaciones
      if (!toAddress) {
        throw new Error('Por favor ingresa una dirección de destino');
      }

      if (!WalletService.isValidAddress(toAddress)) {
        throw new Error('Dirección TRON inválida');
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Por favor ingresa un monto válido');
      }

      const amountNum = parseFloat(amount);
      const fee = 1;
      const total = amountNum + fee;

      if (total > balance) {
        throw new Error(`Balance insuficiente. Necesitas ${total} USDT (${amountNum} + ${fee} comisión). Tienes ${balance} USDT.`);
      }

      if (amountNum < 0.1) {
        throw new Error('El monto mínimo a enviar es 0.1 USDT');
      }

      setTransactionPreview({
        toAddress,
        amount: amountNum,
        fee: fee,
        total: total,
        recipient: amountNum
      });

      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      setError('');
      setStep(3);

      // Validar contraseña y obtener wallet
      let userWallet;
      try {
        userWallet = WalletService.loadWallet(password);
      } catch (err) {
        throw new Error('Contraseña incorrecta');
      }

      // Paso 1: Preparar transacciones en el backend
      console.log('Preparando transacciones...');
      const prepareResult = await ApiService.prepareTransaction(
        wallet.address,
        toAddress,
        transactionPreview.total
      );

      console.log('Transacciones preparadas:', prepareResult);

      // Paso 2: Firmar ambas transacciones con la clave privada del usuario
      console.log('Firmando transacción de comisión...');
      const signedFeeTransaction = await WalletService.signTransaction(
        prepareResult.transactions.feeTransaction,
        userWallet.privateKey
      );

      console.log('Firmando transacción principal...');
      const signedMainTransaction = await WalletService.signTransaction(
        prepareResult.transactions.mainTransaction,
        userWallet.privateKey
      );

      // Paso 3: Enviar transacciones firmadas al backend
      console.log('Enviando transacciones...');
      const submitResult = await ApiService.submitTransaction(
        wallet.address,
        toAddress,
        transactionPreview.total,
        signedFeeTransaction,
        signedMainTransaction
      );

      console.log('Resultado:', submitResult);

      setResult(submitResult);
      setStep(4);
      setPassword(''); // Limpiar contraseña
    } catch (err) {
      console.error('Error en transacción:', err);
      setError(err.message);
      setStep(2); // Volver al paso de confirmación
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransaction = () => {
    setToAddress('');
    setAmount('');
    setPassword('');
    setTransactionPreview(null);
    setResult(null);
    setError('');
    setStep(1);
  };

  // Step 1: Formulario
  if (step === 1) {
    return (
      <div className="card">
        <h2>Enviar USDT</h2>

        <div className="balance-display" style={{ marginBottom: '30px' }}>
          <div className="balance-label">Balance disponible</div>
          <div className="balance-amount" style={{ fontSize: '2rem' }}>
            {balance.toFixed(2)} USDT
          </div>
        </div>

        <div className="input-group">
          <label>Dirección de destino</label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Dirección TRON (TxXxXx...)"
          />
        </div>

        <div className="input-group">
          <label>Monto a enviar (USDT)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
          <small style={{ color: 'var(--text-secondary)', marginTop: '5px', display: 'block' }}>
            + 1 USDT de comisión automática
          </small>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <div className="button-group">
          <button
            className="btn btn-secondary"
            onClick={onBack}
          >
            Volver
          </button>

          <button
            className="btn btn-primary"
            onClick={handlePreview}
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Confirmación
  if (step === 2 && transactionPreview) {
    return (
      <div className="card">
        <h2>Confirmar Transacción</h2>

        <div className="tx-info">
          <div className="tx-info-row">
            <span className="tx-info-label">Enviar a</span>
            <span className="tx-info-value" style={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>
              {transactionPreview.toAddress}
            </span>
          </div>
          <div className="tx-info-row">
            <span className="tx-info-label">Monto al destinatario</span>
            <span className="tx-info-value">{transactionPreview.recipient} USDT</span>
          </div>
          <div className="tx-info-row">
            <span className="tx-info-label">Comisión</span>
            <span className="tx-info-value">{transactionPreview.fee} USDT</span>
          </div>
          <div className="tx-info-row" style={{ borderTop: '2px solid var(--neon-purple)', paddingTop: '15px', marginTop: '10px' }}>
            <span className="tx-info-label"><strong>Total a pagar</strong></span>
            <span className="tx-info-value"><strong>{transactionPreview.total} USDT</strong></span>
          </div>
        </div>

        <div className="alert alert-info" style={{ margin: '20px 0' }}>
          El sistema dividirá automáticamente tu pago en 2 transacciones:
          <br />1. {transactionPreview.fee} USDT a la wallet coordinadora (comisión)
          <br />2. {transactionPreview.recipient} USDT al destinatario
          <br /><br />
          El gas será patrocinado automáticamente. No necesitas TRX.
        </div>

        <div className="input-group">
          <label>Contraseña de la wallet</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
          />
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <div className="button-group">
          <button
            className="btn btn-secondary"
            onClick={() => setStep(1)}
            disabled={loading}
          >
            Volver
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={loading || !password}
          >
            {loading ? 'Procesando...' : 'Confirmar y Enviar'}
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Procesando
  if (step === 3) {
    return (
      <div className="card">
        <h2>Procesando Transacción</h2>

        <div className="spinner"></div>
        <div className="loading-text">
          Firmando y enviando transacciones a la red TRON...
        </div>

        <div className="alert alert-info" style={{ marginTop: '20px' }}>
          Por favor espera. Esto puede tomar unos segundos.
          <br />No cierres esta ventana.
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginTop: '20px' }}>
            {error}
            <br /><br />
            <button className="btn btn-secondary" onClick={() => setStep(2)}>
              Reintentar
            </button>
          </div>
        )}
      </div>
    );
  }

  // Step 4: Éxito
  if (step === 4 && result) {
    return (
      <div className="card">
        <h2>✓ Transacción Exitosa</h2>

        <div className="alert alert-success">
          ¡Tus USDT han sido enviados exitosamente sin necesidad de TRX!
        </div>

        <div className="tx-info">
          <div className="tx-info-row">
            <span className="tx-info-label">Monto enviado</span>
            <span className="tx-info-value">{transactionPreview.recipient} USDT</span>
          </div>
          <div className="tx-info-row">
            <span className="tx-info-label">Comisión pagada</span>
            <span className="tx-info-value">{transactionPreview.fee} USDT</span>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: 'var(--neon-pink)', marginBottom: '10px', fontSize: '1.1rem' }}>
            Hashes de Transacciones
          </h3>

          <div className="input-group">
            <label>TX Comisión</label>
            <div className="address-display" style={{ fontSize: '0.8rem' }}>
              {result.feeTransaction}
            </div>
            <a
              href={`https://nile.tronscan.org/#/transaction/${result.feeTransaction}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-block"
              style={{ marginTop: '5px' }}
            >
              Ver en TronScan
            </a>
          </div>

          <div className="input-group">
            <label>TX Principal</label>
            <div className="address-display" style={{ fontSize: '0.8rem' }}>
              {result.mainTransaction}
            </div>
            <a
              href={`https://nile.tronscan.org/#/transaction/${result.mainTransaction}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-block"
              style={{ marginTop: '5px' }}
            >
              Ver en TronScan
            </a>
          </div>
        </div>

        <div className="button-group" style={{ marginTop: '30px' }}>
          <button
            className="btn btn-secondary"
            onClick={onBack}
          >
            Volver al Dashboard
          </button>

          <button
            className="btn btn-primary"
            onClick={handleNewTransaction}
          >
            Nueva Transacción
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default SendTransaction;
