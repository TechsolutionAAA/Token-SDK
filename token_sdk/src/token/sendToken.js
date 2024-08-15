import { ethers } from "ethers";

export async function sendToken(
  provider,
  senderPrivateKey,
  recipientAddress,
  amount,
  tokenAddress
) {
  const wallet = new ethers.Wallet(senderPrivateKey, provider);
  const tokenContract = new ethers.Contract(
    tokenAddress,
    [
      // ABI for ERC20 transfer
      "function transfer(address to, uint amount) public returns (bool)",
    ],
    wallet
  );

  const tx = await tokenContract.transfer(
    recipientAddress,
    ethers.utils.parseUnits(amount.toString(), 18)
  );
  return tx.wait();
}
