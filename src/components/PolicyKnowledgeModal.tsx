import React, { useState } from 'react';
import { X, BookOpen, ShieldAlert, Check, HelpCircle, ArrowRight } from 'lucide-react';
import { PolicySection } from '../types';

interface PolicyKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  policies: PolicySection[];
  onAskPolicyQuestion: (question: string) => void;
}

export const PolicyKnowledgeModal: React.FC<PolicyKnowledgeModalProps> = ({
  isOpen,
  onClose,
  policies,
  onAskPolicyQuestion,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Returns & Refunds', 'Shipping & Delivery', 'Warranty & Repairs', 'Account & Security', 'Payments & Billing'];

  const filtered = selectedCategory === 'All' 
    ? policies 
    : policies.filter(p => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-xl flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">ApexStore Verified Policy Base</h2>
              <p className="text-xs text-slate-500">Official return windows, warranties, shipping SLAs, and security standards</p>
            </div>
          </div>
          <button
            id="close-policy-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 bg-white flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
          {filtered.map((policy) => (
            <div
              key={policy.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    {policy.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{policy.title}</h3>
                </div>
                <button
                  onClick={() => {
                    onAskPolicyQuestion(`What are the exact rules for ${policy.title}?`);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Ask Assistant <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {policy.summary}
              </p>

              {/* Key Rules Pills */}
              <div className="flex flex-wrap gap-1.5">
                {policy.keyRules.map((rule, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    {rule}
                  </span>
                ))}
              </div>

              {/* Bullet Details */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Detailed Provisions:</span>
                <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                  {policy.details.map((detail, idx) => (
                    <li key={idx} className="leading-normal">{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>The assistant strictly adheres to these rules and will not fabricate conflicting refund timelines.</span>
        </div>
      </div>
    </div>
  );
};
