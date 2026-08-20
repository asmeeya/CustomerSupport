export interface SupportMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  toolCall?: {
    name: string;
    args: Record<string, any>;
    result?: Record<string, any>;
  };
  troubleshootingSteps?: {
    title: string;
    steps: { stepNumber: number; title: string; instruction: string; completed?: boolean }[];
  };
  escalationTicket?: EscalationTicket;
  suggestedQuickReplies?: string[];
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  item: string;
  productSku: string;
  itemImage?: string;
  placedDate: string;
  deliveryDate?: string;
  status: 'Processing' | 'Shipped' | 'In Transit' | 'Delivered' | 'Cancelled';
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  total: number;
  returnEligible: boolean;
  returnExpiryDate?: string;
  warrantyValidUntil: string;
}

export interface PolicySection {
  id: string;
  title: string;
  category: 'Returns & Refunds' | 'Shipping & Delivery' | 'Warranty & Repairs' | 'Account & Security' | 'Payments & Billing';
  summary: string;
  details: string[];
  keyRules: string[];
}

export interface EscalationTicket {
  ticketId: string;
  customerName: string;
  customerEmail: string;
  category: 'Orders & Shipping' | 'Returns & Refunds' | 'Technical Troubleshooting' | 'Account Security' | 'General Support';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  summary: string;
  attemptedSolutions: string[];
  status: 'Open' | 'Assigned' | 'Resolved';
  createdAt: string;
  estimatedWaitMinutes: number;
  assignedTeam: string;
}

export interface TroubleshootingGuide {
  productIdOrIssue: string;
  productName: string;
  category: string;
  commonSymptom: string;
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    tip?: string;
  }[];
}
