import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { defineConfig } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
    },
  },
  networks: {
    zeroG: {
      type: "http",
      chainType: "l1",
      url: "https://evmrpc-testnet.0g.ai",
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
    },
  },
});