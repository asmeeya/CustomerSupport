import React from 'react';
import { Package, RefreshCcw, Wrench, Lock, Headphones, Sparkles } from 'lucide-react';

interface QuickPromptBarProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const QuickPromptBar: React.FC<QuickPromptBarProps> = ({ onSelectPrompt, disabled }) => {
  const prompts = [
    {
      icon: <Package className="w-3.5 h-3.5 text-blue-600" />,
      label: 'Track #ORD-8921',
      query: 'Where is my order #ORD-8921 and what is the delivery date?'
    },
    {
      icon: <RefreshCcw className="w-3.5 h-3.5 text-emerald-600" />,
      label: 'Return Monitor #ORD-4412',
      query: 'I would like to check if my 4K monitor from order ORD-4412 is eligible for a return and how refunds work.'
    },
    {
      icon: <Wrench className="w-3.5 h-3.5 text-amber-600" />,
      label: 'Headphone Bluetooth Fix',
      query: 'My Apex SoundPulse wireless headphones won\'t connect to my laptop. Can you help me troubleshoot step by step?'
    },
    {
      icon: <Lock className="w-3.5 h-3.5 text-indigo-600" />,
      label: 'Account Locked / 2FA',
      query: 'My account was locked after entering the wrong password and I haven\'t received the reset email.'
    },
    {
      icon: <Headphones className="w-3.5 h-3.5 text-rose-600" />,
      label: 'Speak to Human Agent',
      query: 'My standing desk motor error E08 won\'t clear even after a reset and I need to escalate to a human specialist.'
    }
  ];

  return (
    <div className="py-2 px-3 sm:px-4 bg-slate-50/80 border-b border-slate-200/80 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 min-w-max">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-500" />
          Quick scenarios:
        </span>
        {prompts.map((p, idx) => (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onSelectPrompt(p.query)}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-full transition-all shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {p.icon}
            <span>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
