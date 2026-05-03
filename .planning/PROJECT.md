# Hospital Booking Web3 Platform

## Core Value
A fully blockchain-based hospital booking system on Sepolia ETH that securely manages appointment slots while keeping sensitive medical records private via off-chain MongoDB storage.

## What This Is
This project bridges the gap between Web3 transparency and Web2 data privacy. The platform enables patients to search and book appointments with doctors based on their specializations, and allows doctors to manage their time slots and issue prescriptions.

The architecture is split between on-chain and off-chain responsibilities:
- **Sepolia ETH Blockchain:** Acts as an immutable ledger to lock/unlock booked time slots to prevent double-booking collisions. It also handles Role-Based Access Control (RBAC) to securely identify verified Doctor accounts. Transaction transparency is maintained via public Etherscan links.
- **Node.js/Express & MongoDB:** Handles all off-chain logic and sensitive data storage. This includes mapping ID/Password credentials to MetaMask wallets, storing detailed medical records, doctor reviews, post-appointment digital prescriptions, and managing real-time notifications.
- **Frontend (React/TypeScript, Tailwind CSS, Shadcn UI, Framer Motion):** Provides a visually stunning user experience featuring a Dark/Light mode toggle, a geometric animated landing page (`shape-landing-hero.tsx`), and a highly interactive cartoon login page (`animated-characters-login-page.tsx`).

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Connect users via unified login (ID/Password + MetaMask mapping).
- [ ] Implement smart contract on Sepolia ETH for locking/unlocking slots and granting Doctor roles.
- [ ] Implement backend API (Node + Express) connected to MongoDB for secure data storage.
- [ ] Build interactive geometric landing home page with doctor search by specialization.
- [ ] Build an animated login page with dynamic tracking characters.
- [ ] Patient Dashboard: Book/cancel slots, view Etherscan links for booked slots, view prescriptions, leave doctor reviews.
- [ ] Doctor Dashboard: Post slots, view appointments, issue printable prescriptions.
- [ ] Real-time notification system for bookings and cancellations.
- [ ] Dark/Light mode thematic UI toggle.

### Out of Scope

- [ ] On-chain data storage for medical records — Too expensive and severe privacy risks (HIPAA non-compliance); handled via MongoDB.
- [ ] Monetary booking fees — App currently operates solely with gas fees on testnet for slot locking.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hybrid On-chain/Off-chain architecture | Sensitive medical data must be private and cheap to store; double-bookings must be visibly prevented via immutable blockchain ledgers. | — Pending |
| Vite/Next.js + Express Backend | Clean separation of concerns allowing the backend to securely manage MongoDB while keeping the frontend responsive and optimized for Web3. | — Pending |
| Extensive Frontend Animations | Provides a premium Web2 feel to a Web3 application, increasing user engagement and modern aesthetic. | — Pending |

## UI Specifications
*Note: We have logged two specific Shadcn UI components provided during planning (`shape-landing-hero` and `animated-characters-login-page`) and their dependencies (`framer-motion`, `lucide-react`, radix primitives) to be implemented directly upon project initialization.*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-03 after initialization*
