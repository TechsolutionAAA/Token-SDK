import { getWallet } from "../utils/web3Provider.js";
import { ethers } from "ethers";

export const sendToken = async (from, to, amount, tokenAddress) => {
  try {
    if (!from || !ethers.utils.isAddress(from)) {
      throw new Error("Invalid 'from' address");
    }

    if (!to || !ethers.utils.isAddress(to)) {
      throw new Error("Invalid 'to' address");
    }

    if (to === ethers.constants.AddressZero) {
      throw new Error("'To' address cannot be the zero address");
    }

    if (!tokenAddress || !ethers.utils.isAddress(tokenAddress)) {
      throw new Error("Invalid token address");
    }

    if (!amount || amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    const wallet = getWallet();

    if (wallet.address.toLowerCase() !== from.toLowerCase()) {
      throw new Error("Wallet does not match the 'from' address");
    }

    const erc20 = new ethers.Contract(
      tokenAddress,
      [
        "function balanceOf(address owner) view returns (uint)",
        "function allowance(address owner, address spender) view returns (uint)",
        "function transfer(address to, uint amount) returns (bool)",
      ],
      wallet
    );

    const balance = await erc20.balanceOf(wallet.address);
    if (balance.lt(ethers.utils.parseUnits(amount, 18))) {
      throw new Error("Insufficient token balance");
    }

    const allowance = await erc20.allowance(wallet.address, to);
    if (allowance.lt(ethers.utils.parseUnits(amount, 18))) {
      throw new Error("Insufficient allowance for transfer");
    }

    const tx = await erc20.transfer(to, ethers.utils.parseUnits(amount, 18));
    await tx.wait();

    return { success: true, txHash: tx.hash };
  } catch (error) {
    throw new Error(`Transfer failed: ${error.message}`);
  }
};

export const receiveToken = async (from, tokenAddress) => {
  try {
    if (!from || !ethers.utils.isAddress(from)) {
      throw new Error("Invalid 'from' address");
    }

    if (!tokenAddress || !ethers.utils.isAddress(tokenAddress)) {
      throw new Error("Invalid token address");
    }

    const wallet = getWallet();

    const erc20 = new ethers.Contract(
      tokenAddress,
      ["function balanceOf(address owner) view returns (uint)"],
      wallet
    );

    const balance = await erc20.balanceOf(from);
    return { balance: ethers.utils.formatUnits(balance, 18) };
  } catch (error) {
    throw new Error(`Failed to retrieve token balance: ${error.message}`);
  }
};
