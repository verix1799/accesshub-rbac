# AccessHub RBAC Dashboard

A modern Role-Based Access Control (RBAC) dashboard simulating enterprise identity and access workflows.

## 🔗 Live Demo
https://accesshub.vedicsankar.dev

## 📖 Overview
AccessHub is a portfolio project designed to replicate how internal identity teams manage access requests, approvals, and audit logging in a secure enterprise environment.

The system models real-world IAM workflows such as role assignment, approval pipelines, and audit tracking.

---

## ⚙️ Features

### 📊 Dashboard
- Key metrics overview (requests, approvals, failures)
- Recent activity table

### 👥 Users
- View users across departments
- Status indicators (active, suspended)

### 📥 Access Requests
- Submit new access requests
- Approve / reject requests
- Rejection requires justification
- Dynamic filtering (All / Pending / Approved / Rejected)

### 🔐 Roles
- Role cards with permissions and risk levels

### 📜 Audit Log
- Real-time audit entries for all actions
- Tracks approvals, rejections, failures
- Includes timestamps, users, and IP addresses

---

## 🧱 Tech Stack

| Layer        | Technology |
|-------------|------------|
| Frontend    | Next.js (App Router) |
| Language    | TypeScript |
| Styling     | Tailwind CSS |
| State       | React Context API |
| Data        | Mock data (simulated backend) |
| Hosting     | Azure Static Web Apps |

---

## 🚀 Getting Started

```bash
git clone https://github.com/verix1799/accesshub-rbac.git
cd accesshub-rbac
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (sidebar + providers)
│   ├── page.tsx                # Redirects to /dashboard
│   ├── dashboard/page.tsx      # Overview with stat cards and recent activity
│   ├── users/page.tsx          # Employee directory
│   ├── requests/page.tsx       # Access request management + approval flow
│   ├── roles/page.tsx          # Role catalogue
│   └── audit-log/page.tsx      # Audit event log
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Navigation sidebar with active-link detection
│   │   └── Providers.tsx       # Client-side context provider wrapper
│   └── ui/
│       ├── Badge.tsx           # Status/label badge (5 colour variants)
│       ├── StatCard.tsx        # Metric card with optional trend and icon
│       └── DataTable.tsx       # Generic table with per-column render functions
│
├── context/
│   └── AppStateContext.tsx     # Shared state for requests and audit log
│
└── lib/
    └── mock-data.ts            # Typed mock data: users, roles, requests, audit logs
```

---

## 🔮 Future Improvements

- [ ] Authentication with role-based route protection
- [ ] Backend API and database integration
- [ ] Email notifications for approvals and rejections
- [ ] Search and pagination across all tables
- [ ] Mobile-responsive layout

---

## 📄 License

MIT
