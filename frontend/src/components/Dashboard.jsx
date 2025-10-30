import { useState, useEffect } from 'react';
import ApiService from '../utils/ApiService';
import WalletService from '../utils/WalletService';
import SendTransaction from './SendTransaction';

function Dashboard({ wallet, onLogout }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSend, setShowSend] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [password, setPassword] = useState('');
  const [revealedWallet, setRevealedWallet] = useState(null);

  useEffect(() => {
    loadBalance();
    // Actualizar balance cada 10 segundos
    const interval = setInterval(loadBalance, 10000);
    return () => clearInterval(interval);
  }, [wallet]);

  const loadBalance = async () => {
    try {
      setError('');
      const result = await ApiService.getBalance(wallet.address);
      setBalance(result.balance);
    } catch (err) {
      setError('Error al cargar balance: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    alert('Dirección copiada al portapapeles');
  };

  const handleRevealSeed = () => {
    try {
      const decrypted = WalletService.loadWallet(password);
      setRevealedWallet(decrypted);
      setShowSeedPhrase(true);
      setPassword('');
    } catch (err) {
      alert('Contraseña incorrecta');
    }
  };

  const handleDeleteWallet = () => {
    if (window.confirm('¿Estás seguro? Asegúrate de tener tu seed phrase guardada.')) {
      WalletService.deleteWallet();
      onLogout();
    }
  };

  const copySeedPhrase = () => {
    navigator.clipboard.writeText(revealedWallet.mnemonic);
    alert('Seed phrase copiada al portapapeles');
  };

  if (showSend) {
    return (
      <SendTransaction
        wallet={wallet}
        balance={balance}
        onBack={() => {
          setShowSend(false);
          loadBalance();
        }}
      />
    );
  }

  return (
    <div>
      <div className="card">
        <h2>Mi Wallet</h2>

        {/* Balance */}
        {loading ? (
          <div>
            <div className="spinner"></div>
            <div className="loading-text">Cargando balance...</div>
          </div>
        ) : (
          <div className="balance-display">
            <div className="balance-label">Balance USDT</div>
            <div className="balance-amount">
              {balance !== null ? balance.toFixed(2) : '0.00'}
            </div>
            <div className="balance-label" style={{ fontSize: '0.9rem', marginTop: '10px' }}>
              Sin necesidad de TRX para gas ⚡
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {/* Dirección */}
        <div>
          <label style={{ color: 'var(--neon-pink)', marginBottom: '8px', display: 'block' }}>
            Tu dirección TRON
          </label>
          <div className="address-display">
            {wallet.address}
          </div>
          <button
            className="btn btn-secondary btn-block"
            onClick={copyAddress}
            style={{ marginTop: '10px' }}
          >
            Copiar Dirección
          </button>
        </div>

        {/* Botón de enviar */}
        <button
          className="btn btn-primary btn-block glow-animation"
          onClick={() => setShowSend(true)}
          disabled={!balance || balance < 1.1}
          style={{ marginTop: '30px' }}
        >
          Enviar USDT (Comisión: 1 USDT)
        </button>

        {balance !== null && balance < 1.1 && (
          <div className="alert alert-info" style={{ marginTop: '15px' }}>
            Necesitas al menos 1.1 USDT para realizar una transacción (1 USDT de comisión + mínimo a enviar)
          </div>
        )}
      </div>

      {/* Configuración */}
      <div className="card">
        <h3>Configuración</h3>

        {!showSeedPhrase ? (
          <>
            <div className="input-group">
              <label>Revelar Seed Phrase</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <div className="button-group">
              <button
                className="btn btn-secondary"
                onClick={handleRevealSeed}
                disabled={!password}
              >
                Revelar Seed
              </button>

              <button
                className="btn btn-danger"
                onClick={handleDeleteWallet}
              >
                Eliminar Wallet
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="alert alert-info">
              <strong>⚠️ IMPORTANTE:</strong> No compartas esta información con nadie
            </div>

            <div className="seed-phrase">
              <h4 style={{ color: 'var(--neon-pink)', marginBottom: '15px' }}>
                Seed Phrase
              </h4>
              <div className="seed-phrase-grid">
                {revealedWallet.mnemonic.split(' ').map((word, index) => (
                  <div key={index} className="seed-word">
                    <span>{index + 1}.</span> {word}
                  </div>
                ))}
              </div>

              <button
                className="btn btn-secondary btn-block"
                onClick={copySeedPhrase}
                style={{ marginTop: '15px' }}
              >
                Copiar Seed Phrase
              </button>
            </div>

            <div className="input-group">
              <label>Clave Privada</label>
              <textarea
                value={revealedWallet.privateKey}
                readOnly
                rows={3}
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <button
              className="btn btn-secondary btn-block"
              onClick={() => setShowSeedPhrase(false)}
            >
              Ocultar Información Sensible
            </button>
          </>
        )}
      </div>

      {/* Info del sistema */}
      <div className="card">
        <h3>Sistema Gas-Free</h3>
        <div className="tx-info">
          <div className="tx-info-row">
            <span className="tx-info-label">Comisión por transacción</span>
            <span className="tx-info-value">1 USDT</span>
          </div>
          <div className="tx-info-row">
            <span className="tx-info-label">TRX necesario</span>
            <span className="tx-info-value">0 TRX ⚡</span>
          </div>
          <div className="tx-info-row">
            <span className="tx-info-label">Red</span>
            <span className="tx-info-value">TRON Testnet (Nile)</span>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginTop: '15px' }}>
          Este sistema utiliza fee delegation. El gas es patrocinado automáticamente
          y solo pagas 1 USDT de comisión por cada transacción.
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
