const ToastMessage = ({ message, type = 'info', onClose }) => {
  const theme =
    type === 'success'
      ? 'border-emerald-500/40 bg-emerald-900/20 text-emerald-200'
      : 'border-cyan-500/40 bg-cyan-900/20 text-cyan-200';

  return (
    <div className={`mb-3 flex items-center justify-between rounded border p-2 text-sm ${theme}`} role="status" aria-live="polite">
      <span>{message}</span>
      <button onClick={onClose} className="ml-3 text-xs underline">
        Dismiss
      </button>
    </div>
  );
};

export default ToastMessage;
