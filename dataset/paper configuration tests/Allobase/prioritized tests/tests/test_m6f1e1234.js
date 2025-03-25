const { expect } = require("chai");

// Test case to kill the mutant by setting a different address for assetController using an AssetController
describe("Test case to kill the mutant by setting a different address for assetController", function() {
  it("Should update assetController to a different address as an AssetController", async function() {
    const Manager = await ethers.getContractFactory("Manager");
    const manager = await Manager.deploy();
    await manager.deployed();

    const feeController = await ethers.getSigner(0);
    const factoryController = await ethers.getSigner(1); // Updated to access FactoryController role
    const thirdParty = await ethers.getSigner(2);

    // Get the initial assetController address
    const oldAssetController = await manager.assetController();

    // Generate a new random address for testing
    const differentAddress = await thirdParty.getAddress();

    // Call the setAssetController function with a different address as the Factory Controller instead of Asset Controller
    // This should fail as the mutation requires assetController and the Factory Controller to be the same
    await expect(manager.connect(factoryController).setAssetController(differentAddress)).to.be.revertedWith("onlyAssetController");
  });
});