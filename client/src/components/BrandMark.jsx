import { HeartPulse } from 'lucide-react';

const BrandMark = ({ compact = false }) => (
  <div className="flex items-center gap-3">
    <div className={`${compact ? 'h-9 w-9' : 'h-11 w-11'} flex items-center justify-center rounded-xl bg-[#e3f7ef]`}>
      <HeartPulse className="text-[#13805d]" size={compact ? 19 : 23} strokeWidth={2.2} />
    </div>
    {!compact && (
      <div>
        <p className="text-lg font-extrabold tracking-tight text-[#18232c]">HMS</p>
        <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[#82928c]">Care operations</p>
      </div>
    )}
  </div>
);

export default BrandMark;
