# Phase 06: Admin Management - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary
This phase introduces the administrative layer for the platform. Admins can manage user roles (specifically granting/revoking DOCTOR_ROLE on-chain) and view a global overview of the hospital’s medical staff and patients.
</domain>

<decisions>
## Implementation Decisions

### Admin Dashboard
- **Security:** Use a dedicated `/admin` route. For this version, assume any user with `role: "ADMIN"` in MongoDB can access it.
- **Features:** 
    - List all users (Patients, Doctors, Admins).
    - "Promote to Doctor" button: Triggers on-chain `grantRole(DOCTOR_ROLE, walletAddress)` and updates DB `role`.
    - "Revoke Doctor" button: Triggers on-chain `revokeRole(DOCTOR_ROLE, walletAddress)` and resets DB `role`.

### On-chain Role Sync
- Use the existing `HospitalMedLedger` contract.
- Leverage `AccessControl` inherited functions `grantRole` and `revokeRole`.
- Frontend requires an Admin wallet connection to execute these transactions.

### User Management
- Display wallet addresses for verified users to ensure roles are granted to the correct identities.
</decisions>

<canonical_refs>
## Canonical References
- `contracts/HospitalMedLedger.sol` — for `grantRole`/`revokeRole`.
- `src/models/User.ts` — relevant for role updates.
</canonical_refs>

<deferred>
## Deferred Ideas
- Multi-sig admin approvals (deferred for simplicity).
</deferred>
