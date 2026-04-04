# Requirements

## v1 Requirements

### Authentication
- [ ] **AUTH-01**: User can log in with username/password combinations.
- [ ] **AUTH-02**: User must link their MetaMask wallet to interact with bookings.
- [ ] **AUTH-03**: Implements `animated-characters-login-page` tracking mouse gestures.
- [ ] **AUTH-04**: Admin page available for role and user management.

### Booking & Smart Contract
- [ ] **BOOK-01**: Admin can assign/revoke Doctor roles using Role-Based Access Control on-chain.
- [ ] **BOOK-02**: Doctors can post available appointment time slots to the database.
- [ ] **BOOK-03**: Patients can search and filter doctors by specialization on the home page.
- [ ] **BOOK-04**: Patients can book an available slot, locking it universally via the Sepolia ETH ledger.
- [ ] **BOOK-05**: Patients can cancel appointments, unlocking the slot on-chain.
- [ ] **BOOK-06**: Etherscan links are generated to publicly prove booked slots preventing overlap.
- [ ] **BOOK-07**: On-chain granular role assignment for doctors (Grant/Revoke).

### User Interface & Experience
- [ ] **UI-01**: Features standard Light/Dark mode toggles across all pages.
- [ ] **UI-02**: Home page implements `shape-landing-hero` with Framer Motion elements.
- [ ] **UI-03**: Triggers real-time system notifications for bookings and cancellations.

### Medical Data & Feedback
- [ ] **MED-01**: Off-chain MongoDB system securely holds sensitive patient medical history.
- [ ] **MED-02**: Doctors can issue and attach digital prescriptions to patient profiles post-appointment.
- [ ] **MED-03**: Patients can securely view and download their digital prescriptions.
- [ ] **MED-04**: Patients can leave transparent public reviews for doctors.

## v2 Requirements (Deferred)
(None specified currently)

## Out of Scope
- **Storage of Medical Data on Blockchain**: Handled by MongoDB off-chain due to cost and HIPAA/privacy requirements.
- **Booking Payments**: System only requires gas fees to lock slots.

## Traceability
*(To be populated by the roadmap)*
