<!-- GSD:project-start source:PROJECT.md -->
## Project

**Hospital Booking Web3 Platform**

This project bridges the gap between Web3 transparency and Web2 data privacy. The platform enables patients to search and book appointments with doctors based on their specializations, and allows doctors to manage their time slots and issue prescriptions.

The architecture is split between on-chain and off-chain responsibilities:
- **Sepolia ETH Blockchain:** Acts as an immutable ledger to lock/unlock booked time slots to prevent double-booking collisions. It also handles Role-Based Access Control (RBAC) to securely identify verified Doctor accounts. Transaction transparency is maintained via public Etherscan links.
- **Node.js/Express & MongoDB:** Handles all off-chain logic and sensitive data storage. This includes mapping ID/Password credentials to MetaMask wallets, storing detailed medical records, doctor reviews, post-appointment digital prescriptions, and managing real-time notifications.
- **Frontend (React/TypeScript, Tailwind CSS, Shadcn UI, Framer Motion):** Provides a visually stunning user experience featuring a Dark/Light mode toggle, a geometric animated landing page (`shape-landing-hero.tsx`), and a highly interactive cartoon login page (`animated-characters-login-page.tsx`).

**Core Value:** A fully blockchain-based hospital booking system on Sepolia ETH that securely manages appointment slots while keeping sensitive medical records private via off-chain MongoDB storage.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
