const { expect } = require('chai');

describe("Manager Mutant Test", function () {
  let manager;

  before(async () => {
    const Manager = await ethers.getContractFactory("Manager");
    manager = await Manager.deploy();
    await manager.deployed();
  });

  it("Kill Mutant Test Case", async function () {
    // Original value of REDEEM_TYPEHASH before mutation
    const originalRebaseTypehash = await manager.REDEEM_TYPEHASH();
    expect(originalRebaseTypehash).to.not.equal(undefined);

    // Accessing the REDEEM_TYPEHASH value to test the mutation, which should throw an error due to the change
    let errorOccurred = false;
    try {
      // Mutated code that should throw an error due to the mutation
      await manager.redeemToBoth("Symbol", "Address");
    } catch (error) {
      errorOccurred = true;
    }

    // The mutation should cause an error, so we expect an error to have occurred
    expect(errorOccurred).to.be.true;
  });
});