# AccessHub

A professional, enterprise-style Role-Based Access Control (RBAC) dashboard built with Next.js, TypeScript, and Tailwind CSS. Designed to simulate the kind of internal tooling used by IT, IAM, and Security Operations teams to manage employee access, review requests, and maintain an auditable trail of all actions.

> Built as a portfolio project demonstrating real-world UI patterns for enterprise internal tools.

---

## Screenshots

> _Add screenshots here after running the project locally._

| Dashboard | Access Requests |
|-----------|-----------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Requests](./screenshots/requests.png) |

| Roles | Audit Log |
|-------|-----------|
| ![Roles](./screenshots/roles.png) | ![Audit Log](./screenshots/audit-log.png) |

---

## Features

### Dashboard
- At-a-glance stat cards: total users, active users, pending requests, and total roles
- Recent activity feed pulled from the audit log

### User Management
- Full employee directory across six departments: Development, Service Desk, NOC, SOC, Issuer Services, and IAM
- Per-department headcount breakdown
- Status indicators: Active, Inactive, Suspended

### Access Requests
- Submit new access requests via a modal form with field validation
- Requester lookup auto-populates the department field
- Role selector shows risk level (Low / Medium / High / Critical) and a description hint before submission
- Filter requests by status: All, Pending, Approved, Rejected
- **Approve** requests in one click — status updates immediately
- **Reject** requests via a confirmation modal that requires a written rejection reason
- Submission and action result banners with a direct link to the Audit Log

### Role Management
- Card-based view of all defined roles
- Each card displays the role description, assigned permission scopes, user count, risk level, and owner
- Permission badges are colour-coded by sensitivity

### Audit Log
- Chronological event log of all IAM actions: approvals, rejections, role assignments, access revocations, and security events
- Approve and Reject actions from the Requests page write new entries to the top of the log in real time
- Failure alert banner when security-relevant failures are present

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | React Context API |
| Data | Local mock data (no backend) |
| Fonts | Geist Sans / Geist Mono via `next/font` |

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

### Other Commands

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

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

**React Context for shared state** — The Requests and Audit Log pages share a single context so that approve/reject actions on Requests immediately appear in the Audit Log without a backend or URL-based state.

**Mock data only** — All data lives in `src/lib/mock-data.ts` with full TypeScript interfaces. Replacing it with real API calls requires only updating the context initialisation.

**Server and client components** — Pages that need no interactivity (Users, Roles, Dashboard) are server components. Only the Requests and Audit Log pages opt into `"use client"` for state and context.

**No external UI library** — All components are hand-built with Tailwind to keep the dependency surface minimal and the styling fully transparent.

---

## Future Improvements

- [ ] Authentication (NextAuth.js or Clerk) with role-based route protection
- [ ] Backend integration — REST or tRPC with a database (e.g. PostgreSQL via Prisma)
- [ ] Email notifications on request approval or rejection
- [ ] Paginated tables with server-side filtering and sorting
- [ ] Search and filter controls on the Users and Audit Log pages
- [ ] Dark/light theme toggle
- [ ] Mobile-responsive layout
- [ ] Unit and integration tests (Jest + React Testing Library)
- [ ] Role creation and permission editing UI
- [ ] Bulk actions: approve/reject multiple requests at once

---

## License

MIT
