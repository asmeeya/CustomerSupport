import React, { useState } from 'react';
import { X, Ticket, Clock, CheckCircle2, User, Mail, ShieldAlert, ArrowUpRight, Send } from 'lucide-react';
import { EscalationTicket } from '../types';

interface TicketQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: EscalationTicket[];
  onCreateManualTicket: (ticket: Partial<EscalationTicket>) => void;
}

export const TicketQueueModal: React.FC<TicketQueueModalProps> = ({
  isOpen,
  onClose,
  tickets,
  onCreateManualTicket,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'Orders & Shipping' | 'Returns & Refunds' | 'Technical Troubleshooting' | 'Account Security' | 'General Support'>('Technical Troubleshooting');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('High');
  const [summary, setSummary] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary || !email) return;
    onCreateManualTicket({
      customerName: name || 'Customer',
      customerEmail: email,
      category,
      priority,
      summary,
      attemptedSolutions: ['Self-service escalated directly by customer']
    });
    setName('');
    setEmail('');
    setSummary('');
    setShowCreateForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-xl flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Human Escalation Queue</h2>
              <p className="text-xs text-slate-500">Live escalated support tickets routed to human specialists</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="text-xs font-semibold px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {showCreateForm ? 'View Tickets' : '+ Request Escalation'}
            </button>
            <button
              id="close-ticket-modal"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {showCreateForm ? (
            <form onSubmit={handleSubmit} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                Direct Human Support Request
              </h3>
              <p className="text-xs text-slate-500">
                If automated troubleshooting did not resolve your issue, our Tier-2 specialists will assist you immediately.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah@example.com"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Technical Troubleshooting">Technical Troubleshooting</option>
                    <option value="Returns & Refunds">Returns & Refunds</option>
                    <option value="Orders & Shipping">Orders & Shipping</option>
                    <option value="Account Security">Account Security</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low (General question)</option>
                    <option value="Medium">Medium (Standard inquiry)</option>
                    <option value="High">High (Hardware/shipment issue)</option>
                    <option value="Urgent">Urgent (Damaged freight / Lockout)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Issue Summary & Diagnostic Details *</label>
                <textarea
                  required
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Describe what occurred, order number, and what troubleshooting you already tried..."
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Submit to Queue
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {tickets.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No active escalation tickets. Issues are being resolved by the AI support assistant.
                </div>
              ) : (
                tickets.map((t) => (
                  <div
                    key={t.ticketId}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                          {t.ticketId}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          t.priority === 'Urgent' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : t.priority === 'High'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {t.priority} Priority
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Est. wait ~{t.estimatedWaitMinutes} mins</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-900 mb-2">
                      {t.summary}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2">
                      <div className="flex items-center gap-1 truncate">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-medium truncate">{t.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{t.customerEmail}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Department:</span> {t.assignedTeam}
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>{' '}
                        <span className="text-blue-600 font-semibold">{t.status}</span>
                      </div>
                    </div>

                    {t.attemptedSolutions && t.attemptedSolutions.length > 0 && (
                      <div className="text-[11px] text-slate-500">
                        <span className="font-medium text-slate-700">Attempted before escalation:</span>{' '}
                        {t.attemptedSolutions.join(', ')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center">
          Escalation tickets receive highest priority queue routing when automated solutions are insufficient.
        </div>
      </div>
    </div>
  );
};
