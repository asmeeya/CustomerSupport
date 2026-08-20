import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  Headphones, 
  RefreshCw, 
  FileText,
  AlertTriangle,
  CornerDownLeft
} from 'lucide-react';
import { SupportMessage, CustomerOrder, EscalationTicket } from '../types';
import { OrderCard, TroubleshootingCard, EscalationTicketCard } from './ChatCardComponents';

interface ChatInterfaceProps {
  messages: SupportMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onSelectActionPrompt: (prompt: string) => void;
  onDirectEscalate: () => void;
  onClearChat: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onSelectActionPrompt,
  onDirectEscalate,
  onClearChat,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden my-4">
      {/* Top Chat Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-slate-800">ApexCare Live Concierge</span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">• Powered by Gemini 3.7 Flash</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDirectEscalate}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            title="Escalate to Human Specialist"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Human Escalation</span>
          </button>

          <button
            onClick={onClearChat}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
            title="Clear Chat History"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
        {messages.map((message) => {
          const isAssistant = message.sender === 'assistant';
          const isUser = message.sender === 'user';

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-2xs ${
                  isAssistant ? 'bg-blue-600 ring-2 ring-blue-100' : 'bg-slate-800'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  {/* Markdown Renderer */}
                  <div className="space-y-2 prose prose-slate prose-sm max-w-none">
                    <Markdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-2">{children}</ol>,
                        li: ({ children }) => <li className="leading-snug">{children}</li>,
                        strong: ({ children }) => <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>,
                        code: ({ children }) => (
                          <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold text-blue-700 dark:text-blue-300">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {message.text}
                    </Markdown>
                  </div>

                  {/* Attached Tool / Order Card */}
                  {message.toolCall?.name === 'lookup_order' && message.toolCall.result?.success && (
                    <OrderCard
                      order={message.toolCall.result.order as CustomerOrder}
                      onSelectAction={onSelectActionPrompt}
                    />
                  )}

                  {/* Attached Troubleshooting Steps Checklist */}
                  {message.troubleshootingSteps && (
                    <TroubleshootingCard
                      title={message.troubleshootingSteps.title}
                      steps={message.troubleshootingSteps.steps}
                      onEscalate={onDirectEscalate}
                    />
                  )}

                  {/* Attached Escalation Ticket Card */}
                  {message.escalationTicket && (
                    <EscalationTicketCard ticket={message.escalationTicket} />
                  )}
                </div>

                {/* Suggested Quick Replies for Assistant */}
                {isAssistant && message.suggestedQuickReplies && message.suggestedQuickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {message.suggestedQuickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectActionPrompt(reply)}
                        className="text-[11px] font-medium bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 px-2.5 py-1 rounded-full transition-all shadow-2xs"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div className={`text-[10px] text-slate-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 shadow-2xs flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Verifying order records & analyzing policies...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about orders (e.g. ORD-8921), returns, warranties, technical troubleshooting, or human escalation..."
            className="w-full pl-3 pr-24 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder-slate-400 resize-none"
          />

          <div className="absolute right-2.5 bottom-3.5 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              id="send-message-btn"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-2xs transition-all"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Strict grounding: Never fabricates status, dates, or refunds.
          </span>
          <span className="hidden sm:inline">Press <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">Enter</kbd> to send, <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">Shift+Enter</kbd> for newline</span>
        </div>
      </div>
    </div>
  );
};
