import { CustomerOrder, PolicySection, TroubleshootingGuide, EscalationTicket } from '../types';

export const STORE_POLICIES: PolicySection[] = [
  {
    id: 'returns-refunds',
    title: 'Return & Refund Policy',
    category: 'Returns & Refunds',
    summary: 'Standard 30-day return window from delivery date for all unopened or like-new products with original packaging.',
    details: [
      'Items can be returned within 30 calendar days of verified delivery.',
      'Items must include all original packaging, cords, manuals, and accessories in undamaged condition.',
      'Defective or damaged-on-arrival items receive a free prepaid return label and 100% full refund or immediate replacement.',
      'Change of mind / buyer remorse returns incur a flat $5.99 return shipping label fee deducted from the refund.',
      'Refunds are processed to the original payment method within 3-5 business days after warehouse receipt and inspection.',
      'Instant store credit with a 5% bonus is available immediately upon carrier drop-off scan.'
    ],
    keyRules: [
      '30 calendar days from delivery',
      'Original accessories required',
      '3-5 business days refund processing',
      'Free return on defective items'
    ]
  },
  {
    id: 'shipping-delivery',
    title: 'Shipping & Delivery Policy',
    category: 'Shipping & Delivery',
    summary: 'Fast reliable dispatch with real-time carrier tracking for all domestic and international shipments.',
    details: [
      'Standard Shipping (3-5 business days): Free on orders over $50, otherwise $4.99.',
      'Express Shipping (1-2 business days): Flat $12.99 rate.',
      'Orders placed before 2:00 PM EST ship same business day; orders placed after 2:00 PM ship next business day.',
      'Tracking numbers are activated within 12 hours of package handoff to FedEx, UPS, or USPS.',
      'Address changes can only be requested if the order status is still "Processing". Once "In Transit", rerouting requires carrier contact.'
    ],
    keyRules: [
      'Orders > $50 get Free Standard (3-5 days)',
      'Same-day dispatch cutoff: 2:00 PM EST',
      'Address changes only while "Processing"'
    ]
  },
  {
    id: 'warranty-repairs',
    title: 'Hardware Warranty & Protection',
    category: 'Warranty & Repairs',
    summary: 'Comprehensive 1-year limited hardware manufacturer warranty with optional ApexCare+ extended accidental protection.',
    details: [
      '1-Year Limited Warranty covers hardware failures, factory defects, dead pixels (>3), and battery degradation below 80% health within 12 months.',
      'Warranty does NOT cover accidental liquid spills, drops, physical blunt force damage, or unauthorized modifications.',
      'ApexCare+ Protection Plan covers up to 2 accidental damage incidents per 24-month period with a $29 service claim fee.',
      'Warranty replacements are dispatched within 48 hours after defective device authorization.'
    ],
    keyRules: [
      '1-Year standard coverage against defects',
      'No charge for replacement hardware within warranty period',
      'Accidental drops/spills require ApexCare+'
    ]
  },
  {
    id: 'account-security',
    title: 'Account Security & Access',
    category: 'Account & Security',
    summary: 'Protected account credentials, two-factor authentication recovery, and privacy controls.',
    details: [
      'Password reset emails contain a secure token valid for 15 minutes. Check spam/promotions folders if not visible.',
      'Accounts are temporarily locked for 30 minutes after 5 consecutive failed login attempts for customer protection.',
      'To unlock immediately or reset 2FA without access to the authenticator device, identity verification via customer email OTP is required.',
      'Customer support will never ask for your raw password or full 16-digit credit card number.'
    ],
    keyRules: [
      '15-minute reset token expiry',
      'Lockout lasts 30 mins after 5 failed tries',
      'Never share password with support'
    ]
  },
  {
    id: 'payments-billing',
    title: 'Payments & Billing FAQ',
    category: 'Payments & Billing',
    summary: 'Accepted payment channels, billing descriptors, tax calculation, and promotional codes.',
    details: [
      'Accepted methods: Visa, MasterCard, American Express, PayPal, Apple Pay, and Google Pay.',
      'Charges appear on your statement as "APEX*STORE-ONLINE".',
      'Promo codes must be entered during checkout before final authorization; retroactive code application is permitted within 24 hours of order placement by contacting support.',
      'Sales tax is automatically computed based on shipping destination municipality regulations.'
    ],
    keyRules: [
      'Statement descriptor: "APEX*STORE-ONLINE"',
      'Promo adjustment allowed within 24 hours of purchase'
    ]
  }
];

export const MOCK_ORDERS: CustomerOrder[] = [
  {
    id: 'ORD-8921',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.jenkins@example.com',
    item: 'Apex SoundPulse Pro Wireless Noise-Cancelling Headphones',
    productSku: 'APX-HP-800',
    itemImage: '🎧',
    placedDate: '2026-08-17',
    status: 'In Transit',
    carrier: 'FedEx Express',
    trackingNumber: 'FX-9928172635',
    estimatedDelivery: 'Tomorrow, Aug 21 by 7:00 PM',
    total: 149.99,
    returnEligible: true,
    warrantyValidUntil: '2027-08-17'
  },
  {
    id: 'ORD-4412',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@example.com',
    item: 'Apex Flow 4K Ultra-Wide IPS Smart Monitor (27-inch)',
    productSku: 'APX-MON-4K27',
    itemImage: '🖥️',
    placedDate: '2026-08-02',
    deliveryDate: '2026-08-06',
    status: 'Delivered',
    carrier: 'UPS Ground',
    trackingNumber: '1Z9999999999999999',
    estimatedDelivery: 'Delivered on Aug 6, 2026',
    total: 349.00,
    returnEligible: true,
    returnExpiryDate: '2026-09-05 (16 days remaining)',
    warrantyValidUntil: '2027-08-06'
  },
  {
    id: 'ORD-1029',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@example.com',
    item: 'Apex Pro RGB Mechanical Gaming Keyboard (Hot-Swap Tactile)',
    productSku: 'APX-KB-75PRO',
    itemImage: '⌨️',
    placedDate: '2026-07-05',
    deliveryDate: '2026-07-09',
    status: 'Delivered',
    carrier: 'USPS Priority',
    trackingNumber: '9400100000000000000000',
    estimatedDelivery: 'Delivered on Jul 9, 2026',
    total: 119.99,
    returnEligible: false,
    returnExpiryDate: 'Expired on Aug 8, 2026',
    warrantyValidUntil: '2027-07-09 (Covered under 1-Year Warranty)'
  },
  {
    id: 'ORD-7730',
    customerName: 'David Kim',
    customerEmail: 'david.kim@example.com',
    item: 'Apex ErgoDesk Smart Dual-Motor Standing Desk (Solid Walnut 60")',
    productSku: 'APX-DSK-60W',
    itemImage: '🪵',
    placedDate: '2026-08-19',
    status: 'Processing',
    carrier: 'FedEx Freight',
    estimatedDelivery: 'Estimated Dispatch: Today, Aug 20 (Est. Arrival Aug 24)',
    total: 489.00,
    returnEligible: true,
    warrantyValidUntil: '2028-08-19'
  }
];

export const TROUBLESHOOTING_GUIDES: TroubleshootingGuide[] = [
  {
    productIdOrIssue: 'bluetooth-pairing',
    productName: 'Apex SoundPulse Pro Headphones',
    category: 'Connectivity / Bluetooth',
    commonSymptom: 'Headphones not appearing in Bluetooth device list or failing to connect',
    steps: [
      {
        stepNumber: 1,
        title: 'Enter Forced Pairing Mode',
        instruction: 'Turn off the headphones. Press and hold the power button continuously for 5 seconds until the LED flashes rapidly in alternating Red and Blue.',
        tip: 'Do not release when the "Power On" prompt sounds; keep holding until the LED alternates.'
      },
      {
        stepNumber: 2,
        title: 'Clear Stale Bluetooth Cache',
        instruction: 'On your phone or computer, toggle Bluetooth OFF for 10 seconds, toggle it back ON, and remove/forget any previous "Apex SoundPulse" device entries.',
        tip: 'Ensure headphones are within 3 feet (1 meter) of your device.'
      },
      {
        stepNumber: 3,
        title: 'Hardware Factory Reset',
        instruction: 'While powered on, hold Volume Up (+) and Volume Down (-) simultaneously for 8 seconds. The LED will blink Purple twice and the headset will power cycle.',
        tip: 'This clears all previous 8 paired device memories.'
      },
      {
        stepNumber: 4,
        title: 'ApexConnect App Check',
        instruction: 'Open the free ApexConnect mobile app (iOS/Android) and check for pending firmware updates (current latest is v2.4.1).',
        tip: 'Firmware updates resolve audio sync and Bluetooth 5.3 connection drops.'
      }
    ]
  },
  {
    productIdOrIssue: 'monitor-no-signal',
    productName: 'Apex Flow 4K Monitor',
    category: 'Display / Video Output',
    commonSymptom: 'Screen displays "No Signal" or enters sleep mode immediately',
    steps: [
      {
        stepNumber: 1,
        title: 'Verify Input Source in OSD',
        instruction: 'Press the joystick button under the center bezel, navigate to "Input Select", and ensure it is set specifically to your connected port (e.g. "DisplayPort 1.4" or "HDMI 1") rather than Auto-Detect.',
        tip: 'Some graphics cards do not trigger Auto-Detect wakeup.'
      },
      {
        stepNumber: 2,
        title: 'Reseat Cable & Test Ports',
        instruction: 'Unplug both ends of the HDMI 2.1 or DisplayPort cable, check for bent pins, firmly replug into the dedicated GPU port (not the motherboard port).',
        tip: 'Use the braided 8K-certified cable included in the original packaging.'
      },
      {
        stepNumber: 3,
        title: 'Hard Power Discharge Cycle',
        instruction: 'Unplug the monitor power adapter brick from the wall for 60 seconds. While unplugged, hold the monitor power button for 15 seconds to drain residual charge. Reconnect.',
        tip: 'This resets internal EDID handshakes.'
      },
      {
        stepNumber: 4,
        title: 'Lower Initial Resolution / Safe Mode',
        instruction: 'If the PC boots but screen goes black at Windows/macOS login, boot in Safe Mode or connect a secondary display to set refresh rate to 60Hz first.',
        tip: 'Higher refresh rates (144Hz) require DisplayPort 1.4 or HDMI 2.1 DSC.'
      }
    ]
  },
  {
    productIdOrIssue: 'standing-desk-reset',
    productName: 'Apex ErgoDesk Standing Desk',
    category: 'Motor & Calibration',
    commonSymptom: 'Control handset displays error "E08", "RST", or desk only moves down and not up',
    steps: [
      {
        stepNumber: 1,
        title: 'Clear Obstacles & Check Cable Connections',
        instruction: 'Ensure no objects, cords, or under-desk drawers are obstructing leg movement. Check that the motor splitter cable under the desk center beam is firmly snapped in.',
        tip: 'The anti-collision sensor triggers if any resistance is felt.'
      },
      {
        stepNumber: 2,
        title: 'Perform Factory Leveling Reset',
        instruction: 'Press and hold the DOWN arrow button on the digital handset until the desk lowers completely to its minimum height (approx 24.5 inches). Do not release.',
        tip: 'Continue holding the DOWN button for 5 to 7 seconds after it stops.'
      },
      {
        stepNumber: 3,
        title: 'Wait for Handset Beep & "RST" Clear',
        instruction: 'The desk will slightly bounce upward by half an inch, beep twice, and the digital display will switch from "RST" to the numeric height "24.5".',
        tip: 'Both dual motors are now synchronized and calibrated.'
      },
      {
        stepNumber: 4,
        title: 'Test Preset Save',
        instruction: 'Use the UP button to raise the desk to your desired height, press "M" (Memory), then press number "1" to store your sitting preset.',
        tip: 'Presets prevent motor drift over extended usage.'
      }
    ]
  },
  {
    productIdOrIssue: 'account-locked-reset',
    productName: 'Apex Customer Account & Login',
    category: 'Account & Security',
    commonSymptom: 'Account locked due to failed attempts or password reset email not received',
    steps: [
      {
        stepNumber: 1,
        title: 'Check Spam, Promotions & Filter Folders',
        instruction: 'Search your inbox for emails from "security@apexstore.com" with subject line "Apex Account Verification Code".',
        tip: 'Reset tokens expire after exactly 15 minutes.'
      },
      {
        stepNumber: 2,
        title: 'Trigger Direct Single-Use Link',
        instruction: 'Visit the login page, enter your registered email, click "Forgot Password", and ensure you submit only ONE request to avoid invalidating previous tokens.',
        tip: 'Generating multiple links cancels earlier tokens.'
      },
      {
        stepNumber: 3,
        title: 'Clear Browser Cache / Private Window',
        instruction: 'Open an Incognito/Private window or clear site cookies for apexstore.com to prevent stale session redirects.',
        tip: 'Password autofill extensions can inadvertently submit old passwords.'
      },
      {
        stepNumber: 4,
        title: 'Verify Two-Factor Authentication (2FA)',
        instruction: 'If 2FA phone/app is lost, click "Try another way" on the login screen to receive a backup verification code to your verified recovery email.',
        tip: 'If still blocked, our team can verify your identity and generate a manual reset ticket.'
      }
    ]
  }
];

export const INITIAL_ESCALATION_TICKETS: EscalationTicket[] = [
  {
    ticketId: 'TICK-4819',
    customerName: 'Robert Vance',
    customerEmail: 'robert.v@example.com',
    category: 'Returns & Refunds',
    priority: 'Medium',
    summary: 'Customer received damaged exterior freight package on desk top board.',
    attemptedSolutions: ['Reviewed damage photo guidance', 'Confirmed order within 30-day window'],
    status: 'Assigned',
    createdAt: '2026-08-20 08:30 AM',
    estimatedWaitMinutes: 8,
    assignedTeam: 'Tier-2 Logistics & Replacement Team'
  }
];
