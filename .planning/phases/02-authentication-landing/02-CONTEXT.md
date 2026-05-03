# Phase 02: Authentication & Landing Page - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary
This phase implements the high-fidelity UI landing page and interactive login component. It wires up the backend authentication using MongoDB for standard credentials and connects local MetaMask state for Web3 identity.
</domain>

<decisions>
## Implementation Decisions

### Landing Page
- Use the provided `shape-landing-hero` component directly on `/`.
- Include the "Book Slot" or "Search Doctors" call to actions using Shadcn UI buttons.

### Authentication Strategy
- **Web2 Login:** API routes to handle User registration/login bridging to MongoDB `User` model.
- **Web3 Login:** Browser-level MetaMask injection detection mapping wallet addresses to the MongoDB `User` document.
- Use `animated-characters-login-page` component as the primary view for `/login`.

### Data Schema
- `User` model requires `email`, `password` (hashed), and `walletAddress` (optional but required to interact with smart contract).
</decisions>

<canonical_refs>
## Canonical References
No external specs. Visual references handled exclusively by the provided Shadcn code blocks from Phase 0 planning.
</canonical_refs>

<deferred>
## Deferred Ideas
- JWT persistent sessions (might just use standard NextAuth or simple HttpOnly cookies later if needed).
</deferred>
