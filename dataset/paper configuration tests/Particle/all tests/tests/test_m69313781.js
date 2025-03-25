const { expect } = require("chai");

describe("Mutant Test: Kill the Mutant at line 821", function() {
  it("Should redeem tokens successfully with an earlier deadline for redemption", async function() {
    const Manager = await ethers.getContractFactory("Manager");
    const manager = await Manager.deploy();
    await manager.deployed();

    // Set up test data
    const symbol = "ABC";
    const fromAddr = await manager.feeController(); // Access feeController address
    const value = 100;
    const tokenIds = [1, 2];
    const deadline = Math.floor(Date.now() / 1000) + 86400;  // Set deadline to 24 hours from now
    const deadlineRedeem = deadline - 3600;  // Set earlier deadline for redemption

    // Redeem tokens successfully with an earlier deadline for redemption
    await expect(async () => {
      await manager.redeemFrom(symbol, fromAddr, value, tokenIds, deadline, deadlineRedeem);
    }).to.not.throw();
  });
});