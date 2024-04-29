import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config();

type HttpNetworkAccountsUserConfig = /*unresolved*/ any

const config: HardhatUserConfig = {
  solidity: {
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000,
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
    version: "0.8.24",
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_RPC,
      chainId: 534351,
      accounts: [process.env.DEPLOYER_ADDRESS] as HttpNetworkAccountsUserConfig | undefined,
    },
  },
  etherscan: {
    apiKey: process.env.SCROLL_API_KEY,
    customChains: [
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://api-sepolia.scrollscan.com/api',
          browserURL: 'https://sepolia.scrollscan.com/',
        },
      },
    ],
  }
};

export default config;
