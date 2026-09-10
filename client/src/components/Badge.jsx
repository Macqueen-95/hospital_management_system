const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    'checked in': 'bg-amber-100 text-amber-800 border-amber-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    registered: 'bg-slate-100 text-slate-800 border-slate-200',
    'appointment scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
    'consultation completed': 'bg-green-100 text-green-800 border-green-200',
  };

  const statusClass = variants[children?.toLowerCase()] || variants[variant];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass}`}>
      {children}
    </span>
  );
};

export default Badge;
