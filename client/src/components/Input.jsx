const Input = ({ 
  label, 
  error, 
  required = false,
  type = 'text',
  className = '',
  ...props 
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#53636c] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-4 py-3 border rounded-xl text-sm bg-[#fbfdfb] text-[#18232c]
          placeholder:text-[#9aa9a3] focus:outline-none focus:ring-2 focus:ring-[#20b486]/30 focus:border-[#20b486]
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-[#d4e1db]'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-[#cf5744]">{error}</p>
      )}
    </div>
  );
};

export default Input;
