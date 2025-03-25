const { expect } = require("chai");

describe("Manager Mutation Test", function() {
  it("Mutant test: AssetControllerSet is mutated", async function() {
    const [owner, newController, nonController] = await ethers.getSigners(); // Adding a signer who is not the asset controller

    const Manager = await ethers.getContractFactory("Manager");
    const manager = await Manager.deploy();
    await manager.deployed();

    const oldAddr = await manager.assetController();

    // Attempting to set the asset controller by a non-controller address
    try {
      await manager.connect(nonController).setAssetController(newController.address);
    } catch (error) {
      // Verifying that the transaction reverts with 'onlyAssetController'
      expect(error.message).to.contain('onlyAssetController');
    }

    // Ensuring that the asset controller address remains unchanged
    const newAddr = await manager.assetController();
    expect(oldAddr).to.equal(newAddr);
  });
});