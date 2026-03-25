# MediSync Provider Dashboard Prototype

A high-fidelity, interactive **Provider Dashboard Web App** built with React, Tailwind CSS, and Framer Motion. This prototype simulates a real-world SaaS environment used by medical operations teams.

## 🚀 Key Features

- **Advanced Authentication**: Interactive login screen with mock persistence.
- **Dynamic Dashboard**: Real-time stats, weekly performance tracking, and recent activity monitoring.
- **Core Appointments Module**:
  - Full-featured data table with persistent state.
  - Interactive tabs (Today, New, Confirmed, etc.).
  - Sophisticated search and filtering.
  - High-fidelity **Detail Drawer** for individual appointment management.
- **Interactive UX Features**:
  - Status lifecycle management (New → Confirmed → Completed → Verification Required).
  - Mock **Report Uploading** with drag & drop simulation.
  - Fully functional **Notification Center**.
  - **Profile Management**: Editable identity and professional data.
- **Premium Aesthetics**: Glassmorphism effects, rich typography (Inter), smooth Framer Motion transitions, and a modern color-coordinated design system.

## 🛠 Tech Stack

- **Framework**: React 19 (Hooks)
- **Styling**: Tailwind CSS (Custom Color System & Glassmorphism)
- **Navigation**: React Router 7
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Toasts**: Sonner
- **Utility**: date-fns, clsx, tailwind-merge

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Login Credentials**:
   - **Email**: `admin@provider.com`
   - **Password**: `password`
   (Credentials are pre-filled on the login screen for testing convenience)

## 🏗 Project Structure

```text
src/
├── components/          # Reusable UI & Layout components
│   ├── layout/          # Sidebar, Header, MainLayout
│   ├── ui/              # Button, Badge, Card, etc.
│   └── AppointmentDetailDrawer.jsx
├── context/             # AppContext for global state persistence
├── data/                # Mock data generation logic
├── pages/               # Main feature views (Dashboard, Appointments, Profile, etc.)
├── App.jsx              # Routing & Provider configuration
└── index.css            # Global styles and Tailwind custom layers
```

---
*Built for excellence by Antigravity.*
