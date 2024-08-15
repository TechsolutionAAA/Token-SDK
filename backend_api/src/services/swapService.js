import { getWallet } from "../utils/web3Provider.js";
import { ethers } from "ethers";

export const swapToken = async (
  fromToken,
  toToken,
  amountIn,
  slippage,
  recipient
) => {
  try {
    const wallet = getWallet();
    const uniswapRouter = new ethers.Contract(
      "0x7a250d5630b4cf539739df2c5dacf0b38ef5e263", // Uniswap V2 Router address
      [
        "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline)",
      ],
      wallet
    );

    const amountOutMin = ethers.utils
      .parseUnits(amountIn, 18)
      .mul(slippage)
      .div(100); // Calculate minimum amount out
    const path = [fromToken, toToken];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    const tx = await uniswapRouter.swapExactTokensForTokens(
      ethers.utils.parseUnits(amountIn, 18),
      amountOutMin,
      path,
      recipient,
      deadline
    );

    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    throw new Error(error.message);
  }
};
