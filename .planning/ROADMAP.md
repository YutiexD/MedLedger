# Roadmap

This document outlines the phased execution plan mapping requirements to logical implementation steps.

## Phase 1: Foundation & Theming
**Goal:** Setup basic web app, connect MongoDB, setup Shadcn UI and theming, and initialize Sepolia Smart Contract.
**Requirements:** `UI-01`, `BOOK-01`
**Success Criteria:**
- Next.js/Vite React UI is running with Tailwind and Shadcn.
- Users can click a button to toggle UI between Dark and Light mode.
- Sepolia smart contract is deployed containing Admin functionality that can successfully grant `DOCTOR_ROLE` to an address.
- MongoDB connection is successful and backend server runs.

## Phase 2: Authentication & Landing Page
**Goal:** Implement the hero section for the landing page and the complex animated login page handling both credentials and MetaMask.
**Requirements:** `UI-02`, `AUTH-01`, `AUTH-02`, `AUTH-03`
**Success Criteria:**
- Landing page renders the geometric Framer Motion animated hero (`shape-landing-hero`).
- Login page renders the `animated-characters-login-page`.
- User can successfully register and login with ID/Password (stored in MongoDB).
- User can successfully link their MetaMask wallet signature to their profile.

## Phase 3: Doctor Availability & Search
**Goal:** Doctors can post slots to MongoDB and patients can search them by specialization from the landing page.
**Requirements:** `BOOK-02`, `BOOK-03`
**Success Criteria:**
- User holding `DOCTOR_ROLE` can submit available time slots to the DB.
- Patients on the landing page can search for doctors by providing a specialty (e.g. "Cardiologist") and see available slots.

## Phase 4: Core Booking Engine & Notifications
**Goal:** Patients book slots locking them on the blockchain with transaction proofs and triggering live notifications.
**Requirements:** `BOOK-04`, `BOOK-05`, `BOOK-06`, `UI-03`
**Success Criteria:**
- Patient clicking "Book" signs a tx locking the slot in the smart contract.
- A booked slot disappears from available searches.
- Etherscan transaction link is visible showing the booking confirmation.
- Patient can cancel booking, removing the lock on-chain.
- User receives a real-time toast/alert when a slot is successfully booked or cancelled.

## Phase 5: Medical Data & Reviews
**Goal:** Add off-chain prescriptions and patient reviews to complete the platform.
**Requirements:** `MED-01`, `MED-02`, `MED-03`, `MED-04`
**Success Criteria:**
- Doctor can type out a prescription directly tied to an executed appointment slot and save it off-chain.
- Patient can view/download that prescription.
- Patient can leave a public rating/review for the Doctor.
- Public Doctor pages display aggregate ratings and reviews from previous verified patients.
