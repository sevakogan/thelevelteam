import { useEffect, useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

/**
 * Hook for managing notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const add = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const fullNotification: Notification = {
        ...notification,
        id,
        duration: notification.duration || 5000,
      };

      setNotifications((prev) => [...prev, fullNotification]);

      if (fullNotification.duration) {
        setTimeout(() => {
          remove(id);
        }, fullNotification.duration);
      }

      return id;
    },
    [remove]
  );

  const success = useCallback(
    (message: string, duration?: number) => {
      return add({ type: 'success', message, duration });
    },
    [add]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      return add({ type: 'error', message, duration });
    },
    [add]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      return add({ type: 'info', message, duration });
    },
    [add]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      return add({ type: 'warning', message, duration });
    },
    [add]
  );

  return {
    notifications,
    add,
    remove,
    success,
    error,
    info,
    warning,
  };
}

/**
 * Component for displaying notifications
 */
export function NotificationContainer({
  notifications,
  onRemove,
  position = 'top-right',
}: {
  notifications: Notification[];
  onRemove: (id: string) => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}): React.ReactNode {
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: '16px', left: '16px' },
    'top-right': { top: '16px', right: '16px' },
    'bottom-left': { bottom: '16px', left: '16px' },
    'bottom-right': { bottom: '16px', right: '16px' },
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' };
      case 'error':
        return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
      case 'warning':
        return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' };
      case 'info':
      default:
        return { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 9999,
        maxWidth: '400px',
      }}
    >
      {notifications.map((notification) => {
        const colors = getColors(notification.type);
        return (
          <div
            key={notification.id}
            style={{
              marginBottom: '12px',
              padding: '12px 16px',
              backgroundColor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => onRemove(notification.id)}
              style={{
                marginLeft: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: colors.text,
                fontSize: '18px',
                padding: '0',
              }}
            >
              ×
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(${position.includes('right') ? '100%' : '-100%'});
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
