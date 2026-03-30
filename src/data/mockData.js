import { addDays, subDays, startOfToday, format, setHours, setMinutes, subMonths, subMinutes } from 'date-fns';

const STAGES = ['requested', 'accepted', 'rejected', 'customer_arrived', 'sample_collected', 'report_uploaded', 'completed'];
const PACKAGES = [
  'Comprehensive Health Check',
  'Total Body Wellness',
  'Diamond Heart Profile',
  'Executive Master Checkup',
  'Vitamin Deficiency Panel',
  'Senior Citizen Screening'
];
const BRANCHES = ['Central Clinic', 'Westside Diagnostic', 'East Metro Hub', 'South Bay Wellness'];

const NAMES = [
  'Arjun Sharma', 'Priya Patel', 'Rahul Verma', 'Sneha Reddy', 'Amit Gupta',
  'Anjali Singh', 'Vikram Malhotra', 'Siddharth Rao', 'Deepika Iyer', 'Rohan Mehta'
];

// Generate Appointments with SLA status
const generateAppointment = (id) => {
  const dateOffset = Math.floor(Math.random() * 5) - 2; 
  const hour = Math.floor(Math.random() * 9) + 8;
  const status = STAGES[Math.floor(Math.random() * STAGES.length)];
  const date = setMinutes(setHours(addDays(startOfToday(), dateOffset), hour), 0);
  
  // SLA breach if report not uploaded within 24h of sample collection
  const isSlaBreached = status === 'sample_collected' && isBefore(parseISO(date.toISOString()), subDays(new Date(), 1));

  return {
    id: `APT-${1000 + id}`,
    customerName: NAMES[Math.floor(Math.random() * NAMES.length)],
    phone: `+91 98${Math.floor(Math.random() * 100000000)}`,
    email: `cust${id}@ekincare.com`,
    date: date.toISOString(),
    createdAt: dateOffset === 0 ? subMinutes(new Date(), Math.floor(Math.random() * 20)).toISOString() : subDays(date, 1).toISOString(),
    package: PACKAGES[Math.floor(Math.random() * PACKAGES.length)],
    status,
    branch: BRANCHES[0],
    price: 1200 + (id * 50),
    isSlaBreached: Math.random() > 0.8, // Randomly flag some for demo
    auditLog: [
      { action: 'Requested', timestamp: subDays(date, 2).toISOString(), user: 'System' },
      status !== 'requested' ? { action: 'Updated to ' + status, timestamp: subDays(date, 1).toISOString(), user: 'Dr. Vikram' } : null
    ].filter(Boolean)
  };
};

export const MOCK_APPOINTMENTS = Array.from({ length: 40 }, (_, i) => generateAppointment(i));

// Financial Mock Data
export const MOCK_FINANCIALS = {
  totalVolume: 1240,
  totalRevenue: 450000,
  outstanding: 12500,
  trends: [
    { month: 'Jan', volume: 200, revenue: 80000 },
    { month: 'Feb', volume: 250, revenue: 95000 },
    { month: 'Mar', volume: 300, revenue: 110000 },
    { month: 'Apr', volume: 490, revenue: 165000 },
  ],
  invoices: [
    { id: 'INV-001', date: subDays(new Date(), 15).toISOString(), amount: 45000, status: 'paid', type: 'Tax Invoice' },
    { id: 'INV-002', date: subDays(new Date(), 5).toISOString(), amount: 32000, status: 'approved', type: 'Proforma' },
    { id: 'INV-003', date: new Date().toISOString(), amount: 12500, status: 'submitted', type: 'Tax' },
  ]
};

// RFQ Mock Data
export const MOCK_RFQS = [
  { id: 'RFQ-882', title: 'Corporate Wellness Drive - TechPark Bangalore', company: 'Google India', deadine: addDays(new Date(), 5).toISOString(), status: 'open', tests: 12, volume: '500+ employees' },
  { id: 'RFQ-880', title: 'Annual Checkup 2024', company: 'Infosys', deadine: subDays(new Date(), 1).toISOString(), status: 'quote_submitted', tests: 5, volume: '2000+ employees' },
  { id: 'RFQ-875', title: 'Onsite Health Camp', company: 'Wipro', deadine: subDays(new Date(), 10).toISOString(), status: 'won', tests: 8, volume: '100 employees' },
];

// Support Mock Data
export const MOCK_SUPPORT = {
  rmName: 'Ananya Chatterjee',
  rmPhone: '+91 8877665544',
  rmEmail: 'ananya.c@ekincare.com',
  rmAvailability: 'Mon-Fri, 10 AM - 7 PM',
  faqs: [
    { q: 'How to upload reports in bulk?', a: 'Go to Operational Pendency and use the "Bulk Upload" button at the top right.' },
    { q: 'What to do if customer shows up without appointment?', a: 'Please contact your RM immediately or use the "Quick Add" feature if authorized.' }
  ]
};

// Facility Mock Data
export const MOCK_FACILITY = {
  name: 'Central Diagnostic Center',
  branchName: 'Central Clinic - HSR Layout',
  providerId: 'PROV-32036',
  enterpriseId: 'ENT-604296928',
  partnerSetupEmail: 'partner-setup@ekincare.com',
  address: 'HSR Layout, Sector 2, Bangalore, KA - 560102',
  operationalHours: '08:00 AM - 08:00 PM',
  kycStatus: 'approved', // pending, approved, rejected
  inventory: [
    { name: 'Blood Test (CBC)', enabled: true },
    { name: 'X-Ray Chest', enabled: true },
    { name: 'MRI Scan', enabled: false },
    { name: 'Physician Consultation', enabled: true }
  ]
};

export const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'SLA Breach Alert', message: 'Appointment APT-1024 is delayed by 24h.', time: '10m ago', type: 'danger', read: false },
  { id: 2, title: 'New RFQ Published', message: 'Wipro has published a new wellness drive RFQ.', time: '1h ago', type: 'brand', read: false },
  { id: 3, title: 'Payment Dispatched', message: 'Payment for INV-001 has been processed.', time: '5h ago', type: 'success', read: true },
];

export const MOCK_PROFILE = {
  name: 'Dr. Vikram Aditya',
  role: 'Provider Admin',
  email: 'vikram.v@provider.com',
  phone: '+91 9988776655',
  branch: 'Central Clinic',
  timings: '08:00 AM - 08:00 PM',
  avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'
};

function isBefore(date1, date2) {
  return date1.getTime() < date2.getTime();
}
function parseISO(s) {
  return new Date(s);
}
