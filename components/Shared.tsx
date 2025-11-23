
import React from 'react';
import { X } from 'lucide-react';

export const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center";
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)] border border-cyan-500",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]",
    gold: "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-500",
    ghost: "bg-transparent hover:bg-white/5 text-cyan-400",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', onClick }: any) => (
  <div onClick={onClick} className={`bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-xl ${className}`}>
    {children}
  </div>
);

export const Badge = ({ children, color = 'bg-slate-700' }: any) => (
  <span className={`${color} text-white text-[10px] px-2 py-0.5 rounded border border-white/10 uppercase tracking-wide font-bold shadow-sm`}>
    {children}
  </span>
);

export const ProgressBar = ({ current, max, color = 'bg-cyan-500' }: any) => {
  const percent = Math.min(100, Math.max(0, (current / max) * 100));
  return (
    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
      <div className={`h-full ${color} transition-all duration-500 shadow-[0_0_10px_currentColor]`} style={{ width: `${percent}%` }}></div>
    </div>
  );
};

export const Tabs = ({ tabs, activeTab, onTabChange }: any) => {
    return (
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {tabs.map((tab: any) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === tab.id ? 'bg-slate-800 text-cyan-400 shadow-md border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}

export const Modal = ({ isOpen, onClose, title, children }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
             <div className="w-full max-w-lg bg-slate-950 border border-cyan-900 rounded-2xl shadow-[0_0_50px_rgba(8,145,178,0.15)] flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-2xl">
                    <h3 className="text-lg font-bold text-white uppercase tracking-widest">{title}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                </div>
                <div className="p-4 overflow-y-auto flex-1 no-scrollbar">
                    {children}
                </div>
             </div>
        </div>
    )
}

export const Input = ({ value, onChange, placeholder, icon }: any) => (
    <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
        </div>
        <input 
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
        />
    </div>
);

export const RarityBorder = ({rarity, className = '', children}: any) => {
    const colors: any = {
        'Common': 'border-slate-600',
        'Uncommon': 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
        'Rare': 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
        'Legendary': 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-pulse-border'
    };
    return (
        <div className={`border-2 rounded-xl overflow-hidden ${colors[rarity] || colors['Common']} ${className}`}>
            {children}
        </div>
    )
}
