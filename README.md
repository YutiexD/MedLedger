# MedLedger - Decentralized Healthcare Platform

MedLedger is a Web3-enabled healthcare booking and prescription management application. It allows patients to book doctors using blockchain technology and ensures that clinical records (prescriptions and attachments) are securely logged.

## Prerequisites

Before running this project, ensure you have the following installed on your machine:
1. **Node.js** (v18 or higher recommended)
2. **MongoDB** (Running locally on default port `27017`)
3. **MetaMask** Browser Extension

## Step 1: Install Dependencies

Open your terminal in the project directory and run:
```bash
npm install
```

## Step 2: Start the Local Blockchain (Hardhat)

You need to run a local Ethereum network to test the smart contracts. In a **new terminal window**, run:
```bash
npx hardhat node
```
*Leave this terminal running in the background.* This will generate 20 test accounts with private keys. You will need these keys for MetaMask.

## Step 3: Deploy the Smart Contract

In **another new terminal window**, deploy the smart contract to your local node:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```
When this command finishes, it will print a **Contract Address** (e.g., `0x5FbDB2315678afecb367f032d93F642f64180aa3`). Copy this address.

## Step 4: Configure Environment Variables

Open the `.env.local` file in the root directory (create it if it doesn't exist) and update it with your deployed contract address:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS="<PASTE_YOUR_CONTRACT_ADDRESS_HERE>"
SEPOLIA_RPC_URL="http://127.0.0.1:8545"
MONGODB_URI="mongodb://127.0.0.1:27017/medledger"
JWT_SECRET="your_jwt_secret_key"
```

## Step 5: Configure MetaMask

1. Open MetaMask and click the network dropdown at the top.
2. Select **Add Network** -> **Add a network manually**.
3. Fill in the details:
   - **Network Name:** Localhost 8545
   - **New RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
4. Save and switch to this network.
5. Click **Import Account** and paste one of the "Private Keys" generated in Step 2 by your Hardhat node terminal.

## Step 6: Start the Application

Start the Next.js development server:
```bash
npm run dev
```
*(If you are on Windows and encounter a PowerShell Execution Policy error, run `cmd.exe /c npm run dev` instead).*

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: How to Test

1. **Admin / Doctor Setup:**
   - Register a new user as a "Doctor".
   - Your connected MetaMask wallet will be automatically registered on the blockchain as a verified Doctor.
   - Go to "Manage Slots" and generate time slots for booking.

2. **Patient Flow:**
   - Open an Incognito window or different browser and register as a "Patient".
   - Import a *different* Hardhat Private Key into MetaMask.
   - Go to "Find Doctors", search for the doctor, and book an available slot (confirm the MetaMask transaction).

3. **Prescription Flow:**
   - As the Doctor, go back to "Manage Slots". The slot will now be marked "BOOKED".
   - Click "Write Rx", fill out the medication details, attach a file (optional), and hit "Save".
   - As the Patient, go to "My Appointments" and click "View Rx" to see the immutable clinical record!
