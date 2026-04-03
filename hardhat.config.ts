import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

// Load environment variables
dotenvConfig({ path: ".env.local" });

const config: HardhatUserConfig = {
  solidity: "0.8.20",
};

export default config;
