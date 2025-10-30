import { useState } from 'react';
import WalletService from '../utils/WalletService';

function WalletCreation({ onWalletCreated }) {
  const [step, setStep] = useState(1); // 1: Options, 2: Create New, 3: Import
  const [wallet, setWallet] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [importMnemonic, setImportMnemonic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seedConfirmed, setSeedConfirmed] = useState(false);

  const handleCreateNewWallet = () => {
    try {
      setLoading(true);
      setError('');

      const newWallet = WalletService.generateWallet();
      setWallet(newWallet);
      setStep(2);
    } catch (err) {
      setError('Error al generar la wallet: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportWallet = () => {
    try {
      setLoading(true);
      setError('');

      if (!importMnemonic.trim()) {
        throw new Error('Por favor ingresa tu seed phrase');
      }

      const importedWallet = WalletService.importWalletFromMnemonic(importMnemonic.trim());
      setWallet(importedWallet);
      setStep(3);
    } catch (err) {
      setError('Error al importar la wallet: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWallet = () => {
    try {
      setLoading(true);
      setError('');

      // Validaciones
      if (!password) {
        throw new Error('Por favor ingresa una contraseña');
      }

      if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (step === 2 && !seedConfirmed) {
        throw new Error('Por favor confirma que guardaste tu seed phrase');
      }

      // Guardar wallet encriptada
      WalletService.saveWallet(wallet, password);

      // Notificar que la wallet fue creada
      onWalletCreated(wallet);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copySeedPhrase = () => {
    navigator.clipboard.writeText(wallet.mnemonic);
    alert('Seed phrase copiada al portapapeles');
  };

  // Step 1: Opciones
  if (step === 1) {
    return (
      <div className="card">
        <h2>Bienvenido a TRON Gas-Free Wallet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
          Crea una nueva wallet o importa una existente
        </p>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={handleCreateNewWallet}
            disabled={loading}
          >
            Crear Nueva Wallet
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => setStep(3)}
          >
            Importar Wallet
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Mostrar seed phrase
  if (step === 2 && wallet) {
    return (
      <div className="card">
        <h2>Tu Seed Phrase</h2>

        <div className="alert alert-info">
          <strong>⚠️ IMPORTANTE:</strong> Guarda estas 12 palabras en un lugar seguro.
          Son la única forma de recuperar tu wallet. Nunca las compartas con nadie.
        </div>

        <div className="seed-phrase">
          <div className="seed-phrase-grid">
            {wallet.mnemonic.split(' ').map((word, index) => (
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

        <div style={{ margin: '20px 0' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={seedConfirmed}
              onChange={(e) => setSeedConfirmed(e.target.checked)}
              style={{ marginRight: '10px', width: '20px', height: '20px' }}
            />
            <span style={{ color: 'var(--neon-pink)' }}>
              He guardado mi seed phrase de forma segura
            </span>
          </label>
        </div>

        <div className="input-group">
          <label>Crea una contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div className="input-group">
          <label>Confirma la contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite la contraseña"
          />
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <button
          className="btn btn-primary btn-block"
          onClick={handleSaveWallet}
          disabled={loading || !seedConfirmed}
        >
          {loading ? 'Guardando...' : 'Guardar Wallet'}
        </button>
      </div>
    );
  }

  // Step 3: Importar wallet
  if (step === 3) {
    return (
      <div className="card">
        <h2>Importar Wallet</h2>

        <div className="input-group">
          <label>Seed Phrase (12 palabras)</label>
          <textarea
            value={importMnemonic}
            onChange={(e) => setImportMnemonic(e.target.value)}
            placeholder="Ingresa tus 12 palabras separadas por espacios"
            rows={4}
          />
        </div>

        {!wallet && (
          <>
            {error && (
              <div className="alert alert-error">{error}</div>
            )}

            <div className="button-group">
              <button
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                Volver
              </button>

              <button
                className="btn btn-primary"
                onClick={handleImportWallet}
                disabled={loading}
              >
                {loading ? 'Importando...' : 'Importar'}
              </button>
            </div>
          </>
        )}

        {wallet && (
          <>
            <div className="alert alert-success">
              Wallet importada exitosamente
            </div>

            <div className="input-group">
              <label>Crea una contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div className="input-group">
              <label>Confirma la contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
              />
            </div>

            {error && (
              <div className="alert alert-error">{error}</div>
            )}

            <button
              className="btn btn-primary btn-block"
              onClick={handleSaveWallet}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Wallet'}
            </button>
          </>
        )}
      </div>
    );
  }

  return null;
}

export default WalletCreation;
