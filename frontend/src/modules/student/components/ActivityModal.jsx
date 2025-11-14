// src/modules/student/components/ActivityModal.jsx
import React, { useEffect, useRef } from 'react';

export default function ActivityModal({ show, onClose, title, children }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [show, onClose]);

  if (!show) return null;

  const onOverlay = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  return (
    <div ref={overlayRef} onMouseDown={onOverlay} className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="w-full max-w-6xl h-full bg-slate-950 text-white rounded-3xl border border-white/5 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-white/5">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white" aria-label="Cerrar">&times;</button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
}
