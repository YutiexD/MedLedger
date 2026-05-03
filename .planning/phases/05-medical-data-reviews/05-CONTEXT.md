# Phase 05: Medical Data & Reviews - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary
This phase finalizes the patient/doctor data feedback loop. Doctors issue clinical prescriptions for completed slots, and patients can rate their experience through a verified review system.
</domain>

<decisions>
## Implementation Decisions

### Digital Prescriptions
- **Rendering:** Use a dedicated `/prescription/[id]` route that is styled for `print`. Provide a "Download/Print" button that triggers `window.print()`.
- **Relationship:** A `Prescription` is linked to a specific `Slot` and `Patient`.
- **Role:** Only the attending doctor can create/edit a prescription for their slot. Only the specific patient can view/print it.

### Review System
- **Eligibility:** Verified by checking if the user has a `Slot` with `status: "BOOKED"` and a matching `doctorId` where the `startTime` is in the past.
- **Components:** Add a star rating and comment form to the `/doctor/[id]` or within the dashboard.
- **Display:** Show the patient's full registered name with their review text.

### Data Security (Standard)
- Use standard MongoDB ACLs and server-side validation to ensure `MED-01` (Sensitive patient clinical history) is only accessible by the patient and their assigned doctor.
</decisions>

<canonical_refs>
## Canonical References
- `src/models/Slot.ts` — relevant for completion check.
- `src/models/User.ts` — for names and specializations.
</canonical_refs>

<deferred>
## Deferred Ideas
- Auto-encryption of clinical notes using client-side keys (deferred for now).
</deferred>
