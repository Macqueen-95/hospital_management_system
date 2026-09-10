const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Icon size={32} className="text-slate-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-slate-800 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-6 max-w-md">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
