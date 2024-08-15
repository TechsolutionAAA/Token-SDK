import { ethers } from "ethers";

let provider = null;
let wallet = null;

const initializeProvider = () => {
  if (!provider) {
    provider = new ethers.providers.InfuraProvider(
      "mainnet",
      process.env.INFURA_PROJECT_ID
    );
  }
  if (!wallet) {
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  }
};

export const getProvider = () => {
  initializeProvider();
  return provider;
};

export const getWallet = () => {
  initializeProvider();
  return wallet;
};
