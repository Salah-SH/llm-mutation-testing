const { expect } = require("chai");

describe("Manager Mutation Test", function() {
  let manager;
  let owner = "alice"; // Owner address

  beforeEach(async () => {
    const Manager = await ethers.getContractFactory("Manager");
    manager = await Manager.deploy();
    await manager.deployed();
  });

  it("Test for mutated condition in redeemFrom function", async function () {
    const tokenIds = [1];
    const deadline = Math.floor(Date.now() / 1000) + 3600; // Set deadline 1 hour in the future
    const v = 27; // Adding v value
    const r = "0x123456"; // Adding r value
    const s = "0x789abc"; // Adding s value

    try {
      // Call redeemFrom with the correct condition (value >= tokenWeights)
      await manager.redeemFrom(
        "symbol",
        owner,
        2000, // redeemFeeRate
        [1000, 1000], // Use a value greater than the tokenWeights
        [deadline, deadline],
        [v, v],
        [r, s, r, s],
        tokenIds
      );
    } catch (error) {
      if (error.message.includes("invalid redeem amount")) {
        // This error message should NOT be thrown because the condition is met
        throw new Error("Mutant is alive. Test failed to kill the mutant.");
      }
    }

    // If no error is thrown, the mutant is killed successfully
  });
});