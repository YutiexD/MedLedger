# Phase 04: Core Booking Engine & Notifications - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary
This phase introduces the primary transactional logic on-chain and off-chain. Patients can "lock" a 15-minute slot in the smart contract on Sepolia, receive an Etherscan link, and trigger real-time UI notifications.
</domain>

<decisions>
## Implementation Decisions

### Smart Contract Implementation
- **Slot Mapping:** Map `uint256 slotId` to `address patientAddress`.
- **Functions:** 
    - `bookSlot(uint256 slotId)`: Enforces that the slot is not already booked and records the patient.
    - `cancelSlot(uint256 slotId)`: Only the patient or doctor can reset the mapping back to `address(0)`.
- **Etherscan Integration:** Store the transaction hashes returned by MetaMask on the `Slot` MongoDB document for UI display.

### Off-chain Engine 
- **Database Status Sync:** 
    - Booking: `status: AVAILABLE` -> `status: BOOKED`.
    - Cancellation: `status: BOOKED` -> `status: AVAILABLE`. (As per user request to allow re-booking).
- **Authentication:** Use the user's `walletAddress` as their on-chain identity for all booking transactions.

### User Interface & Notifications
- **Toast Notifications:** Implement simple success/failure toasts within the Next.js app (using Shadcn's Toast or Sonner).
- **Etherscan Links:** Add a clickable badge to every booked slot in the dashboard pointing to `sepolia.etherscan.io/tx/{txHash}`.
</decisions>

<canonical_refs>
## Canonical References
- `contracts/HospitalMedLedger.sol` — to be updated.
- `src/app/api/slots/route.ts` — relevant for schema sync.
</canonical_refs>

<deferred>
## Deferred Ideas
- Historical logging of previous bookings on one slot via the DB (slots are simply reset for now).
</deferred>
