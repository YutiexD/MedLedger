import { defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

export default defineConfig({
  solidity: "0.8.20",
  plugins: [hardhatEthers],
  networks: {
    sepolia: {
      type: "http",
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
    },
  },
});
