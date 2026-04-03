import { ethers } from "ethers";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const RPC_URL = process.env.SEPOLIA_RPC_URL || "";

// Standard AccessControl ABI fragment for checking roles
const ABI = [
  "function hasRole(bytes32 role, address account) public view returns (bool)",
  "function DOCTOR_ROLE() public view returns (bytes32)"
];

export async function verifyDoctorRole(walletAddress: string): Promise<boolean> {
  if (!walletAddress || !CONTRACT_ADDRESS) return false;

  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    
    const doctorRole = await contract.DOCTOR_ROLE();
    const isDoctor = await contract.hasRole(doctorRole, walletAddress);
    
    return isDoctor;
  } catch (error) {
    console.error("Blockchain role verification failed:", error);
    return false;
  }
}
