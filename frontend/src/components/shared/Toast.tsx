/**
 * Toast Notification Component
 * 
 * Minimal, elegant notifications that don't interrupt workflow.
 * Aesthetic: Subtle slide-in with smooth animations
 */

import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Toast configuration by type
const toastConfig: Record<ToastType, { 
  icon: typeof CheckCircle2; 
  className: string;
  iconClassName: string;
}> = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-500/30 bg-emerald-500/10',
    iconClassName: 'text-emerald-500',
  },
  error: {
    icon: XCircle,
    className: 'border-red-500/30 bg-red-500/10',
    iconClassName: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-amber-500/30 bg-amber-500/10',
    iconClassName: 'text-amber-500',
  },
  info: {
    icon: Info,
    className: 'border-primary/30 bg-primary/10',
    iconClassName: 'text-primary',
  },
};

// Individual toast component
function ToastItem({ toast, onRemove }: { toast: ToastData; onRemove: () => void }) {
  const config = toastConfig[toast.type];
  const Icon = config.icon;
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  
  // Animate in
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);
  
  // Auto-dismiss
  useEffect(() => {
    const duration = toast.duration ?? 4000;
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onRemove, 200);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [toast.duration, onRemove]);
  
  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(onRemove, 200);
  };
  
  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm',
        'transition-all duration-200 ease-out',
        config.className,
        isVisible && !isLeaving ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      )}
    >
      <div className={cn('flex-shrink-0 mt-0.5', config.iconClassName)}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground">{toast.title}</h4>
        {toast.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {toast.description}
          </p>
        )}
      </div>
      
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Toast container component
function ToastContainer({ toasts, removeToast }: { toasts: ToastData[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Provider component
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  
  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);
  
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  const { addToast } = context;
  
  return {
    success: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'success', title, description, duration }),
    error: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'error', title, description, duration }),
    warning: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'warning', title, description, duration }),
    info: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'info', title, description, duration }),
  };
}
