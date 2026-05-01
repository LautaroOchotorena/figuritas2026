import { useUIStore } from '../../store/uiStore';
import { useAlbumStore } from '../../store/albumStore';
import { exportAlbum, downloadJSON, readJSONFile } from '../../services/storageService';
import { useRef, useState } from 'react';

export default function SettingsModal() {
  const show = useUIStore((s) => s.showSettings);
  const setShow = useUIStore((s) => s.setShowSettings);
  const setShowBulkInput = useUIStore((s) => s.setShowBulkInput);
  const addToast = useUIStore((s) => s.addToast);
  const stickers = useAlbumStore((s) => s.stickers);
  const importData = useAlbumStore((s) => s.importData);
  const resetAlbum = useAlbumStore((s) => s.resetAlbum);

  const fileRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'data' | 'help'>('data');

  if (!show) return null;

  const handleExport = () => {
    const data = exportAlbum(stickers);
    downloadJSON(data);
    addToast({ type: 'success', message: 'Álbum exportado', detail: 'Archivo JSON descargado' });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await readJSONFile(file);
    if (data) {
      const count = importData(data);
      addToast({ type: 'success', message: `${count} figuritas importadas` });
    } else {
      addToast({ type: 'error', message: 'Archivo inválido' });
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de resetear todo el álbum? Se perderá todo el progreso y no se puede deshacer.')) {
      resetAlbum();
      addToast({ type: 'info', message: 'Álbum reseteado a cero' });
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShow(false)}>
      <div className="modal settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ paddingBottom: 0, position: 'relative', display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16 }}>
            <div className="modal-title">⚙️ Opciones y Ayuda</div>
            <button className="modal-close" onClick={() => setShow(false)}>×</button>
          </div>

          <div className="settings-tabs">
            <button className={`settings-tab ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>Datos y Configuración</button>
            <button className={`settings-tab ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}>¿Cómo usar?</button>
          </div>
        </div>

        <div className="modal-body">
          {activeTab === 'data' && (
            <div className="settings-content">
              <div className="settings-group">
                <div className="settings-label">Carga de Figuritas</div>
                <p className="settings-desc">Pegá una lista larga de figuritas separadas por comas en vez de cargarlas una por una.</p>
                <button className="btn btn-secondary" onClick={() => { setShow(false); setShowBulkInput(true); }}>
                  📋 Abrir Carga Masiva
                </button>
              </div>

              <div className="settings-group">
                <div className="settings-label">Importar / Exportar Progreso</div>
                <p className="settings-desc">Guardá una copia de seguridad de tu álbum o cargá progreso desde otro dispositivo.</p>
                <div className="settings-row">
                  <button className="btn btn-secondary" onClick={handleExport}>📤 Exportar (JSON)</button>
                  <button className="btn btn-secondary" onClick={() => fileRef.current?.click()}>📥 Importar (JSON)</button>
                  <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                </div>
              </div>

              <div className="settings-group danger-zone">
                <div className="settings-label" style={{ color: 'var(--error)' }}>Zona de Peligro</div>
                <p className="settings-desc">Esto borrará absolutamente todas las figuritas que hayas marcado como obtenidas.</p>
                <button className="btn btn-danger" onClick={handleReset}>🗑️ Resetear Álbum Completo</button>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="settings-content" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
              <h3 style={{ marginBottom: 8, color: 'var(--accent)' }}>Entrada Manual</h3>
              <p style={{ marginBottom: 16 }}>
                Escribí el código de la figurita en la barra superior y presioná <strong>Enter</strong>.<br />
                Soporta códigos directos (<code>arg 1</code>, <code>fwc 00</code>) o nombres de países (<code>mexico 5</code>).<br />
                Podés cargar varias a la vez separándolas con comas: <code>arg 1, bra 5, cc 12</code>.
              </p>

              <h3 style={{ marginBottom: 8, color: 'var(--accent)' }}>Entrada por Voz 🎤</h3>
              <p style={{ marginBottom: 16 }}>
                Hacé clic en el micrófono flotante o <strong>mantené presionada la barra espaciadora</strong>.<br />
                Se debe dictar el nombre del país seguido del número de la figurita.<br />
                Ejemplo: <code>argentina 1</code>, <code>brasil 5</code>, <code>coca cola 12</code>.
              </p>

              <h3 style={{ marginBottom: 8, color: 'var(--accent)' }}>Interacción con Figuritas</h3>
              <ul style={{ marginBottom: 16, paddingLeft: 20 }}>
                <li style={{ marginBottom: 4 }}><strong>Click izquierdo:</strong> Marca la figurita como obtenida (✓). Si hacés click de nuevo la desmarca.</li>
                <li style={{ marginBottom: 4 }}><strong>Click derecho:</strong> Si ya tenés la figurita, agrega una repetida (×2, ×3, etc.).</li>
                <li style={{ marginBottom: 4 }}>Al entrar a una selección, podés marcar toda la página como completada de una vez.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
