import { expect } from "chai";
import sinon from "sinon";
import { ethers } from "ethers";
import { swapToken } from "../src/services/swapService.js";

describe("Swap Service", () => {
  let walletStub, uniswapRouterStub;

  beforeEach(() => {
    walletStub = sinon.stub().returns({
      swapExactTokensForTokens: sinon.stub().resolves({ wait: sinon.stub() }),
    });
    uniswapRouterStub = sinon.stub(ethers, "Contract").returns(walletStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should swap token successfully", async () => {
    const result = await swapToken(
      "0xFromTokenAddress",
      "0xToTokenAddress",
      "10",
      1,
      "0xRecipientAddress"
    );
    expect(result).to.have.property("success", true);
    expect(result).to.have.property("txHash");
  });
});
