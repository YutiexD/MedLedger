# Phase 03: Doctor Availability & Search - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary
This phase enables verified doctors to post 15-minute appointment slots and allows patients to discover them through an advanced search interface that filters by specialization and date.
</domain>

<decisions>
## Implementation Decisions

### Slot Management
- **Fixed Duration:** 15 minutes per slot. Doctors should be able to select a "Start Time" and an "End Time", and the backend will automatically generate the corresponding 15-minute intervals.
- **Data Model:** `Slot` model with `doctorId`, `startTime`, `endTime`, `status` (AVAILABLE, BOOKED, CANCELLED), and `patientId` (initially null).

### Search Experience (Advanced)
- Dedicated `/search` page for results using Shadcn UI cards.
- Filter sidebar for specialization (Cardiology, Neurology, Pediatrics, General Practice, etc.).
- Add a search button to the home page hero that redirects to `/search?specialization=X`.

### Role & Verification
- **Middleware:** Implement a backend middleware that uses `ethers.js` (or viem) to check the `HospitalMedLedger` contract's `hasRole(DOCTOR_ROLE, address)` for each slot-posting request.
- Ensure the user's `walletAddress` is linked via `User` model to perform this query.

### Best Practices (Surprising Add-on)
- Automatic cleanup of old (expired) slots.
- Real-time availability indicator in search results.
</decisions>

<canonical_refs>
## Canonical References
- `contracts/HospitalMedLedger.sol` for `DOCTOR_ROLE`.
</canonical_refs>

<deferred>
## Deferred Ideas
- Dynamic slot durations (fixed for now at 15 mins).
</deferred>
