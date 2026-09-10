const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-[#eef3f0] text-[#53636c] border-[#dce6e1]',
    scheduled: 'bg-[#e7f0ff] text-[#315e9f] border-[#cfe0ff]',
    'checked in': 'bg-[#fff2d8] text-[#9b6814] border-[#f4dfae]',
    completed: 'bg-[#e3f7ef] text-[#13805d] border-[#bce7d5]',
    cancelled: 'bg-[#ffebe7] text-[#b64c3c] border-[#f4c9c1]',
    registered: 'bg-[#eef3f0] text-[#53636c] border-[#dce6e1]',
    'appointment scheduled': 'bg-[#e7f0ff] text-[#315e9f] border-[#cfe0ff]',
    'consultation completed': 'bg-[#e3f7ef] text-[#13805d] border-[#bce7d5]',
  };

  const statusClass = variants[children?.toLowerCase()] || variants[variant];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-bold tracking-wide border ${statusClass}`}>
      {children}
    </span>
  );
};

export default Badge;
