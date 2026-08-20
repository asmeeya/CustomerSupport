import React, { useState } from 'react';
import { X, Search, Package, CheckCircle2, Clock, Truck, AlertCircle, ArrowRight } from 'lucide-react';
import { CustomerOrder } from '../types';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CustomerOrder[];
  onSelectOrderQuery: (prompt: string) => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrderQuery,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-xl flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Verified Customer Orders Database</h2>
              <p className="text-xs text-slate-500">Live order records, delivery statuses, and return eligibility</p>
            </div>
          </div>
          <button
            id="close-orders-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="order-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID (ORD-8921), Customer Email, or Item..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Order Cards List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No verified orders match your search query.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-white transition-all shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{order.itemImage || '📦'}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{order.id}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : order.status === 'In Transit'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {order.status === 'In Transit' && <Truck className="w-3 h-3 mr-1" />}
                          {order.status === 'Delivered' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {order.status === 'Processing' && <Clock className="w-3 h-3 mr-1" />}
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{order.item}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">${order.total.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-2 py-2 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Customer</span>
                    <span className="text-slate-700 font-medium">{order.customerName}</span>
                    <span className="text-slate-500 block text-[10px] truncate">{order.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tracking / Carrier</span>
                    <span className="text-slate-700 font-medium">{order.carrier || 'Pending Dispatch'}</span>
                    {order.trackingNumber && (
                      <span className="text-slate-500 block text-[10px] font-mono">{order.trackingNumber}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Return Status</span>
                    {order.returnEligible ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {order.returnExpiryDate || 'Within 30 Days'}
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        Return window ended
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Assistant Prompts */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      onSelectOrderQuery(`Where is my order ${order.id}? Can you check the shipping status?`);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Track Status <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectOrderQuery(`I'd like to check return or refund eligibility for order ${order.id}`);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Check Return
                  </button>

                  <button
                    onClick={() => {
                      onSelectOrderQuery(`I need technical help with my ${order.item} from order ${order.id}`);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Troubleshoot Item
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center">
          The assistant references this exact database to verify order numbers without hallucinating statuses.
        </div>
      </div>
    </div>
  );
};
