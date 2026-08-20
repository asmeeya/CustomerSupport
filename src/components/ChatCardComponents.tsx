import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Ticket, 
  ShieldCheck, 
  ArrowRight,
  Circle,
  HelpCircle,
  Headphones
} from 'lucide-react';
import { CustomerOrder, EscalationTicket } from '../types';

interface OrderCardProps {
  order: CustomerOrder;
  onSelectAction: (prompt: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onSelectAction }) => {
  return (
    <div className="my-2 p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 text-slate-800 text-xs shadow-2xs space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{order.itemImage || '📦'}</span>
          <div>
            <span className="font-bold text-slate-900 block">{order.id}</span>
            <span className="text-[11px] text-slate-500">{order.item}</span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
          order.status === 'Delivered' 
            ? 'bg-emerald-100 text-emerald-800' 
            : order.status === 'In Transit'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-amber-100 text-amber-800'
        }`}>
          {order.status === 'In Transit' && <Truck className="w-3 h-3 mr-1" />}
          {order.status === 'Delivered' && <CheckCircle2 className="w-3 h-3 mr-1" />}
          {order.status === 'Processing' && <Clock className="w-3 h-3 mr-1" />}
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 py-2 border-y border-blue-100 text-[11px]">
        <div>
          <span className="text-slate-400 block text-[10px]">Carrier / Tracking:</span>
          <span className="font-medium text-slate-700">{order.carrier || 'Processing'}</span>
          {order.trackingNumber && <span className="block font-mono text-[10px] text-blue-600">{order.trackingNumber}</span>}
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Estimated Arrival:</span>
          <span className="font-medium text-slate-700">{order.estimatedDelivery || 'In 3-5 days'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="text-[11px]">
          <span className="text-slate-400">Return Window: </span>
          <span className={`font-semibold ${order.returnEligible ? 'text-emerald-700' : 'text-slate-500'}`}>
            {order.returnEligible ? 'Eligible (30 Days)' : 'Expired'}
          </span>
        </div>

        <button
          onClick={() => onSelectAction(`Can you guide me on returns or warranty for order ${order.id}?`)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          Check Options <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

interface TroubleshootingCardProps {
  title: string;
  steps: { stepNumber: number; title: string; instruction: string; tip?: string }[];
  onEscalate: () => void;
}

export const TroubleshootingCard: React.FC<TroubleshootingCardProps> = ({
  title,
  steps,
  onEscalate
}) => {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const toggle = (num: number) => {
    setCompleted(prev => ({ ...prev, [num]: !prev[num] }));
  };

  const allDone = steps.length > 0 && steps.every(s => completed[s.stepNumber]);

  return (
    <div className="my-2.5 p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 text-slate-800 text-xs shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          {title}
        </h4>
        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
          Interactive Checklist
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((step) => {
          const isDone = !!completed[step.stepNumber];
          return (
            <div
              key={step.stepNumber}
              onClick={() => toggle(step.stepNumber)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                isDone ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-amber-100 hover:border-amber-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`font-bold text-[11px] ${isDone ? 'text-emerald-900 line-through' : 'text-slate-800'}`}>
                    Step {step.stepNumber}: {step.title}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {step.instruction}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-amber-200/60">
        <span className="text-[11px] text-slate-500">
          Did these steps solve the issue?
        </span>
        <button
          onClick={onEscalate}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-md transition-colors"
        >
          <Headphones className="w-3 h-3" /> Still unresolved? Escalate
        </button>
      </div>
    </div>
  );
};

interface EscalationTicketCardProps {
  ticket: EscalationTicket;
}

export const EscalationTicketCard: React.FC<EscalationTicketCardProps> = ({ ticket }) => {
  return (
    <div className="my-2.5 p-4 rounded-xl border border-rose-200 bg-rose-50/50 text-slate-800 text-xs shadow-2xs space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-900 text-xs">{ticket.ticketId}</span>
              <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded">
                {ticket.priority} Priority
              </span>
            </div>
            <span className="text-[11px] text-slate-500">Assigned: {ticket.assignedTeam}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
            <Clock className="w-3 h-3" /> ~{ticket.estimatedWaitMinutes}m wait
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-rose-100">
        <strong>Case Summary:</strong> {ticket.summary}
      </p>

      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
        <span>Email notification: <strong className="text-slate-700">{ticket.customerEmail}</strong></span>
        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
          <CheckCircle2 className="w-3 h-3" /> Escalation Dispatched
        </span>
      </div>
    </div>
  );
};
