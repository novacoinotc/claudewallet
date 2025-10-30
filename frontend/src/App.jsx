import { useState, useEffect } from 'react';
import WalletService from './utils/WalletService';
import WalletCreation from './components/WalletCreation';
import Dashboard from './components/Dashboard';
import './styles/App.css';

function App() {
  const [hasWallet, setHasWallet] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una wallet guardada
    const walletExists = WalletService.hasWallet();
    setHasWallet(walletExists);

    if (walletExists) {
      // Obtener la dirección guardada
      const address = WalletService.getStoredAddress();
      setWallet({ address });
    }

    setLoading(false);
  }, []);

  const handleWalletCreated = (newWallet) => {
    setWallet(newWallet);
    setHasWallet(true);
    setIsUnlocked(true);
  };

  const handleUnlock = () => {
    try {
      setError('');
      const decryptedWallet = WalletService.loadWallet(unlockPassword);
      setWallet(decryptedWallet);
      setIsUnlocked(true);
      setUnlockPassword('');
    } catch (err) {
      setError('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setWallet({ address: WalletService.getStoredAddress() });
    setUnlockPassword('');
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="spinner"></div>
        <div className="loading-text">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <h1>TRON Gas-Free Wallet</h1>
        <p>Envía USDT sin necesidad de TRX. Paga solo 1 USDT de comisión</p>
      </div>

      {/* Contenido principal */}
      {!hasWallet ? (
        // No hay wallet: mostrar creación/importación
        <WalletCreation onWalletCreated={handleWalletCreated} />
      ) : !isUnlocked ? (
        // Hay wallet pero está bloqueada: mostrar unlock
        <div className="card">
          <h2>Desbloquear Wallet</h2>

          <div className="address-display" style={{ marginBottom: '20px' }}>
            {wallet.address}
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Ingresa tu contraseña"
              autoFocus
            />
          </div>

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          <button
            className="btn btn-primary btn-block glow-animation"
            onClick={handleUnlock}
            disabled={!unlockPassword}
          >
            Desbloquear
          </button>

          <div className="alert alert-info" style={{ marginTop: '20px' }}>
            <strong>¿Olvidaste tu contraseña?</strong>
            <br />
            Puedes eliminar esta wallet e importarla nuevamente usando tu seed phrase.
            <br /><br />
            <button
              className="btn btn-danger btn-block"
              onClick={() => {
                if (window.confirm('¿Estás seguro? Asegúrate de tener tu seed phrase.')) {
                  WalletService.deleteWallet();
                  setHasWallet(false);
                  setWallet(null);
                }
              }}
            >
              Eliminar Wallet
            </button>
          </div>
        </div>
      ) : (
        // Wallet desbloqueada: mostrar dashboard
        <Dashboard wallet={wallet} onLogout={handleLogout} />
      )}

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
      }}>
        <p>
          Sistema de Fee Delegation para TRON
        </p>
        <p style={{ marginTop: '10px' }}>
          Red: TRON Testnet (Nile) | Comisión: 1 USDT | Gas: 0 TRX ⚡
        </p>
      </div>
    </div>
  );
}

export default App;
