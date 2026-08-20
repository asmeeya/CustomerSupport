import React from 'react';
import { 
  Headphones, 
  ShieldCheck, 
  BookOpen, 
  Package, 
  Ticket, 
  Wrench,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onOpenPolicies: () => void;
  onOpenOrders: () => void;
  onOpenTickets: () => void;
  onOpenTroubleshooting: () => void;
  openTicketCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPolicies,
  onOpenOrders,
  onOpenTickets,
  onOpenTroubleshooting,
  openTicketCount
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-slate-900 leading-tight">ApexCare Support</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Live AI Assistant
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                Verified store policies • Strict data grounding
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              id="header-orders-btn"
              onClick={onOpenOrders}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="View sample customer orders and track shipments"
            >
              <Package className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Orders Database</span>
            </button>

            <button
              id="header-troubleshoot-btn"
              onClick={onOpenTroubleshooting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Step-by-step diagnostic workflows"
            >
              <Wrench className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Diagnostics</span>
            </button>

            <button
              id="header-policies-btn"
              onClick={onOpenPolicies}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Store return, refund, and warranty policy"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Policy Base</span>
            </button>

            <button
              id="header-tickets-btn"
              onClick={onOpenTickets}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              title="Escalated Human Support Tickets"
            >
              <Ticket className="w-3.5 h-3.5 text-blue-600" />
              <span>Escalations</span>
              {openTicketCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  {openTicketCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
