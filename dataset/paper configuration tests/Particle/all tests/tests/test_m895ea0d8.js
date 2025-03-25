const { expect } = require("chai");

describe("Manager Mutation Test", function() {
    let manager;
    
    before(async () => {
        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();
    });

    it("Testing the mutant: changing && to || in the contract", async function() {
        // Attempting to set factory controller from a non-authorized address
        const nonAuthorized = "0x0123456789012345678901234567890123456789";
        // The mutation changed '&&' to '||' in the modifier onlyFactoryController
        // So, we should be able to set factory controller from a non-authorized address
        await expect(manager.connect(ethers.provider.getSigner(1)).setFactoryController(nonAuthorized)).to.be.revertedWith('onlyFactoryController');

        // Verify that the factory controller remains unchanged
        const updatedFactoryController = await manager.factoryController;
        expect(updatedFactoryController).to.not.equal(nonAuthorized);
    });

    // This test case aims to kill the mutant by verifying that the factory controller cannot be set from a non-authorized address
});