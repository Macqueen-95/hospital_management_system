const Card = ({ children, className = '', title, subtitle, action }) => {
  return (
    <div className={`bg-white rounded-2xl border border-[#dce6e1] shadow-[0_12px_35px_rgba(24,35,44,0.05)] ${className}`}>
      {(title || subtitle || action) && (
        <div className="px-6 py-5 border-b border-[#e7efeb] flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-bold tracking-[-0.02em] text-[#18232c]">{title}</h3>}
            {subtitle && <p className="text-sm text-[#6b7b83] mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
