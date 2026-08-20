import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import dotenv from "dotenv";
import { STORE_POLICIES, MOCK_ORDERS, TROUBLESHOOTING_GUIDES, INITIAL_ESCALATION_TICKETS } from "./src/data/supportData.js";
import { EscalationTicket, CustomerOrder } from "./src/types.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory tickets store
let ticketsStore: EscalationTicket[] = [...INITIAL_ESCALATION_TICKETS];
let ordersStore: CustomerOrder[] = [...MOCK_ORDERS];

// Initialize Gemini SDK with User-Agent header
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Function Declarations for Gemini Tool Calling
const lookupOrderDeclaration: FunctionDeclaration = {
  name: "lookup_order",
  description: "Lookup a customer order by order ID (e.g., ORD-8921) or customer email address to retrieve real tracking status, items, delivery dates, and return eligibility.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      orderId: {
        type: Type.STRING,
        description: "The order identifier, e.g. ORD-8921, ORD-4412, ORD-1029, ORD-7730"
      },
      customerEmail: {
        type: Type.STRING,
        description: "The customer email address if orderId is not known"
      }
    }
  }
};

const getPolicyDeclaration: FunctionDeclaration = {
  name: "get_policy_details",
  description: "Retrieve exact verified store policies on Returns, Refunds, Shipping, Warranty, Account Security, or Payments.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      topic: {
        type: Type.STRING,
        description: "Policy category: 'returns', 'refunds', 'shipping', 'warranty', 'account_security', or 'payments'"
      }
    },
    required: ["topic"]
  }
};

const getTroubleshootingDeclaration: FunctionDeclaration = {
  name: "get_troubleshooting_guide",
  description: "Retrieve step-by-step diagnostic and troubleshooting instructions for supported products and common technical/account issues.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      issueType: {
        type: Type.STRING,
        description: "The issue type: 'bluetooth-pairing', 'monitor-no-signal', 'standing-desk-reset', 'account-locked-reset', or general device issue"
      }
    },
    required: ["issueType"]
  }
};

const createEscalationDeclaration: FunctionDeclaration = {
  name: "create_escalation_ticket",
  description: "Escalate a complex, unresolved, or high-priority customer issue to a human support specialist after attempting troubleshooting.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      customerName: {
        type: Type.STRING,
        description: "Name of the customer"
      },
      customerEmail: {
        type: Type.STRING,
        description: "Email of the customer"
      },
      category: {
        type: Type.STRING,
        description: "Category of escalation: 'Orders & Shipping', 'Returns & Refunds', 'Technical Troubleshooting', 'Account Security', or 'General Support'"
      },
      priority: {
        type: Type.STRING,
        description: "Priority level: 'Low', 'Medium', 'High', or 'Urgent'"
      },
      summary: {
        type: Type.STRING,
        description: "Concise summary of the customer's problem and why human escalation is needed"
      },
      attemptedSolutions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of troubleshooting steps or inquiries attempted prior to escalation"
      }
    },
    required: ["customerEmail", "summary"]
  }
};

// System Prompt enforcing rules
const SYSTEM_INSTRUCTION = `You are a professional, courteous, and highly capable Customer Support Assistant for ApexStore (Electronics & Lifestyle).
Your goal is to help customers resolve questions regarding products, services, orders, accounts, returns, warranties, and general technical support.

Core Operational Rules (STRICT):
1. **Polite and Concise**: Maintain an empathetic, professional, clear, and reassuring tone. Avoid fluff, unnecessary jargon, or robotic repetition.
2. **Ask Clarifying Questions**: When a customer's query lacks key details (e.g. they ask "Where is my package?" without providing an order number or email, or "My headphones aren't working" without specifying what happens), proactively ask polite clarifying questions before guessing.
3. **Never Invent Information**: NEVER fabricate policies, order statuses, delivery dates, tracking numbers, or refund amounts. Only quote verified policies from the store database or use the lookup_order tool to get real order data. If a policy or item is not in your knowledge base, clearly state so!
4. **Admit Gaps Honestly**: If you do not know the answer or cannot find a record, clearly say so (e.g. "I do not have a record for that specific order in our system; could you double-check the order number or email?").
5. **Step-by-Step Troubleshooting**: When a customer faces a technical issue (e.g. Bluetooth pairing, monitor signal, desk reset, account lockout), provide clear, numbered, step-by-step guidance.
6. **Escalation Protocol**: Always attempt to resolve the customer's problem first using troubleshooting or policy guidance. If an issue is complex, damaged goods requiring supervisor replacement, policy exception requests, account security breaches, or remains unresolved after initial troubleshooting, create an escalation ticket with create_escalation_ticket to connect the customer with a human support specialist.

Available Tools:
- \`lookup_order\`: Look up real order details by order ID or email.
- \`get_policy_details\`: Retrieve official store policies.
- \`get_troubleshooting_guide\`: Retrieve structured troubleshooting steps.
- \`create_escalation_ticket\`: Create a human support escalation ticket when needed.

Always strive to solve the customer's problem efficiently while providing an exemplary customer care experience.`;

// 1. API: Get Orders
app.get("/api/orders", (req, res) => {
  const query = (req.query.q as string || "").toLowerCase().trim();
  if (!query) {
    return res.json(ordersStore);
  }
  const filtered = ordersStore.filter(o =>
    o.id.toLowerCase().includes(query) ||
    o.customerEmail.toLowerCase().includes(query) ||
    o.customerName.toLowerCase().includes(query)
  );
  res.json(filtered);
});

// 2. API: Get Policies
app.get("/api/policies", (req, res) => {
  res.json(STORE_POLICIES);
});

// 3. API: Get / Create Escalation Tickets
app.get("/api/tickets", (req, res) => {
  res.json(ticketsStore);
});

app.post("/api/tickets", (req, res) => {
  const { customerName, customerEmail, category, priority, summary, attemptedSolutions } = req.body;
  const newTicket: EscalationTicket = {
    ticketId: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: customerName || "Valued Customer",
    customerEmail: customerEmail || "customer@example.com",
    category: category || "General Support",
    priority: priority || "Medium",
    summary: summary || "Customer requested human support assistance.",
    attemptedSolutions: attemptedSolutions || ["Automated AI troubleshooting initiated"],
    status: "Open",
    createdAt: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric' }),
    estimatedWaitMinutes: priority === 'Urgent' ? 3 : priority === 'High' ? 6 : 12,
    assignedTeam: category === 'Returns & Refunds' ? 'Tier-2 Returns & Claims' : category === 'Account Security' ? 'Security & Identity Desk' : 'Customer Happiness Team'
  };
  ticketsStore.unshift(newTicket);
  res.status(201).json(newTicket);
});

// Helper tool executor
function executeLocalTool(name: string, args: Record<string, any>) {
  if (name === "lookup_order") {
    const orderId = (args.orderId || "").toUpperCase().trim();
    const email = (args.customerEmail || "").toLowerCase().trim();
    const found = ordersStore.find(o => 
      (orderId && o.id.toUpperCase() === orderId) ||
      (email && o.customerEmail.toLowerCase() === email)
    );
    if (found) {
      return { success: true, order: found };
    } else {
      return { success: false, message: `No order found matching "${orderId || email}". Please verify the order number (e.g., ORD-8921) or customer email.` };
    }
  }

  if (name === "get_policy_details") {
    const topic = (args.topic || "").toLowerCase();
    const policy = STORE_POLICIES.find(p => 
      p.id.toLowerCase().includes(topic) || 
      p.category.toLowerCase().includes(topic) ||
      p.title.toLowerCase().includes(topic)
    ) || STORE_POLICIES[0];
    return { success: true, policy };
  }

  if (name === "get_troubleshooting_guide") {
    const issueType = (args.issueType || "").toLowerCase();
    const guide = TROUBLESHOOTING_GUIDES.find(g => 
      g.productIdOrIssue.toLowerCase().includes(issueType) ||
      g.productName.toLowerCase().includes(issueType) ||
      g.category.toLowerCase().includes(issueType)
    ) || TROUBLESHOOTING_GUIDES[0];
    return { success: true, guide };
  }

  if (name === "create_escalation_ticket") {
    const newTicket: EscalationTicket = {
      ticketId: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: args.customerName || "Valued Customer",
      customerEmail: args.customerEmail || "customer@example.com",
      category: args.category || "General Support",
      priority: args.priority || "Medium",
      summary: args.summary || "Customer issue requiring specialized human agent follow-up.",
      attemptedSolutions: args.attemptedSolutions || ["Automated troubleshooting assisted"],
      status: "Open",
      createdAt: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric' }),
      estimatedWaitMinutes: args.priority === 'Urgent' ? 3 : args.priority === 'High' ? 6 : 12,
      assignedTeam: args.category === 'Returns & Refunds' ? 'Tier-2 Returns & Claims' : 'Customer Care Specialist Desk'
    };
    ticketsStore.unshift(newTicket);
    return { success: true, ticket: newTicket };
  }

  return { success: false, message: `Unknown function ${name}` };
}

// 4. API: Chat endpoint with Gemini
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, currentContext } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing messages array" });
    }

    const ai = getGeminiClient();
    const lastUserMessage = messages[messages.length - 1]?.text || "";

    // Fallback if no Gemini API Key is configured yet in environment
    if (!ai) {
      // Intelligent rule-based engine providing grounded responses adhering to user constraints
      const lower = lastUserMessage.toLowerCase();
      let replyText = "";
      let toolData: any = null;
      let stepsData: any = null;
      let ticketData: any = null;
      let quickReplies: string[] = ["Check my order status", "How do returns work?", "Need troubleshooting help", "Speak with human support"];

      if (lower.includes("ord-") || lower.includes("order") || lower.includes("tracking") || lower.includes("track")) {
        const orderMatch = lastUserMessage.match(/ORD-\d{4}/i);
        const orderId = orderMatch ? orderMatch[0].toUpperCase() : null;
        if (orderId) {
          const lookup = executeLocalTool("lookup_order", { orderId });
          if (lookup.success && lookup.order) {
            toolData = { name: "lookup_order", args: { orderId }, result: lookup };
            replyText = `Here are the latest details for order **${lookup.order.id}**:\n\n` +
              `- **Item**: ${lookup.order.item}\n` +
              `- **Status**: **${lookup.order.status}** (${lookup.order.carrier ? lookup.order.carrier + ' - ' + lookup.order.trackingNumber : 'Processing'})\n` +
              `- **Delivery Estimate**: ${lookup.order.estimatedDelivery || 'In 3-5 business days'}\n` +
              `- **Return Window**: ${lookup.order.returnEligible ? 'Eligible for return within 30 days of delivery' : 'Return window expired'}\n\n` +
              `Is there anything specific you would like assistance with regarding this shipment?`;
            quickReplies = ["How do I start a return?", "Change shipping address", "Track carrier live", "Speak to an agent"];
          } else {
            replyText = `I searched our records for **${orderId}**, but could not find a matching order. Please check the order number on your confirmation receipt, or provide your registered account email so I can locate your purchase.`;
            quickReplies = ["Check ORD-8921", "Check ORD-4412", "Provide account email", "Contact Human Support"];
          }
        } else {
          replyText = `I would be happy to look up your order status. Could you please provide your **Order ID** (for example, \`ORD-8921\`) or the email address associated with your purchase?`;
          quickReplies = ["Order #ORD-8921", "Order #ORD-4412", "david.kim@example.com", "sarah.jenkins@example.com"];
        }
      } else if (lower.includes("return") || lower.includes("refund") || lower.includes("exchange")) {
        const policy = STORE_POLICIES[0];
        toolData = { name: "get_policy_details", args: { topic: "returns" }, result: { policy } };
        replyText = `Here is our official **Return & Refund Policy**:\n\n` +
          `• **30-Day Window**: You can return items in original condition within 30 calendar days of delivery.\n` +
          `• **Free Returns**: Defective or damaged items receive a free prepaid return label and 100% full refund.\n` +
          `• **Standard Returns**: Change of mind returns have a $5.99 return label fee deducted from the refund.\n` +
          `• **Refund Timing**: 3–5 business days to the original payment method after warehouse inspection, or instant store credit upon drop-off scan.\n\n` +
          `Do you have an Order ID you would like me to check return eligibility for?`;
        quickReplies = ["Check return for ORD-4412", "Check return for ORD-1029", "What if my item arrived broken?", "I need human support"];
      } else if (lower.includes("bluetooth") || lower.includes("pair") || lower.includes("headphone") || lower.includes("audio")) {
        const guide = TROUBLESHOOTING_GUIDES[0];
        stepsData = {
          title: "Apex SoundPulse Headphones: Bluetooth Troubleshooting",
          steps: guide.steps
        };
        replyText = `Let's troubleshoot your headphone connection step-by-step:\n\n` +
          `1. **Forced Pairing Mode**: Turn off headphones. Hold the power button for 5 seconds until the LED flashes alternating Red & Blue.\n` +
          `2. **Clear Phone Bluetooth**: Toggle Bluetooth off for 10s on your phone, then remove previous "Apex SoundPulse" devices.\n` +
          `3. **Factory Reset**: Hold Volume (+) and Volume (-) together for 8 seconds until the LED flashes purple.\n` +
          `4. **ApexConnect App**: Check for firmware updates in the ApexConnect app.\n\n` +
          `Please let me know which step you are on or if the issue persists!`;
        quickReplies = ["Step 1 worked, thanks!", "Still won't pair after reset", "Audio is lagging", "Request human support"];
      } else if (lower.includes("monitor") || lower.includes("screen") || lower.includes("no signal") || lower.includes("display")) {
        const guide = TROUBLESHOOTING_GUIDES[1];
        stepsData = {
          title: "Apex Flow 4K Monitor: No Signal Diagnostic",
          steps: guide.steps
        };
        replyText = `Here is our step-by-step diagnostic guide for display signal issues:\n\n` +
          `1. **OSD Input Source**: Press the bottom joystick and verify the input is manually set to DisplayPort or HDMI (rather than auto).\n` +
          `2. **Dedicated GPU Port**: Ensure the cable is plugged into your dedicated graphics card, not the motherboard.\n` +
          `3. **Power Cycle Discharge**: Unplug the power brick from the wall for 60 seconds and hold the power button for 15s to drain residual charge.\n\n` +
          `Did any of these steps restore the video signal?`;
        quickReplies = ["Still no signal", "Input switch fixed it!", "Screen flickers", "Open support ticket"];
      } else if (lower.includes("desk") || lower.includes("e08") || lower.includes("rst") || lower.includes("motor")) {
        const guide = TROUBLESHOOTING_GUIDES[2];
        stepsData = {
          title: "Apex ErgoDesk Standing Desk: Motor Calibration",
          steps: guide.steps
        };
        replyText = `If your ErgoDesk shows \`E08\` or \`RST\`, follow this calibration procedure:\n\n` +
          `1. **Clear Obstacles**: Verify nothing blocks the desk legs and cables are seated.\n` +
          `2. **Leveling Reset**: Press and hold the **DOWN arrow** button until the desk hits bottom and keep holding for 5–7 seconds.\n` +
          `3. **Handset Beep**: The desk will bounce slightly, beep twice, and display the height \`24.5\`.\n\n` +
          `Please test this and let me know if the handset resets properly.`;
        quickReplies = ["Desk reset successfully!", "Motor still won't lift", "Error won't clear", "Escalate to technician"];
      } else if (lower.includes("password") || lower.includes("locked") || lower.includes("login") || lower.includes("account")) {
        const guide = TROUBLESHOOTING_GUIDES[3];
        stepsData = {
          title: "Apex Account: Secure Access Recovery",
          steps: guide.steps
        };
        replyText = `Here is how to safely regain access to your Apex account:\n\n` +
          `1. **Check Spam Folders**: Password reset emails from \`security@apexstore.com\` expire after 15 minutes.\n` +
          `2. **Wait for Lockout**: If you had 5 failed attempts, the 30-minute security lock will auto-clear.\n` +
          `3. **Backup 2FA**: On the login screen, click "Try another way" to receive an SMS or email backup OTP.\n\n` +
          `Would you like me to create an identity verification ticket for our Security Desk?`;
        quickReplies = ["Reset email received", "I lost my 2FA device", "Account still locked", "Create Security Ticket"];
      } else if (lower.includes("human") || lower.includes("agent") || lower.includes("person") || lower.includes("escalate") || lower.includes("ticket") || lower.includes("representative")) {
        const ticketRes = executeLocalTool("create_escalation_ticket", {
          customerName: currentContext?.customerName || "Customer",
          customerEmail: currentContext?.customerEmail || "customer@example.com",
          category: "General Support",
          priority: "High",
          summary: lastUserMessage,
          attemptedSolutions: ["Initial AI support dialogue and customer request for human representative"]
        });
        ticketData = ticketRes.ticket;
        replyText = `I have created priority support ticket **#${ticketData.ticketId}** and routed it to our **${ticketData.assignedTeam}**.\n\n` +
          `- **Ticket ID**: \`${ticketData.ticketId}\`\n` +
          `- **Priority**: ${ticketData.priority}\n` +
          `- **Estimated Wait Time**: ~${ticketData.estimatedWaitMinutes} minutes\n` +
          `- **Notification**: Updates will be sent to ${ticketData.customerEmail}\n\n` +
          `A human specialist is reviewing your conversation transcript and will assist you shortly. Is there any extra detail you'd like me to add to the ticket?`;
        quickReplies = ["Add extra notes to ticket", "Check ticket status", "Track another order", "Return to main menu"];
      } else {
        replyText = `Hello! I am your ApexStore Customer Support Assistant. I am here to help you with:\n\n` +
          `• **Orders & Tracking**: Check live shipping status and delivery dates.\n` +
          `• **Returns & Refunds**: Verify 30-day eligibility and start returns.\n` +
          `• **Technical Troubleshooting**: Step-by-step guides for headphones, monitors, standing desks, and keyboards.\n` +
          `• **Account & Warranty**: Password resets, 2FA recovery, and 1-year warranty claims.\n` +
          `• **Human Escalation**: Connect with a specialist if your issue needs advanced support.\n\n` +
          `How can I assist you today?`;
      }

      return res.json({
        reply: replyText,
        toolCall: toolData,
        troubleshootingSteps: stepsData,
        escalationTicket: ticketData,
        suggestedQuickReplies: quickReplies
      });
    }

    // Prepare message contents for Gemini 3.7 Flash with Function Calling
    const conversationHistory: any[] = [];
    
    // Include initial context or prompt
    for (const msg of messages) {
      if (msg.sender === 'user') {
        conversationHistory.push({
          role: 'user',
          parts: [{ text: msg.text }]
        });
      } else if (msg.sender === 'assistant') {
        conversationHistory.push({
          role: 'model',
          parts: [{ text: msg.text }]
        });
      }
    }

    // Call Gemini with tools
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: conversationHistory,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + (currentContext ? `\nCurrent Active User Context: ${JSON.stringify(currentContext)}` : ""),
        tools: [{
          functionDeclarations: [
            lookupOrderDeclaration,
            getPolicyDeclaration,
            getTroubleshootingDeclaration,
            createEscalationDeclaration
          ]
        }]
      }
    });

    let toolData: any = null;
    let stepsData: any = null;
    let ticketData: any = null;
    let finalAssistantText = "";

    const functionCalls = response.functionCalls;

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      const functionName = call.name;
      const functionArgs = (call.args || {}) as Record<string, any>;
      
      const toolResult = executeLocalTool(functionName, functionArgs);
      toolData = {
        name: functionName,
        args: functionArgs,
        result: toolResult
      };

      if (functionName === "get_troubleshooting_guide" && toolResult.success) {
        stepsData = {
          title: toolResult.guide.productName + ": " + toolResult.guide.category,
          steps: toolResult.guide.steps
        };
      }
      if (functionName === "create_escalation_ticket" && toolResult.success) {
        ticketData = toolResult.ticket;
      }

      // Second round to generate natural language response based on function execution
      const toolFollowUp = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          ...conversationHistory,
          {
            role: 'model',
            parts: [{ functionCall: { name: functionName, args: functionArgs } }]
          },
          {
            role: 'user',
            parts: [{
              functionResponse: {
                name: functionName,
                response: toolResult
              }
            }]
          }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        }
      });

      finalAssistantText = toolFollowUp.text || "I have processed your request.";
    } else {
      finalAssistantText = response.text || "I am here to help. How can I assist you with your order, product, or account today?";
    }

    // Dynamic suggested quick replies
    let suggestedReplies: string[] = ["Track an order", "Check return policy", "Troubleshoot a device", "Connect with human agent"];
    if (finalAssistantText.toLowerCase().includes("order") || toolData?.name === "lookup_order") {
      suggestedReplies = ["Check another order", "Start a return", "Shipping questions", "Speak to an agent"];
    } else if (finalAssistantText.toLowerCase().includes("step") || stepsData) {
      suggestedReplies = ["Step worked, thank you!", "Problem still persists", "I need replacement parts", "Escalate to human support"];
    } else if (ticketData) {
      suggestedReplies = ["Check ticket queue status", "Add note to ticket", "Ask another question", "Close conversation"];
    }

    res.json({
      reply: finalAssistantText,
      toolCall: toolData,
      troubleshootingSteps: stepsData,
      escalationTicket: ticketData,
      suggestedQuickReplies: suggestedReplies
    });

  } catch (error: any) {
    console.error("Gemini API Chat Error:", error);
    res.status(500).json({
      error: "Unable to process message at this time.",
      details: error.message
    });
  }
});

// Setup Vite middleware for development vs static serve for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Customer Support Server running on http://localhost:${PORT}`);
  });
}

startServer();
