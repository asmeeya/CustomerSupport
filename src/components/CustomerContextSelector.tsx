import React from 'react';
import { User, ShieldCheck, Check } from 'lucide-react';
import { MOCK_ORDERS } from '../data/supportData';

interface CustomerContextSelectorProps {
  currentCustomerEmail: string;
  onSelectCustomer: (customer: { name: string; email: string; recentOrder: string } | null) => void;
}

export const CustomerContextSelector: React.FC<CustomerContextSelectorProps> = ({
  currentCustomerEmail,
  onSelectCustomer,
}) => {
  const personas = [
    {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      order: 'ORD-8921',
      item: '🎧 Headphones (In Transit)',
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      order: 'ORD-4412',
      item: '🖥️ 4K Monitor (Return Window Open)',
    },
    {
      name: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      order: 'ORD-1029',
      item: '⌨️ Keyboard (30d Return Expired, Warranty Active)',
    },
    {
      name: 'David Kim',
      email: 'david.kim@example.com',
      order: 'ORD-7730',
      item: '🪵 Standing Desk (Processing)',
    }
  ];

  const activePersona = personas.find(p => p.email === currentCustomerEmail);

  return (
    <div className="bg-slate-100/80 px-3 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2">
        <User className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-slate-600 font-medium">Testing as Customer:</span>
        <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
          {activePersona ? `${activePersona.name} (${activePersona.order})` : 'Guest / Unauthenticated'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-slate-400">Switch profile:</span>
        {personas.map((p) => {
          const isSelected = p.email === currentCustomerEmail;
          return (
            <button
              key={p.email}
              onClick={() => onSelectCustomer(isSelected ? null : { name: p.name, email: p.email, recentOrder: p.order })}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                isSelected 
                  ? 'bg-blue-600 text-white font-bold' 
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {p.name.split(' ')[0]} ({p.order})
            </button>
          );
        })}
        {activePersona && (
          <button
            onClick={() => onSelectCustomer(null)}
            className="text-[10px] text-slate-500 hover:text-slate-700 underline ml-1"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
