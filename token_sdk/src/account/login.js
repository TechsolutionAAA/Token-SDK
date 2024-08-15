import { ethers } from "ethers";

export function loginAccount(privateKey) {
  const wallet = new ethers.Wallet(privateKey);
  return wallet;
}
