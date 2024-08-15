import { expect } from "chai";
import sinon from "sinon";
import { ethers } from "ethers";
import { sendToken, receiveToken } from "../src/services/tokenService.js";

describe("Token Service", () => {
  let walletStub, erc20Stub;

  beforeEach(() => {
    walletStub = sinon.stub().returns({
      transfer: sinon.stub().resolves({ wait: sinon.stub() }),
      balanceOf: sinon.stub().resolves(ethers.utils.parseUnits("10", 18)),
    });
    erc20Stub = sinon.stub(ethers, "Contract").returns(walletStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should send token successfully", async () => {
    const result = await sendToken(
      "0xRecipientAddress",
      "10",
      "0xTokenAddress"
    );
    expect(result).to.have.property("success", true);
    expect(result).to.have.property("txHash");
  });

  it("should receive token balance successfully", async () => {
    const result = await receiveToken("0xTokenAddress");
    expect(result).to.have.property("balance", "10.0");
  });
});
