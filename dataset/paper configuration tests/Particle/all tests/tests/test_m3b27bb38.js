const { expect } = require("chai");

describe("Manager Mutant Kill Test", function() {
    it("Mutant should be killed by modifying the require statement correctly", async function() {
        // Deploy Manager contract
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();
        await manager.deployed();

        // Perform the mutation operation on the contract
        // Correct the mutation in the require statement
        // Change the caller to factoryController instead of address(0)
        await expect(manager.upgradeImplTo("0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000")).to.be.revertedWith("onlyFactoryController");
    });
});