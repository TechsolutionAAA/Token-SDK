import { ethers } from "ethers";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const ROUTER_ADDRESSES = {
  ethereum: "0xE592427A0AEce92De3Edee1F18E0157C05861564", // Uniswap V3 Router on Ethereum
  base: "0xBASE_ROUTER_ADDRESS", // Base network is relatively new, and routers may vary
  arbitrum: "0xE592427A0AEce92De3Edee1F18E0157C05861564", // Uniswap V3 Router on Arbitrum
  optimism: "0xE592427A0AEce92De3Edee1F18E0157C05861564", // Uniswap V3 Router on Optimism
  bsc: "0x10ED43C718714eb63d5aA57B78B54704E256024E", // PancakeSwap Router on Binance Smart Chain (BSC)
};

export async function swapToken(
  network,
  providerOrConnection,
  senderPrivateKey,
  amountIn,
  amountOutMin,
  path,
  to,
  deadline
) {
  if (network === "solana") {
    return await swapOnSolana(
      providerOrConnection,
      senderPrivateKey,
      amountIn,
      amountOutMin,
      path,
      to
    );
  } else {
    return await swapOnEVM(
      network,
      providerOrConnection,
      senderPrivateKey,
      amountIn,
      amountOutMin,
      path,
      to,
      deadline
    );
  }
}

// Function to handle token swap on EVM-compatible chains
async function swapOnEVM(
  network,
  provider,
  senderPrivateKey,
  amountIn,
  amountOutMin,
  path,
  to,
  deadline
) {
  const wallet = new ethers.Wallet(senderPrivateKey, provider);
  const routerAddress = ROUTER_ADDRESSES[network];

  const routerContract = new ethers.Contract(
    routerAddress,
    [
      "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline) external returns (uint[] memory amounts)",
    ],
    wallet
  );

  const tx = await routerContract.swapExactTokensForTokens(
    ethers.utils.parseUnits(amountIn.toString(), 18),
    ethers.utils.parseUnits(amountOutMin.toString(), 18),
    path,
    to,
    deadline
  );
  return tx.wait();
}

// Function to handle token swap on Solana
async function swapOnSolana(
  connection,
  senderPrivateKey,
  amountIn,
  amountOutMin,
  path,
  to
) {
  // Placeholder for Solana swap logic, such as using Serum or Raydium
  const fromToken = new Token(
    connection,
    path[0],
    TOKEN_PROGRAM_ID,
    new PublicKey(senderPrivateKey)
  );
  const toToken = new Token(
    connection,
    path[1],
    TOKEN_PROGRAM_ID,
    new PublicKey(senderPrivateKey)
  );

  const transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      fromToken.publicKey,
      toToken.publicKey,
      new PublicKey(senderPrivateKey),
      [],
      amountIn
    )
  );

  // Send and confirm the transaction
  const signature = await connection.sendTransaction(transaction, [
    new PublicKey(senderPrivateKey),
  ]);
  await connection.confirmTransaction(signature);

  return {
    status: "Success",
    signature,
  };
}

export async function swapWithNativeCoin(
  action, // "buy" or "sell"
  network,
  provider,
  senderPrivateKey,
  amountIn,
  amountOutMin,
  tokenAddress,
  to,
  deadline
) {
  const wallet = new ethers.Wallet(senderPrivateKey, provider);
  const routerAddress = ROUTER_ADDRESSES[network];

  const routerContract = new ethers.Contract(
    routerAddress,
    action === "buy"
      ? [
          "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline) external returns (uint[] memory amounts)",
        ]
      : [
          "function swapExactETHForTokens(uint amountOutMin, address[] path, address to, uint deadline) external payable returns (uint[] memory amounts)",
        ],
    wallet
  );

  const path =
    action === "buy"
      ? [tokenAddress, ethers.constants.AddressZero]
      : [ethers.constants.AddressZero, tokenAddress];

  if (action === "buy") {
    // Swap tokens for native coin
    const tx = await routerContract.swapExactTokensForETH(
      ethers.utils.parseUnits(amountIn.toString(), 18),
      ethers.utils.parseUnits(amountOutMin.toString(), 18),
      path,
      to,
      deadline
    );
    return tx.wait();
  } else {
    // Swap native coin for tokens
    const tx = await routerContract.swapExactETHForTokens(
      ethers.utils.parseUnits(amountOutMin.toString(), 18),
      path,
      to,
      deadline,
      { value: ethers.utils.parseUnits(amountIn.toString(), 18) }
    );
    return tx.wait();
  }
}
