import React, { useEffect } from 'react';
import { CheckCircleIcon, CloseIcon } from './Icons';
import { Toast as ToastType } from '../App'; // Import full type from App

interface ToastNotificationProps extends ToastType {
  onClose: (id: string) => void;
}

const ICONS: Record<ToastType['type'], React.ReactNode> = {
    success: <CheckCircleIcon className="h-6 w-6 text-green-400" />,
    error: <CloseIcon className="h-6 w-6 text-red-400" />, // Using close icon as a stand-in for error
    info: <CheckCircleIcon className="h-6 w-6 text-blue-400" />, // Using check icon as a stand-in for info
};

const BG_COLORS: Record<ToastType['type'], string> = {
    success: 'bg-white dark:bg-[#2f3136] border-green-500/30',
    error: 'bg-white dark:bg-[#2f3136] border-red-500/30',
    info: 'bg-white dark:bg-[#2f3136] border-blue-500/30',
};

const ToastNotification: React.FC<ToastNotificationProps> = ({ id, message, type, actions, onClose }) => {
  useEffect(() => {
    // Auto-close only if there are no actions that require user input
    if (!actions || actions.length === 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [id, actions, onClose]);

  return (
    <div className={`flex items-start p-4 rounded-lg shadow-lg border w-full max-w-sm ${BG_COLORS[type]}`}>
      <div className="flex-shrink-0 pt-0.5">
        {ICONS[type]}
      </div>
      <div className="ml-3 w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
        {actions && actions.length > 0 && (
            <div className="mt-3 flex space-x-3">
            {actions.map((action, index) => {
              const isPrimary = action.style === 'primary';
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    isPrimary
                      ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 focus:ring-gray-500'
                  }`}
                >
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          onClick={() => onClose(id)}
          className="inline-flex rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Close notification"
        >
          <span className="sr-only">Close</span>
          <CloseIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
