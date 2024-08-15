import dotenv from "dotenv";
dotenv.config();
import { Wallet, HDNodeWallet } from "ethers";

// Generate a new wallet and mnemonic
export const generateWallet = () => {
  const newWallet = Wallet.createRandom();
  return {
    address: newWallet.address,
    privateKey: newWallet.privateKey,
    mnemonic: newWallet.mnemonic.phrase,
  };
};

// Recover a wallet from a mnemonic
export const recoverWallet = (mnemonic) => {
  try {
    const recoveredWallet = HDNodeWallet.fromPhrase(mnemonic.trim());
    return {
      address: recoveredWallet.address,
      privateKey: recoveredWallet.privateKey,
    };
  } catch (error) {
    throw new Error("Failed to recover wallet: " + error.message);
  }
};

export const guardRecovery = (address, secondaryPasskey) => {
  // Implement a proper guard recovery mechanism here
  if (secondaryPasskey === process.env.SECONDARY_PASSKEY) {
    return { success: true, message: "Recovery guard validated successfully." };
  } else {
    throw new Error("Invalid secondary passkey.");
  }
};
