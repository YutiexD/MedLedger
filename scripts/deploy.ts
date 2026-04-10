import { network } from "hardhat";
import "@nomicfoundation/hardhat-ethers";

async function main() {
  console.log("Connecting to network...");
  const { ethers } = await network.connect();
  
  console.log("Deploying HospitalMedLedger...");

  const HospitalMedLedger = await ethers.getContractFactory("HospitalMedLedger");
  
  // Deploy the contract
  const contract = await HospitalMedLedger.deploy();

  // Wait for the deployment to finish
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("==========================================");
  console.log(`HospitalMedLedger deployed to: ${address}`);
  console.log("==========================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
