export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  department: string;
  lastActive: string;
  employeeId: string;
  title: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  owner: string;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export interface AccessRequest {
  id: string;
  ticketId: string;
  requester: string;
  requesterEmail: string;
  requesterDepartment: string;
  type: "access" | "role_change" | "permission" | "offboarding";
  resource: string;
  justification: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
  status: "success" | "failed";
  details?: string;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const users: User[] = [
  // IAM
  { id: "u01", employeeId: "EMP-1042", name: "Rachel Okonkwo", email: "r.okonkwo@nexacorp.com", title: "IAM Lead", role: "IAM Admin", status: "active", department: "IAM", lastActive: "4 mins ago" },
  { id: "u02", employeeId: "EMP-1078", name: "Daniel Ferreira", email: "d.ferreira@nexacorp.com", title: "IAM Engineer", role: "IAM Engineer", status: "active", department: "IAM", lastActive: "22 mins ago" },

  // Development
  { id: "u03", employeeId: "EMP-2011", name: "Marcus Webb", email: "m.webb@nexacorp.com", title: "Senior Software Engineer", role: "Developer – Prod Access", status: "active", department: "Development", lastActive: "11 mins ago" },
  { id: "u04", employeeId: "EMP-2034", name: "Priya Nair", email: "p.nair@nexacorp.com", title: "Software Engineer II", role: "Developer – Non-Prod", status: "active", department: "Development", lastActive: "1 hour ago" },
  { id: "u05", employeeId: "EMP-2057", name: "Tyler Benson", email: "t.benson@nexacorp.com", title: "DevOps Engineer", role: "CI/CD Pipeline Operator", status: "active", department: "Development", lastActive: "38 mins ago" },
  { id: "u06", employeeId: "EMP-2089", name: "Amara Diallo", email: "a.diallo@nexacorp.com", title: "Junior Developer", role: "Developer – Non-Prod", status: "active", department: "Development", lastActive: "2 hours ago" },

  // Service Desk
  { id: "u07", employeeId: "EMP-3015", name: "Kevin Hartley", email: "k.hartley@nexacorp.com", title: "Service Desk Analyst", role: "Service Desk Tier 1", status: "active", department: "Service Desk", lastActive: "5 mins ago" },
  { id: "u08", employeeId: "EMP-3022", name: "Sophia Reyes", email: "s.reyes@nexacorp.com", title: "Service Desk Lead", role: "Service Desk Tier 2", status: "active", department: "Service Desk", lastActive: "18 mins ago" },
  { id: "u09", employeeId: "EMP-3041", name: "Nate Osei", email: "n.osei@nexacorp.com", title: "Service Desk Analyst", role: "Service Desk Tier 1", status: "inactive", department: "Service Desk", lastActive: "3 days ago" },

  // NOC
  { id: "u10", employeeId: "EMP-4008", name: "Leah Johansson", email: "l.johansson@nexacorp.com", title: "NOC Engineer", role: "NOC Operator", status: "active", department: "NOC", lastActive: "9 mins ago" },
  { id: "u11", employeeId: "EMP-4019", name: "Carlos Mendez", email: "c.mendez@nexacorp.com", title: "Senior NOC Engineer", role: "NOC Senior Operator", status: "active", department: "NOC", lastActive: "31 mins ago" },

  // SOC
  { id: "u12", employeeId: "EMP-5003", name: "Yusuf Al-Rashid", email: "y.alrashid@nexacorp.com", title: "SOC Analyst L2", role: "SOC Analyst", status: "active", department: "SOC", lastActive: "2 mins ago" },
  { id: "u13", employeeId: "EMP-5011", name: "Ingrid Larsson", email: "i.larsson@nexacorp.com", title: "SOC Lead", role: "SOC Lead Analyst", status: "active", department: "SOC", lastActive: "14 mins ago" },
  { id: "u14", employeeId: "EMP-5027", name: "Ethan Powell", email: "e.powell@nexacorp.com", title: "SOC Analyst L1", role: "SOC Analyst", status: "active", department: "SOC", lastActive: "47 mins ago" },

  // Issuer Services
  { id: "u15", employeeId: "EMP-6004", name: "Fatima Al-Amin", email: "f.alamin@nexacorp.com", title: "Issuer Services Manager", role: "Issuer Services Manager", status: "active", department: "Issuer Services", lastActive: "1 hour ago" },
  { id: "u16", employeeId: "EMP-6018", name: "James Whitfield", email: "j.whitfield@nexacorp.com", title: "Issuer Services Analyst", role: "Issuer Services Read-Only", status: "active", department: "Issuer Services", lastActive: "3 hours ago" },
  { id: "u17", employeeId: "EMP-6033", name: "Meera Krishnamurthy", email: "m.krishnamurthy@nexacorp.com", title: "Issuer Services Analyst", role: "Issuer Services Read-Only", status: "suspended", department: "Issuer Services", lastActive: "12 days ago" },
];

// ─── Roles ────────────────────────────────────────────────────────────────────

export const roles: Role[] = [
  {
    id: "r01",
    name: "IAM Admin",
    description: "Full access to identity and access management platform. Can provision, modify, and revoke any user role or permission.",
    permissions: ["iam:read", "iam:write", "iam:delete", "user:manage", "role:manage", "audit:read", "policy:write"],
    userCount: 2,
    createdAt: "2023-06-01",
    owner: "Rachel Okonkwo",
    riskLevel: "critical",
  },
  {
    id: "r02",
    name: "IAM Engineer",
    description: "Read and write access to IAM configurations. Cannot delete roles or manage critical policies.",
    permissions: ["iam:read", "iam:write", "user:read", "role:read", "audit:read"],
    userCount: 3,
    createdAt: "2023-06-01",
    owner: "Rachel Okonkwo",
    riskLevel: "high",
  },
  {
    id: "r03",
    name: "Developer – Prod Access",
    description: "Elevated developer access including read access to production environments and deployment approval rights.",
    permissions: ["repo:read", "repo:write", "deploy:prod-read", "deploy:staging", "ci:trigger", "secrets:read"],
    userCount: 6,
    createdAt: "2023-08-15",
    owner: "Marcus Webb",
    riskLevel: "high",
  },
  {
    id: "r04",
    name: "Developer – Non-Prod",
    description: "Standard developer access scoped to non-production environments only.",
    permissions: ["repo:read", "repo:write", "deploy:staging", "ci:trigger"],
    userCount: 14,
    createdAt: "2023-08-15",
    owner: "Marcus Webb",
    riskLevel: "medium",
  },
  {
    id: "r05",
    name: "CI/CD Pipeline Operator",
    description: "Access to manage and operate CI/CD pipelines across all environments, including production deployment gates.",
    permissions: ["ci:read", "ci:write", "ci:trigger", "deploy:prod", "deploy:staging", "infra:read"],
    userCount: 4,
    createdAt: "2023-09-01",
    owner: "Tyler Benson",
    riskLevel: "critical",
  },
  {
    id: "r06",
    name: "Service Desk Tier 1",
    description: "Basic support access: read-only user lookup, password reset initiation, and ticket management.",
    permissions: ["user:read", "ticket:read", "ticket:write", "password:reset"],
    userCount: 11,
    createdAt: "2023-06-01",
    owner: "Sophia Reyes",
    riskLevel: "low",
  },
  {
    id: "r07",
    name: "Service Desk Tier 2",
    description: "Elevated support access including group membership changes and escalation handling.",
    permissions: ["user:read", "user:write", "ticket:read", "ticket:write", "group:write", "password:reset"],
    userCount: 5,
    createdAt: "2023-06-01",
    owner: "Sophia Reyes",
    riskLevel: "medium",
  },
  {
    id: "r08",
    name: "NOC Operator",
    description: "Read access to infrastructure monitoring, alerting dashboards, and incident ticketing.",
    permissions: ["monitoring:read", "alerts:read", "ticket:write", "infra:read"],
    userCount: 8,
    createdAt: "2023-07-10",
    owner: "Carlos Mendez",
    riskLevel: "low",
  },
  {
    id: "r09",
    name: "NOC Senior Operator",
    description: "NOC operator access plus ability to acknowledge alerts, run remediation runbooks, and escalate incidents.",
    permissions: ["monitoring:read", "monitoring:write", "alerts:read", "alerts:write", "ticket:write", "infra:read", "runbook:execute"],
    userCount: 3,
    createdAt: "2023-07-10",
    owner: "Carlos Mendez",
    riskLevel: "medium",
  },
  {
    id: "r10",
    name: "SOC Analyst",
    description: "Access to SIEM, threat intelligence feeds, and incident response tooling for security event investigation.",
    permissions: ["siem:read", "threat-intel:read", "ticket:write", "endpoint:read", "log:read"],
    userCount: 7,
    createdAt: "2023-07-01",
    owner: "Ingrid Larsson",
    riskLevel: "high",
  },
  {
    id: "r11",
    name: "SOC Lead Analyst",
    description: "Full SOC tooling access including alert triage, containment actions, and forensic log access.",
    permissions: ["siem:read", "siem:write", "threat-intel:read", "ticket:write", "endpoint:read", "endpoint:isolate", "log:read", "forensics:read"],
    userCount: 2,
    createdAt: "2023-07-01",
    owner: "Ingrid Larsson",
    riskLevel: "critical",
  },
  {
    id: "r12",
    name: "Issuer Services Manager",
    description: "Full access to issuer client configurations, transaction data, and exception handling workflows.",
    permissions: ["issuer:read", "issuer:write", "transactions:read", "exceptions:write", "reporting:read", "client-config:write"],
    userCount: 3,
    createdAt: "2023-10-01",
    owner: "Fatima Al-Amin",
    riskLevel: "critical",
  },
  {
    id: "r13",
    name: "Issuer Services Read-Only",
    description: "Read-only access to issuer dashboards and reports. No ability to modify client configurations.",
    permissions: ["issuer:read", "reporting:read"],
    userCount: 9,
    createdAt: "2023-10-01",
    owner: "Fatima Al-Amin",
    riskLevel: "low",
  },
];

// ─── Access Requests ──────────────────────────────────────────────────────────

export const accessRequests: AccessRequest[] = [
  {
    id: "req01",
    ticketId: "INC-20441",
    requester: "Priya Nair",
    requesterEmail: "p.nair@nexacorp.com",
    requesterDepartment: "Development",
    type: "role_change",
    resource: "Developer – Prod Access",
    justification: "Promoted to lead on Project Phoenix. Requires read access to production logs for incident investigations.",
    status: "pending",
    createdAt: "2026-04-21",
  },
  {
    id: "req02",
    ticketId: "INC-20438",
    requester: "Nate Osei",
    requesterEmail: "n.osei@nexacorp.com",
    requesterDepartment: "Service Desk",
    type: "access",
    resource: "Active Directory – Group Write",
    justification: "Requires group management rights to handle Tier 2 escalations during Sophia Reyes' leave period.",
    status: "pending",
    createdAt: "2026-04-21",
  },
  {
    id: "req03",
    ticketId: "INC-20431",
    requester: "Ethan Powell",
    requesterEmail: "e.powell@nexacorp.com",
    requesterDepartment: "SOC",
    type: "permission",
    resource: "Endpoint Isolation – CrowdStrike",
    justification: "Needed to support L2 analyst tasks during high-volume threat campaign. Manager-approved escalation.",
    status: "pending",
    createdAt: "2026-04-20",
  },
  {
    id: "req04",
    ticketId: "INC-20419",
    requester: "Amara Diallo",
    requesterEmail: "a.diallo@nexacorp.com",
    requesterDepartment: "Development",
    type: "access",
    resource: "AWS Production Account (Read-Only)",
    justification: "Debugging intermittent latency issue in prod. Requires CloudWatch log access for one sprint.",
    status: "pending",
    createdAt: "2026-04-20",
  },
  {
    id: "req05",
    ticketId: "INC-20407",
    requester: "Carlos Mendez",
    requesterEmail: "c.mendez@nexacorp.com",
    requesterDepartment: "NOC",
    type: "permission",
    resource: "Runbook Execution – Kubernetes Restart",
    justification: "Automated remediation runbook needed for recurring pod crash-loop on API gateway cluster.",
    status: "approved",
    createdAt: "2026-04-18",
    reviewedBy: "Rachel Okonkwo",
    reviewedAt: "2026-04-19",
  },
  {
    id: "req06",
    ticketId: "INC-20398",
    requester: "James Whitfield",
    requesterEmail: "j.whitfield@nexacorp.com",
    requesterDepartment: "Issuer Services",
    type: "role_change",
    resource: "Issuer Services Manager",
    justification: "Requested self-elevation to Manager role to handle client config changes without approval delays.",
    status: "rejected",
    createdAt: "2026-04-17",
    reviewedBy: "Rachel Okonkwo",
    reviewedAt: "2026-04-17",
    rejectionReason: "Role elevation requires documented business case and VP sign-off. Standard read-only access is sufficient for current responsibilities.",
  },
  {
    id: "req07",
    ticketId: "INC-20385",
    requester: "Kevin Hartley",
    requesterEmail: "k.hartley@nexacorp.com",
    requesterDepartment: "Service Desk",
    type: "access",
    resource: "ServiceNow Admin Console",
    justification: "Need admin access to configure automated routing rules for the new onboarding ticket queue.",
    status: "approved",
    createdAt: "2026-04-16",
    reviewedBy: "Daniel Ferreira",
    reviewedAt: "2026-04-17",
  },
  {
    id: "req08",
    ticketId: "INC-20374",
    requester: "Meera Krishnamurthy",
    requesterEmail: "m.krishnamurthy@nexacorp.com",
    requesterDepartment: "Issuer Services",
    type: "access",
    resource: "Transaction Exception Queue – Write",
    justification: "Required to clear backlogged exceptions from the Q1 batch processing failure.",
    status: "rejected",
    createdAt: "2026-04-15",
    reviewedBy: "Fatima Al-Amin",
    reviewedAt: "2026-04-15",
    rejectionReason: "User account is currently under review by HR and InfoSec following a policy compliance incident. Access expansion not permitted.",
  },
  {
    id: "req09",
    ticketId: "INC-20361",
    requester: "Tyler Benson",
    requesterEmail: "t.benson@nexacorp.com",
    requesterDepartment: "Development",
    type: "permission",
    resource: "Terraform State – Production Write",
    justification: "Infrastructure-as-code migration to new state backend. Temporary write access required to complete cutover.",
    status: "approved",
    createdAt: "2026-04-14",
    reviewedBy: "Rachel Okonkwo",
    reviewedAt: "2026-04-14",
  },
  {
    id: "req10",
    ticketId: "INC-20349",
    requester: "Leah Johansson",
    requesterEmail: "l.johansson@nexacorp.com",
    requesterDepartment: "NOC",
    type: "offboarding",
    resource: "All NOC Tooling Access",
    justification: "Internal transfer to SOC team effective 2026-05-01. Access should be revoked upon role change completion.",
    status: "pending",
    createdAt: "2026-04-19",
  },
];

// ─── Audit Log ────────────────────────────────────────────────────────────────

export const auditLogs: AuditLog[] = [
  {
    id: "a01",
    user: "Rachel Okonkwo",
    action: "Role Assigned",
    resource: "Carlos Mendez → NOC Senior Operator",
    timestamp: "2026-04-21 14:55:03",
    ip: "10.10.1.42",
    status: "success",
    details: "Approved via INC-20407",
  },
  {
    id: "a02",
    user: "Priya Nair",
    action: "Access Request Submitted",
    resource: "Developer – Prod Access (INC-20441)",
    timestamp: "2026-04-21 13:47:28",
    ip: "10.10.2.88",
    status: "success",
    details: "Awaiting IAM review",
  },
  {
    id: "a03",
    user: "Nate Osei",
    action: "Access Request Submitted",
    resource: "Active Directory – Group Write (INC-20438)",
    timestamp: "2026-04-21 13:12:09",
    ip: "10.10.3.55",
    status: "success",
    details: "Awaiting Service Desk Lead approval",
  },
  {
    id: "a04",
    user: "Rachel Okonkwo",
    action: "User Suspended",
    resource: "Meera Krishnamurthy (EMP-6033)",
    timestamp: "2026-04-21 11:30:00",
    ip: "10.10.1.42",
    status: "success",
    details: "Suspended pending HR and InfoSec review",
  },
  {
    id: "a05",
    user: "Meera Krishnamurthy",
    action: "Approval Attempt – Insufficient Privilege",
    resource: "Transaction Exception Queue – Write",
    timestamp: "2026-04-21 10:08:47",
    ip: "10.10.6.31",
    status: "failed",
    details: "Account suspended; request blocked by policy engine",
  },
  {
    id: "a06",
    user: "Ethan Powell",
    action: "Access Request Submitted",
    resource: "Endpoint Isolation – CrowdStrike (INC-20431)",
    timestamp: "2026-04-20 17:22:54",
    ip: "10.10.5.14",
    status: "success",
    details: "Escalated by SOC Lead Ingrid Larsson",
  },
  {
    id: "a07",
    user: "Rachel Okonkwo",
    action: "Request Rejected",
    resource: "Issuer Services Manager – James Whitfield (INC-20398)",
    timestamp: "2026-04-17 16:05:11",
    ip: "10.10.1.42",
    status: "success",
    details: "Rejected: role elevation policy not met",
  },
  {
    id: "a08",
    user: "James Whitfield",
    action: "Unauthorized Access Attempt",
    resource: "Client Configuration Portal",
    timestamp: "2026-04-17 15:58:39",
    ip: "10.10.6.77",
    status: "failed",
    details: "Attempted direct access before IAM review completed",
  },
  {
    id: "a09",
    user: "Daniel Ferreira",
    action: "Request Approved",
    resource: "ServiceNow Admin Console – Kevin Hartley (INC-20385)",
    timestamp: "2026-04-17 11:44:20",
    ip: "10.10.1.61",
    status: "success",
    details: "Time-limited access granted for 30 days",
  },
  {
    id: "a10",
    user: "Tyler Benson",
    action: "Permission Granted",
    resource: "Terraform State – Production Write",
    timestamp: "2026-04-14 09:30:55",
    ip: "10.10.2.103",
    status: "success",
    details: "Approved via INC-20361; expires 2026-04-21",
  },
  {
    id: "a11",
    user: "Rachel Okonkwo",
    action: "Access Revoked",
    resource: "Terraform State – Production Write – Tyler Benson",
    timestamp: "2026-04-21 09:01:14",
    ip: "10.10.1.42",
    status: "success",
    details: "Scheduled expiry enforced; access window closed",
  },
  {
    id: "a12",
    user: "Fatima Al-Amin",
    action: "Request Rejected",
    resource: "Transaction Exception Queue – Write – Meera Krishnamurthy (INC-20374)",
    timestamp: "2026-04-15 14:19:33",
    ip: "10.10.6.05",
    status: "success",
    details: "Rejected: account under active compliance review",
  },
  {
    id: "a13",
    user: "Ingrid Larsson",
    action: "Role Assigned",
    resource: "Ethan Powell → SOC Analyst L2 (temporary elevation)",
    timestamp: "2026-04-13 08:52:47",
    ip: "10.10.5.02",
    status: "success",
    details: "Temporary elevation for threat campaign response; expires 2026-04-27",
  },
  {
    id: "a14",
    user: "Amara Diallo",
    action: "Access Request Submitted",
    resource: "AWS Production Account – Read-Only (INC-20419)",
    timestamp: "2026-04-20 15:41:07",
    ip: "10.10.2.91",
    status: "success",
    details: "Approved by dev lead; pending IAM provisioning",
  },
  {
    id: "a15",
    user: "Yusuf Al-Rashid",
    action: "Bulk Export – Audit Log",
    resource: "Audit Logs 2026-04-01 to 2026-04-14",
    timestamp: "2026-04-14 17:03:22",
    ip: "10.10.5.09",
    status: "success",
    details: "Exported for monthly SOC compliance report",
  },
];
