/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QuickPromptBar } from './components/QuickPromptBar';
import { CustomerContextSelector } from './components/CustomerContextSelector';
import { ChatInterface } from './components/ChatInterface';
import { OrderLookupModal } from './components/OrderLookupModal';
import { PolicyKnowledgeModal } from './components/PolicyKnowledgeModal';
import { TicketQueueModal } from './components/TicketQueueModal';
import { TroubleshootingDirectoryModal } from './components/TroubleshootingDirectoryModal';
import { STORE_POLICIES, MOCK_ORDERS, TROUBLESHOOTING_GUIDES, INITIAL_ESCALATION_TICKETS } from './data/supportData';
import { SupportMessage, CustomerOrder, PolicySection, TroubleshootingGuide, EscalationTicket } from './types';

export default function App() {
  const [orders, setOrders] = useState<CustomerOrder[]>(MOCK_ORDERS);
  const [policies, setPolicies] = useState<PolicySection[]>(STORE_POLICIES);
  const [tickets, setTickets] = useState<EscalationTicket[]>(INITIAL_ESCALATION_TICKETS);
  const [guides] = useState<TroubleshootingGuide[]>(TROUBLESHOOTING_GUIDES);

  // Active customer persona context (optional)
  const [currentCustomer, setCurrentCustomer] = useState<{
    name: string;
    email: string;
    recentOrder: string;
  } | null>(null);

  // Modals state
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isPoliciesModalOpen, setIsPoliciesModalOpen] = useState(false);
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
  const [isTroubleshootModalOpen, setIsTroubleshootModalOpen] = useState(false);

  // Chat state
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I am your **ApexStore Customer Support Assistant**.\n\nI am here to help you resolve any questions regarding:\n- 📦 **Orders & Shipping**: Real-time tracking and delivery schedules\n- 🔄 **Returns & Refunds**: Official 30-day policy and return eligibility\n- 🛠️ **Step-by-Step Diagnostics**: Bluetooth, 4K monitors, standing desks, and accounts\n- 🛡️ **Warranty & Service**: 1-Year hardware coverage & repairs\n- 👩‍💼 **Human Escalation**: Seamless handoff to our specialist team when an issue is complex or unresolved\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuickReplies: [
        'Where is my order #ORD-8921?',
        'How do returns and refunds work?',
        'Troubleshoot headphone Bluetooth',
        'Request human support'
      ]
    }
  ]);

  // Load live orders and tickets from API if available
  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setOrders(data); })
      .catch(() => {});

    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setTickets(data); })
      .catch(() => {});
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMsg: SupportMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          currentContext: currentCustomer ? {
            customerName: currentCustomer.name,
            customerEmail: currentCustomer.email,
            recentOrder: currentCustomer.recentOrder
          } : null
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: SupportMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I have received your inquiry. How else can I assist you?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCall: data.toolCall,
        troubleshootingSteps: data.troubleshootingSteps,
        escalationTicket: data.escalationTicket,
        suggestedQuickReplies: data.suggestedQuickReplies || []
      };

      // If an escalation ticket was created by the assistant, update local tickets list
      if (data.escalationTicket) {
        setTickets(prev => [data.escalationTicket, ...prev.filter(t => t.ticketId !== data.escalationTicket.ticketId)]);
      }

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Fallback assistant response
      const fallbackMsg: SupportMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: `I apologize, but I encountered a temporary connection issue. Please feel free to retry or browse our [Orders Database] and [Policy Base] above.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuickReplies: ['Try again', 'Check Return Policy', 'View Orders Database', 'Escalate to Specialist']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateManualTicket = async (ticketData: Partial<EscalationTicket>) => {
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
      if (res.ok) {
        const created: EscalationTicket = await res.json();
        setTickets(prev => [created, ...prev]);

        // Add a message into the chat confirming ticket creation
        const confirmMsg: SupportMessage = {
          id: `asst-ticket-${Date.now()}`,
          sender: 'assistant',
          text: `I have generated priority escalation ticket **#${created.ticketId}** for you and alerted our **${created.assignedTeam}**.\n\nA confirmation has been routed to **${created.customerEmail}**. Estimated wait time is ~${created.estimatedWaitMinutes} minutes.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          escalationTicket: created,
          suggestedQuickReplies: ['View Escalations Queue', 'Ask another question', 'Track order status']
        };
        setMessages(prev => [...prev, confirmMsg]);
      }
    } catch (err) {
      console.error('Failed to create ticket', err);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Conversation restarted. How can I assist you with your orders, products, returns, or technical support today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuickReplies: [
          'Track #ORD-8921',
          'Check return eligibility',
          'Troubleshoot a device',
          'Contact Human Support'
        ]
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans antialiased text-slate-900">
      {/* Header */}
      <Header
        onOpenPolicies={() => setIsPoliciesModalOpen(true)}
        onOpenOrders={() => setIsOrdersModalOpen(true)}
        onOpenTickets={() => setIsTicketsModalOpen(true)}
        onOpenTroubleshooting={() => setIsTroubleshootModalOpen(true)}
        openTicketCount={tickets.length}
      />

      {/* Customer Context Switcher */}
      <CustomerContextSelector
        currentCustomerEmail={currentCustomer?.email || ''}
        onSelectCustomer={setCurrentCustomer}
      />

      {/* Quick Prompts Bar */}
      <QuickPromptBar
        onSelectPrompt={handleSendMessage}
        disabled={isLoading}
      />

      {/* Main Chat Interface */}
      <main className="flex-1 px-3 sm:px-6 lg:px-8 flex flex-col justify-center">
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onSelectActionPrompt={handleSendMessage}
          onDirectEscalate={() => setIsTicketsModalOpen(true)}
          onClearChat={handleClearChat}
        />
      </main>

      {/* Modals */}
      <OrderLookupModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        orders={orders}
        onSelectOrderQuery={handleSendMessage}
      />

      <PolicyKnowledgeModal
        isOpen={isPoliciesModalOpen}
        onClose={() => setIsPoliciesModalOpen(false)}
        policies={policies}
        onAskPolicyQuestion={handleSendMessage}
      />

      <TicketQueueModal
        isOpen={isTicketsModalOpen}
        onClose={() => setIsTicketsModalOpen(false)}
        tickets={tickets}
        onCreateManualTicket={handleCreateManualTicket}
      />

      <TroubleshootingDirectoryModal
        isOpen={isTroubleshootModalOpen}
        onClose={() => setIsTroubleshootModalOpen(false)}
        guides={guides}
        onStartDiagnostic={handleSendMessage}
      />
    </div>
  );
}
