// Usually receiving tokens doesn't need a special function;
// you'd just listen to events or check balances.
export async function checkBalance(provider, walletAddress, tokenAddress) {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ["function balanceOf(address owner) view returns (uint256)"],
    provider
  );

  const balance = await tokenContract.balanceOf(walletAddress);
  return ethers.utils.formatUnits(balance, 18);
}
