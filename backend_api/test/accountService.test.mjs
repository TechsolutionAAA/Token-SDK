import { expect } from "chai";
import {
  generateWallet,
  recoverWallet,
  guardRecovery,
} from "../src/services/accountService.js";

describe("Account Service", () => {
  it("should generate a wallet successfully", () => {
    const wallet = generateWallet();
    expect(wallet).to.have.property("address");
    expect(wallet).to.have.property("privateKey");
    expect(wallet).to.have.property("mnemonic");
  });

  it("should recover a wallet successfully", () => {
    const mnemonic =
      "test test test test test test test test test test test junk";
    const wallet = recoverWallet(mnemonic);
    expect(wallet).to.have.property("address");
    expect(wallet).to.have.property("privateKey");
  });

  it("should validate guard recovery successfully", () => {
    const result = guardRecovery(
      "0xTestAddress",
      process.env.SECONDARY_PASSKEY
    );
    expect(result).to.have.property("success", true);
  });

  it("should throw an error for invalid guard recovery", () => {
    expect(() => guardRecovery("0xTestAddress", "wrong-passkey")).to.throw(
      "Invalid secondary passkey."
    );
  });
});
