# AccessHub

An enterprise-style Role-Based Access Control (RBAC) dashboard that replicates the internal tooling used by IAM, IT Operations, and Security teams to govern employee access across systems. Built to demonstrate production UI patterns: structured access request workflows, approval and rejection flows with audit trails, and role-based permission management — all in a clean, dark-themed internal tool interface.

**[Live Demo →](https://red-moss-0e48f8c03.7.azurestaticapps.net)**

---

## Screenshots

| Dashboard | Access Requests |
|-----------|-----------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Requests](./screenshots/requests.png) |

| Roles | Audit Log |
|-------|-----------|
| ![Roles](./screenshots/roles.png) | ![Audit Log](./screenshots/audit-log.png) |

---

## Features

### Dashboard
- Stat cards showing total users, active users, pending requests, and defined roles
- Live recent activity feed drawn from the audit log

### User Management
- Employee directory spanning six departments: Development, Service Desk, NOC, SOC, Issuer Services, and IAM
- Per-department headcount summary
- Account status tracking: Active, Inactive, Suspended

### Access Request Workflow
- Structured request submission form with requester lookup, department auto-population, and role selection
- Each role displays its risk level (Low / Medium / High / Critical) and a plain-language description before submission
- Requests are filtered by lifecycle status: All, Pending, Approved, Rejected
- **Approval flow** — reviewers can approve a pending request in one action; status, reviewer name, and review date update immediately
- **Rejection flow** — rejections require a written reason via a confirmation modal; the reason is recorded against the request and surfaced in the table
- Action banners confirm each decision with a direct link through to the Audit Log

### Role Management
- Card-based catalogue of all access roles with descriptions, permission scopes, assigned user count, risk classification, and role owner
- Permission badges are colour-coded by sensitivity level

### Audit Log
- Append-only event log covering: request submissions, approvals, rejections, role assignments, access revocations, login failures, and policy changes
- Approve and reject actions write new entries to the top of the log in real time — no page refresh required
- Alert banner flags security-relevant failures for immediate visibility

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | React Context API |
| Data | Typed mock data (no backend) |
| Fonts | Geist Sans / Geist Mono via `next/font` |
| Deployment | Azure Static Web Apps |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/accesshub.git
cd accesshub

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app redirects to `/dashboard` on load.

### Build and Deploy

```bash
npm run build   # Production build
npm run start   # Start production server locally
npm run lint    # Run ESLint
```

The project is configured for deployment to **Azure Static Web Apps**. Any CI/CD pipeline that runs `npm run build` and serves the `.next` output will work, including Vercel and Netlify.

---

## Project Structure

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

## Key Design Decisions

**React Context for cross-page state** — The Requests and Audit Log pages share a single context provider. Approve and reject actions update both pages simultaneously without a backend, routing change, or page reload.

**Typed mock data layer** — All data is defined in `src/lib/mock-data.ts` with full TypeScript interfaces. The shape mirrors what a real API would return, so replacing mock data with live API calls is isolated to the context initialisation.

**Selective use of client components** — Pages with no interactivity (Dashboard, Users, Roles) remain server components. Only Requests and Audit Log use `"use client"` where state and context are required, keeping the client bundle minimal.

**No external component library** — Every UI component is purpose-built with Tailwind CSS. This keeps the dependency surface small, the styling fully visible, and the components easy to adapt.

---

## Future Improvements

- [ ] Authentication (NextAuth.js or Clerk) with role-based route protection
- [ ] Backend integration — REST or tRPC API with a database (e.g. PostgreSQL via Prisma)
- [ ] Email notifications on request approval or rejection
- [ ] Paginated tables with server-side filtering and sorting
- [ ] Search across Users, Requests, and Audit Log
- [ ] Role creation and permission editing UI
- [ ] Bulk approve / reject actions on the Requests page
- [ ] Mobile-responsive layout
- [ ] Unit and integration tests (Jest + React Testing Library)
- [ ] Dark / light theme toggle

---

## License

MIT
