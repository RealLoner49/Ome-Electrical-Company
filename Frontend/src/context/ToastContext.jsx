import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import './Toast.css';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => removeToast(id), 3200);
  }, [removeToast]);

  const showConfirm = useCallback((message, options = {}) => new Promise((resolve) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const close = (answer) => {
      removeToast(id);
      resolve(answer);
    };
    setToasts((current) => [
      ...current,
      {
        id,
        message,
        type: options.type || 'info',
        confirm: true,
        confirmLabel: options.confirmLabel || 'Yes',
        cancelLabel: options.cancelLabel || 'Cancel',
        onConfirm: () => close(true),
        onCancel: () => close(false),
      },
    ]);
  }), [removeToast]);

  const value = useMemo(() => ({ showToast, showConfirm }), [showToast, showConfirm]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            <span className="toast__icon">{toast.type === 'error' ? '!' : toast.type === 'info' ? 'i' : 'OK'}</span>
            <div className="toast__body">
              <p>{toast.message}</p>
              {toast.confirm && (
                <div className="toast__actions">
                  <button type="button" className="toast__action toast__action--cancel" onClick={toast.onCancel}>
                    {toast.cancelLabel}
                  </button>
                  <button type="button" className="toast__action toast__action--confirm" onClick={toast.onConfirm}>
                    {toast.confirmLabel}
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="toast__close" onClick={toast.confirm ? toast.onCancel : () => removeToast(toast.id)} aria-label="Dismiss notification">x</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
