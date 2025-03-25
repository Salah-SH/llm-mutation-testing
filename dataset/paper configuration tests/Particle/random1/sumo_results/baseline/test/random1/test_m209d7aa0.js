const { expect } = require("chai");

describe("Test Case to Kill the Solidity Mutant", function() {
    let manager;

    before(async () => {
        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();
    });

    it("Should kill the mutant by setting a new factory controller correctly using onlyFactoryController modifier", async () => {
        // Get the initial factory controller address
        const initialFactoryController = await manager.factoryController();

        // Set a non-zero address as the new factory controller
        const newFactoryController = "0x1111111111111111111111111111111111111111";

        // Call the setFactoryController function with the owner address to pass the onlyFactoryController modifier
        await expect(manager.setFactoryController(newFactoryController)).to.be.revertedWith("onlyFactoryController");

        // Ensure the factory controller remains the same after trying to set it with a different modifier
        const factoryControllerAfterAttempt = await manager.factoryController();
        expect(factoryControllerAfterAttempt).to.equal(initialFactoryController);
    });
});