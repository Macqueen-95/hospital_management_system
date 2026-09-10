import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

const Alert = ({ type = 'info', children, onClose }) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
    },
  };

  const style = types[type];
  const Icon = style.icon;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${style.bg} ${style.border}`}>
      <Icon size={20} className={style.text} />
      <div className={`flex-1 text-sm ${style.text}`}>
        {children}
      </div>
      {onClose && (
        <button onClick={onClose} className={`${style.text} hover:opacity-70`}>
          <XCircle size={20} />
        </button>
      )}
    </div>
  );
};

export default Alert;
