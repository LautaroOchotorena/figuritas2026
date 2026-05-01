import { useUIStore } from '../../store/uiStore';
import type { Toast as ToastType } from '../../types';

const ICONS: Record<string, string> = {
  success: '✅',
  warning: '⚠️',
  error: '❌',
  info: 'ℹ️',
};

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useUIStore((s) => s.removeToast);
  return (
    <div className={`toast ${toast.type}`}>
      <span className="toast-icon">{ICONS[toast.type]}</span>
      <div className="toast-content">
        <div className="toast-message">{toast.message}</div>
        {toast.detail && <div className="toast-detail">{toast.detail}</div>}
      </div>
      <button className="toast-close" onClick={() => removeToast(toast.id)}>×</button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container">
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
